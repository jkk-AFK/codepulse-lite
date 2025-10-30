/**
 * 错误消息常量
 */

export const ERROR_MESSAGES = {
  // GitHub API错误
  RATE_LIMIT: {
    title: 'API调用次数已达上限',
    message: '您的API调用次数已达到限制。建议配置GitHub Token以提高限额，或等待限制重置后再试。',
    action: '查看配置指南',
  },
  
  NOT_FOUND: {
    title: '仓库不存在',
    message: '未找到指定的GitHub仓库，请检查仓库地址是否正确。',
    action: '重新输入',
  },
  
  UNAUTHORIZED: {
    title: '认证失败',
    message: 'GitHub Token无效或已过期，请重新配置有效的Token。',
    action: '配置Token',
  },
  
  NETWORK_ERROR: {
    title: '网络连接失败',
    message: '无法连接到GitHub服务器，请检查您的网络连接。',
    action: '重试',
  },
  
  FORBIDDEN: {
    title: '访问被拒绝',
    message: '您没有访问此仓库的权限，该仓库可能是私有的。',
    action: '返回',
  },
  
  TIMEOUT: {
    title: '请求超时',
    message: '请求处理时间过长，请稍后重试。',
    action: '重试',
  },
  
  UNKNOWN: {
    title: '操作失败',
    message: '发生了未知错误，请稍后重试。如果问题持续存在，请联系支持。',
    action: '重试',
  },
  
  // 验证错误
  INVALID_INPUT: {
    title: '输入格式错误',
    message: '请输入正确的GitHub仓库地址格式，例如：owner/repo',
    action: '修正输入',
  },
  
  EMPTY_INPUT: {
    title: '请输入仓库地址',
    message: '仓库地址不能为空，请输入要分析的GitHub仓库。',
    action: '输入仓库',
  },
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

export default ERROR_MESSAGES;
