import { Activity, Heart } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Heart className="w-8 h-8 text-cyan-400 animate-pulse" />
              <Activity className="w-8 h-8 text-blue-400 absolute top-0 left-0 opacity-50" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CodePulse
              </h1>
              <p className="text-xs text-gray-400">GitHub仓库健康度分析平台</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              关于
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm py-2 px-4"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
