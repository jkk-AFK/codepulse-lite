/**
 * 错误处理工具
 * 统一的错误处理和转换机制
 */

import { ERROR_MESSAGES, type ErrorMessageKey } from '../constants/messages';

/**
 * 错误类型
 */
export const ErrorType = {
  RATE_LIMIT: 'RATE_LIMIT',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  INVALID_INPUT: 'INVALID_INPUT',
  EMPTY_INPUT: 'EMPTY_INPUT',
  UNKNOWN: 'UNKNOWN',
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

/**
 * API错误类
 */
export class APIError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode?: number;
  public readonly details?: unknown;
  public readonly userMessage: string;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.userMessage = this.getUserMessage();

    // 维护正确的原型链
    Object.setPrototypeOf(this, APIError.prototype);
  }

  /**
   * 获取用户友好的错误消息
   */
  private getUserMessage(): string {
    const errorKey = this.type as ErrorMessageKey;
    const errorInfo = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.UNKNOWN;
    return errorInfo.message;
  }

  /**
   * 获取错误标题
   */
  getTitle(): string {
    const errorKey = this.type as ErrorMessageKey;
    const errorInfo = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.UNKNOWN;
    return errorInfo.title;
  }

  /**
   * 获取建议操作
   */
  getAction(): string {
    const errorKey = this.type as ErrorMessageKey;
    const errorInfo = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.UNKNOWN;
    return errorInfo.action;
  }
}

/**
 * 错误处理器
 */
export class ErrorHandler {
  /**
   * 处理错误并转换为APIError
   * @param error 原始错误对象
   * @returns 标准化的APIError
   */
  static handle(error: unknown): APIError {
    // 如果已经是APIError，直接返回
    if (error instanceof APIError) {
      return error;
    }

    // 处理Octokit错误
    if (this.isOctokitError(error)) {
      return this.handleOctokitError(error);
    }

    // 处理网络错误
    if (this.isNetworkError(error)) {
      return new APIError(
        'Network request failed',
        ErrorType.NETWORK,
        undefined,
        error
      );
    }

    // 处理标准Error对象
    if (error instanceof Error) {
      return new APIError(
        error.message,
        ErrorType.UNKNOWN,
        undefined,
        error
      );
    }

    // 处理其他类型的错误
    return new APIError(
      String(error),
      ErrorType.UNKNOWN,
      undefined,
      error
    );
  }

  /**
   * 检查是否是Octokit错误
   */
  private static isOctokitError(error: unknown): error is { status: number; message?: string; response?: { headers?: Record<string, string> } } {
    return error !== null && typeof error === 'object' && 'status' in error;
  }

  /**
   * 处理Octokit特定错误
   */
  private static handleOctokitError(error: { status: number; message?: string; response?: { headers?: Record<string, string> } }): APIError {
    const status = error.status;
    const message = error.message || 'GitHub API请求失败';

    switch (status) {
      case 401:
        return new APIError(
          message,
          ErrorType.UNAUTHORIZED,
          401,
          error
        );

      case 403:
        // 检查是否是限流错误
        if (this.isRateLimitError(error)) {
          return new APIError(
            message,
            ErrorType.RATE_LIMIT,
            403,
            error
          );
        }
        return new APIError(
          message,
          ErrorType.FORBIDDEN,
          403,
          error
        );

      case 404:
        return new APIError(
          message,
          ErrorType.NOT_FOUND,
          404,
          error
        );

      case 408:
      case 504:
        return new APIError(
          message,
          ErrorType.TIMEOUT,
          status,
          error
        );

      default:
        return new APIError(
          message,
          ErrorType.UNKNOWN,
          status,
          error
        );
    }
  }

  /**
   * 检查是否是限流错误
   */
  static isRateLimitError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    // 检查响应头中的限流信息
    const errorObj = error as { response?: { headers?: Record<string, string | number> }; message?: string };
    if (errorObj.response?.headers) {
      const remaining = errorObj.response.headers['x-ratelimit-remaining'];
      if (remaining === '0' || remaining === 0) {
        return true;
      }
    }

    // 检查错误消息
    const message = String(errorObj.message || '').toLowerCase();
    return message.includes('rate limit') || message.includes('api rate');
  }

  /**
   * 检查是否是网络错误
   */
  private static isNetworkError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const errorObj = error as { message?: string; code?: string };
    const message = String(errorObj.message || '').toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection') ||
      errorObj.code === 'ECONNREFUSED' ||
      errorObj.code === 'ENOTFOUND'
    );
  }

  /**
   * 检查是否是404错误
   */
  static isNotFoundError(error: unknown): boolean {
    if (error instanceof APIError) {
      return error.type === ErrorType.NOT_FOUND;
    }
    if (this.isOctokitError(error)) {
      return error.status === 404;
    }
    return false;
  }

  /**
   * 检查是否应该重试
   */
  static shouldRetry(error: unknown): boolean {
    if (error instanceof APIError) {
      // 网络错误和超时错误可以重试
      return error.type === ErrorType.NETWORK || error.type === ErrorType.TIMEOUT;
    }
    return false;
  }

  /**
   * 格式化错误消息用于显示
   */
  static formatMessage(error: unknown): string {
    if (error instanceof APIError) {
      return error.userMessage;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }

  /**
   * 获取错误的完整信息
   */
  static getErrorInfo(error: unknown): {
    title: string;
    message: string;
    action: string;
    type: ErrorType;
  } {
    const apiError = this.handle(error);
    return {
      title: apiError.getTitle(),
      message: apiError.userMessage,
      action: apiError.getAction(),
      type: apiError.type,
    };
  }

  /**
   * 验证仓库地址格式
   */
  static validateRepoInput(input: string): APIError | null {
    if (!input || input.trim() === '') {
      return new APIError(
        'Repository input is empty',
        ErrorType.EMPTY_INPUT
      );
    }

    // 验证格式: owner/repo
    const pattern = /^[\w.-]+\/[\w.-]+$/;
    if (!pattern.test(input.trim())) {
      return new APIError(
        'Invalid repository format',
        ErrorType.INVALID_INPUT
      );
    }

    return null;
  }
}

export default ErrorHandler;
