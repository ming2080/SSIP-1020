import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  X,
  Radio,
  Footprints,
  BellRing,
  Settings2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface LoginProps {
  onLogin: (userInfo?: { username: string; role: string; name: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // 初始化检查记住的账号
  useEffect(() => {
    const savedUser = localStorage.getItem('shipyard_remembered_user');
    if (savedUser) {
      setUsername(savedUser);
    }
  }, []);

  // 提交登录逻辑
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('请输入用户名');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('请输入密码');
      return;
    }

    setIsLoading(true);

    // 记住账号处理
    if (rememberMe) {
      localStorage.setItem('shipyard_remembered_user', username.trim());
    } else {
      localStorage.removeItem('shipyard_remembered_user');
    }

    // 模拟工业级鉴权延迟与响应
    setTimeout(() => {
      setIsLoading(false);
      let role = '系统管理员';
      let name = '张工 (系统管理员)';

      if (username.toLowerCase().includes('safe') || username.includes('安全')) {
        role = '安全总监';
        name = '陈志强 (安全总监)';
      } else if (username.toLowerCase().includes('inspect') || username.includes('巡检')) {
        role = '当班安全员';
        name = '李伟 (当班安全员)';
      }

      // 触发登录成功回调
      onLogin({ username: username.trim(), role, name });
    }, 550);
  };

  // 预设快捷测试账号填充
  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage(null);
  };

  // 核心技术特性定义（强调空间高精度测距、动态电子围栏、船模数字孪生，无块状突兀感，米级测距）
  const featureCapsules = [
    {
      icon: Radio,
      title: '空间高精测距',
      desc: '人员精准感知 · 米级动态测距',
      iconColor: 'text-cyan-300',
      iconBg: 'bg-cyan-500/15 border-cyan-400/30',
    },
    {
      icon: Footprints,
      title: '时空轨迹跟踪',
      desc: '作业动态回溯 · 全程可视审计',
      iconColor: 'text-emerald-300',
      iconBg: 'bg-emerald-500/15 border-emerald-400/30',
    },
    {
      icon: BellRing,
      title: '动态电子围栏',
      desc: '自适应空间布防 · 毫秒级越界告警',
      iconColor: 'text-amber-300',
      iconBg: 'bg-amber-500/15 border-amber-400/30',
    },
    {
      icon: Settings2,
      title: '船模数字孪生',
      desc: '三维虚实映射 · 船坞全景协同管控',
      iconColor: 'text-sky-300',
      iconBg: 'bg-sky-500/15 border-sky-400/30',
    },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-slate-800 font-sans flex flex-col justify-between">
      
      {/* 1. 真实船厂宏伟底层背景图（100% 原画超清无滤镜呈现） */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/assets/login_backgroud.png" 
          alt="智慧船厂全景背景" 
          className="w-full h-full object-cover object-center pointer-events-none"
        />
        
        {/* 仅在左侧文字区域保留极轻微的微光自然渐变，确保文字清晰易读，背景 100% 原汁原味超清呈现 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. 顶部微型品牌栏与做小处理的宣传标语 */}
      <header className="relative z-20 w-full px-6 sm:px-10 lg:px-14 pt-5 pb-3 flex items-center justify-between">
        
        {/* 左侧：品牌展示（无白框直接融入背景，亮色发光高质感呈现） */}
        <div className="flex items-center gap-3.5 group">
          <img 
            src="/assets/extracted_logo.png" 
            alt="智慧船厂系统Logo" 
            className="h-8 sm:h-9 w-auto object-contain brightness-110 contrast-105 drop-shadow-[0_0_16px_rgba(56,189,248,0.4)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-105 group-hover:brightness-125 shrink-0"
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-base sm:text-lg tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                智慧船厂系统
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 backdrop-blur-xs shadow-xs">
                V2.6 PRO
              </span>
            </div>
            {/* 做小处理的系统副标 */}
            <span className="text-[10px] text-sky-200/90 font-medium tracking-[0.16em] scale-95 origin-left drop-shadow-xs">
              数字赋能 · 安全高效 · 智慧管理
            </span>
          </div>
        </div>

        {/* 右侧：宣传标语做小处理（小巧精致的半透微光胶囊） */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/20 shadow-xs text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-xs font-medium tracking-wide">
              让船厂更智慧 · 让管理更高效
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[10px] font-medium shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>服务运行正常</span>
          </div>
        </div>
      </header>

      {/* 3. 中部核心内容区：左侧融于背景的技术特性排版 + 右侧晶体白磨砂居中登录卡片 */}
      <main className="relative z-20 flex-1 w-full px-6 sm:px-10 lg:px-14 py-4 flex items-center justify-between gap-8 max-w-[1580px] mx-auto">
        
        {/* 左侧视觉区：强调空间高精度测距、动态电子围栏与船模数字孪生 */}
        <div className="flex-1 max-w-xl text-left hidden md:flex flex-col justify-center space-y-5">
          
          {/* 重点技术标签 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs w-fit shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[11px] font-medium tracking-wide text-cyan-200">
              空间高精度测距 · 动态电子围栏 · 船模数字孪生
            </span>
          </div>

          {/* 做小处理的主标语 */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-white tracking-tight leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              智慧船厂 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">赋能空间安全生产</span>
            </h2>
            {/* 强调三大技术特性的宣传说明（已去除北斗卫星导航等字眼） */}
            <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed font-normal max-w-lg drop-shadow-xs">
              深度融合空间高精度测距感知、动态电子围栏自适应布控与船模数字孪生三维引擎，构筑船舶建造与维保全流程数字化安全防护网。
            </p>
          </div>

          {/* 四大技术特性（无块状感，深度融于背景的流体无框排版） */}
          <div className="pt-2">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-lg py-3 px-4 rounded-2xl bg-slate-950/25 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              {featureCapsules.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 group transition-all duration-300"
                  >
                    <div className={`w-7 h-7 rounded-lg ${item.iconBg} border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`w-3.5 h-3.5 ${item.iconColor}`} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white tracking-wide group-hover:text-cyan-200 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-sky-100/75 mt-0.5 font-normal tracking-tight">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 底部信任指示标签（做小处理） */}
          <div className="flex items-center gap-5 text-[11px] text-white/90 pt-1 font-medium drop-shadow-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>空间高精测距感知</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>动态围栏毫秒告警</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>船模三维数字孪生</span>
            </div>
          </div>
        </div>

        {/* 右侧交互登录卡片：高透纯白微晶磨砂卡片 */}
        <div className="w-full md:w-[390px] lg:w-[410px] shrink-0 mx-auto md:mx-0">
          <div className="relative rounded-2xl bg-white/92 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(2,20,55,0.22),0_4px_16px_rgba(0,0,0,0.04)] border border-white overflow-hidden transition-all text-left">
            
            {/* 卡片高光装饰流光线 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

            {/* 卡片头部：欢迎登录与副标题居中对齐，右侧不重复显示Logo */}
            <div className="flex flex-col items-center justify-center text-center mb-5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                欢迎登录
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 tracking-wide font-medium">
                智慧船厂空间数字化管理平台
              </p>
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mt-2.5 opacity-80" />
            </div>

            {/* 错误提示 */}
            {errorMessage && (
              <div className="mb-3.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2 animate-shake">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 登录表单 */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* 用户名输入框 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  账号名称
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入工号或管理员用户名"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/80 hover:bg-white focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 transition-all"
                  />
                </div>
              </div>

              {/* 密码输入框 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  登录口令
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/80 hover:bg-white focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer"
                    title={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 记住账号与忘记密码 */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500/30 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[11px] font-medium">记住当前账号</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                >
                  忘记密码?
                </button>
              </div>

              {/* 登录操作主按钮 */}
              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.45)] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>身份验证中...</span>
                    </div>
                  ) : (
                    <>
                      <span>安全登录系统</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* 快速体验角色一键切换（小胶囊设计） */}
            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 font-medium">
                <span>体验演示账号（点击快速填入）:</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin', '123456')}
                  className={`px-1.5 py-1 rounded-md border text-[10px] font-bold transition-all cursor-pointer ${
                    username === 'admin' 
                       ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  管理员
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('safety', '123456')}
                  className={`px-1.5 py-1 rounded-md border text-[10px] font-bold transition-all cursor-pointer ${
                    username === 'safety' 
                      ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  安全总监
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('inspector', '123456')}
                  className={`px-1.5 py-1 rounded-md border text-[10px] font-bold transition-all cursor-pointer ${
                    username === 'inspector' 
                      ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  当班安全员
                </button>
              </div>

              {/* 游客直达 */}
              <div className="mt-2.5 text-center">
                <button
                  type="button"
                  onClick={() => onLogin({ username: 'admin', role: '系统管理员', name: '张工 (系统管理员)' })}
                  className="text-[10px] font-medium text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>游客直接免密进入工作台</span>
                  <span>➔</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* 4. 底部微版权声明栏（半透明微光做小处理） */}
      <footer className="relative z-20 w-full px-6 sm:px-10 py-2.5 flex items-center justify-between text-[10px] text-white/80 border-t border-white/10 bg-slate-950/20 backdrop-blur-md">
        <div>
          <span>© 2026 智慧船厂数字化协同与安全管控系统 All Rights Reserved.</span>
        </div>
        <div className="flex items-center gap-3 font-medium">
          <span>空间高精测距定位集群</span>
          <span>·</span>
          <span>船模三维数字孪生底座</span>
          <span>·</span>
          <span className="font-mono text-cyan-300 font-bold">动态电子围栏已启用</span>
        </div>
      </footer>

      {/* 忘记密码引导弹窗 */}
      {showForgotModal && (
        <div 
          onClick={() => setShowForgotModal(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 text-slate-800 text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-800">密码找回与重置服务</h4>
              </div>
              <button 
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 py-1">
              <p>为了保障智慧船厂工业物联与安全生产数据机密性，系统密码重置遵循安保审计流程：</p>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">数字化管控中心内线:</span>
                  <span className="font-mono font-bold text-slate-800">8806 / 8808</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">安全值班主任专线:</span>
                  <span className="font-mono font-bold text-slate-800">138-0580-9988</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">演示环境默认密码:</span>
                  <span className="font-mono font-bold text-blue-600">123456</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                您也可以直接点击登录卡片下方预设的“管理员”、“安全总监”或“游客直接免密进入”。
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
