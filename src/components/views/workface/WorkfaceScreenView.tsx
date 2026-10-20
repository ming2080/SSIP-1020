/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 智慧船厂 - 作业面大屏视图
 * 对应源码路径: src/yxkj-v5.html
 * 涵盖：有限空间与重点区域大屏安全监控系统、真实全屏、新窗口独立打开、返回作业面配置联动
 */

import React, { useRef, useState, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  RotateCw, 
  ArrowLeft, 
  Tv, 
  Layers, 
  SlidersHorizontal,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface WorkfaceScreenViewProps {
  onNavigateToConfig?: () => void;
  onNavigateToMonitor?: () => void;
}

export function WorkfaceScreenView({
  onNavigateToConfig,
  onNavigateToMonitor
}: WorkfaceScreenViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 监听全屏变动
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 切换全屏
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        // ignore
      });
    } else {
      document.exitFullscreen().catch(() => {
        // ignore
      });
    }
  };

  // 刷新大屏
  const handleReload = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  // 新窗口打开
  const handleOpenNewTab = () => {
    window.open('/yxkj-v5.html', '_blank');
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-[#00060f] overflow-hidden select-none"
    >
      {/* 顶部悬浮控制栏 (常驻右上角极简胶囊，兼顾沉浸感与便捷操控) */}
      <div className="absolute top-3 right-4 z-40 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-xl transition-all hover:bg-slate-900/95">
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-700/80">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-cyan-300 font-mono tracking-wider flex items-center gap-1">
            <Tv className="w-3.5 h-3.5 text-cyan-400" />
            <span>作业面大屏</span>
          </span>
        </div>

        {/* 切换全屏 */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="p-1 text-slate-300 hover:text-cyan-300 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title={isFullscreen ? '退出全屏' : '进入大屏全屏模式'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* 刷新大屏数据 */}
        <button
          type="button"
          onClick={handleReload}
          className="p-1 text-slate-300 hover:text-cyan-300 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title="刷新大屏"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* 新标签页独立打开 */}
        <button
          type="button"
          onClick={handleOpenNewTab}
          className="p-1 text-slate-300 hover:text-cyan-300 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title="在新窗口独立打开大屏"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* 返回作业面配置 */}
        {onNavigateToConfig && (
          <button
            type="button"
            onClick={onNavigateToConfig}
            className="flex items-center gap-1 pl-2 border-l border-slate-700/80 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="返回作业面配置后台"
          >
            <SlidersHorizontal className="w-3 h-3 text-blue-400" />
            <span>配置台账</span>
          </button>
        )}
      </div>

      {/* 加载中骨架占位 */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#010a18] z-30 text-cyan-400">
          <div className="relative w-12 h-12 flex items-center justify-center mb-4">
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <Tv className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-sm font-bold tracking-widest text-slate-200">
            正在载入智慧船厂有限空间与重点区域大屏监控系统...
          </div>
          <div className="text-xs text-slate-500 font-mono mt-1">
            SOURCE: src/yxkj-v5.html · 1920x1080 空间数字孪生监控大盘
          </div>
        </div>
      )}

      {/* 大屏嵌入 iframe 核心渲染区 */}
      <iframe
        ref={iframeRef}
        src="/yxkj-v5.html"
        onLoad={() => setIsLoading(false)}
        className="w-full h-full border-0 bg-[#00060f] flex-1"
        title="智慧船厂有限空间与重点区域安全监控系统"
        allow="fullscreen"
      />
    </div>
  );
}
