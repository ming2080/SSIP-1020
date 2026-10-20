/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 智慧船厂 - 作业面管理：作业面详情模态框
 */

import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  ShieldAlert, 
  Cpu, 
  Users, 
  Radio, 
  Flame, 
  Video, 
  Bell, 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  Phone, 
  Edit3, 
  Power, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ExternalLink,
  Printer,
  ChevronRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { WorkfaceRecord } from '@/src/data/workfaceData';
import { MODEL_LAYER_OPTIONS } from '@/src/components/views/DeviceManagement';

interface WorkfaceDetailModalProps {
  isOpen: boolean;
  workface: WorkfaceRecord | null;
  onClose: () => void;
  onEdit?: (wf: WorkfaceRecord) => void;
  onToggleStatus?: (wf: WorkfaceRecord) => void;
  onNavigateToTracking?: (personId?: string) => void;
}

export function WorkfaceDetailModal({
  isOpen,
  workface,
  onClose,
  onEdit,
  onToggleStatus,
  onNavigateToTracking
}: WorkfaceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'personnel' | 'alarms'>('overview');
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || !workface) return null;

  const layerOption = MODEL_LAYER_OPTIONS.find(l => l.id === workface.modelLevel);

  // 风险徽标样式
  const getRiskBadge = (level: string) => {
    switch (level) {
      case '重大风险(红)':
        return 'bg-red-50 text-red-700 border-red-200';
      case '较大风险(橙)':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '一般风险(黄)':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case '低风险(蓝)':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // 状态徽标样式
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: '作业中', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'paused':
        return { label: '暂停中', cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'completed':
        return { label: '已完工', cls: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' };
      case 'draft':
        return { label: '待作业', cls: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' };
      default:
        return { label: status, cls: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  const statusInfo = getStatusBadge(workface.status);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* 顶部 Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-slate-50/90">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                {workface.code}
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {workface.name}
              </h2>

              {/* 归属类型徽标 */}
              {workface.belongingType === 'yard' ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>船厂厂区</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 inline-flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>造船项目</span>
                </span>
              )}

              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 ${statusInfo.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskBadge(workface.riskLevel)}`}>
                {workface.riskLevel}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                {workface.workType}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              {workface.belongingType === 'yard' ? (
                <>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-slate-800 font-medium">东南造船基地平面图</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>一级分区：<strong className="text-slate-700">{workface.yardZoneName || '厂区分区'}</strong></span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>二级工位：<strong className="text-slate-800">{workface.yardSubAreaName || workface.dockingArea}</strong></span>
                    {workface.yardSpecs && (
                      <span className="text-slate-400 font-mono ml-1">({workface.yardSpecs})</span>
                    )}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-slate-800 font-medium">{workface.projectName}</span>
                    {workface.shipCode && <span className="font-mono text-slate-500">({workface.shipCode})</span>}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{workface.dockingArea}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>{workface.modelLevelName} · {workface.elevation}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(workface)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                  workface.status === 'active'
                    ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                }`}
                title={workface.status === 'active' ? '暂停当前作业面' : '恢复激活作业面'}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{workface.status === 'active' ? '暂停作业' : '激活作业'}</span>
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(workface)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>编辑</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 顶部核心指标一览卡 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-6 py-3.5 bg-slate-50/40 border-b border-slate-200 text-xs">
          {/* 在场人数与定员 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span>在场作业人数</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-bold font-mono ${
                workface.currentPersonnelCount > workface.capacityLimit ? 'text-red-600' : 'text-slate-800'
              }`}>
                {workface.currentPersonnelCount}
              </span>
              <span className="text-slate-400 text-xs">/ {workface.capacityLimit} 人上限</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  workface.currentPersonnelCount > workface.capacityLimit 
                    ? 'bg-red-500' 
                    : workface.currentPersonnelCount / workface.capacityLimit > 0.8 
                    ? 'bg-amber-500' 
                    : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, (workface.currentPersonnelCount / (workface.capacityLimit || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* 责任安全员 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span>责任安全员</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-bold text-slate-800 text-sm">{workface.safetyOfficer}</div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-slate-500 font-mono text-[11px]">{workface.safetyOfficerPhone}</span>
              <button
                type="button"
                onClick={() => handleCopyPhone(workface.safetyOfficerPhone)}
                className="text-[11px] text-blue-600 hover:underline"
              >
                {copiedPhone ? '已复制' : '拨打/复制'}
              </button>
            </div>
          </div>

          {/* 施工班组 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span>施工责任班组</span>
              <Building2 className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-bold text-slate-800 text-xs truncate" title={workface.teamName}>
              {workface.teamName}
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5 truncate">
              班长: {workface.teamLeader} ({workface.teamLeaderPhone})
            </div>
          </div>

          {/* 运行与时段 */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span>作业时段与工期</span>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="font-bold text-slate-800 text-xs truncate">
              {workface.dailyWorkHours}
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 truncate">
              {workface.startDate} ~ {workface.endDate}
            </div>
          </div>
        </div>

        {/* 选项卡栏目 */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-xs font-medium bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>基本概况</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('devices')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'devices' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>智能设备 ({workface.boundBaseStations?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('personnel')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'personnel' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>在场人员 ({workface.currentPersonnel?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alarms')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'alarms' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>预警记录</span>
          </button>
        </div>

        {/* 详情内容容器 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: 基本概况 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 基本台账属性网格 */}
              {/* 基本信息 */}
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>基本信息</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-xs">
                  <div>
                    <span className="text-slate-400">作业面编号：</span>
                    <span className="text-slate-800 font-mono font-semibold ml-1">{workface.code}</span>
                  </div>

                  <div>
                    <span className="text-slate-400">作业面名称：</span>
                    <span className="text-slate-800 font-medium ml-1">{workface.name}</span>
                  </div>

                  <div>
                    <span className="text-slate-400">归属类型：</span>
                    <span className="text-slate-800 font-medium ml-1">
                      {workface.belongingType === 'yard' ? '船厂厂区' : '造船项目'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400">
                      {workface.belongingType === 'yard' ? '所属厂区工位：' : '所属工程楼层：'}
                    </span>
                    <span className="text-slate-800 font-medium ml-1">
                      {workface.belongingType === 'yard' 
                        ? `${workface.yardZoneName || '厂区'} · ${workface.yardSubAreaName || workface.dockingArea}`
                        : `${workface.projectName} · ${workface.modelLevelName}`}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400">责任人员：</span>
                    <span className="text-slate-800 font-medium ml-1">
                      {workface.safetyOfficer} ({workface.teamName})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400">施工周期：</span>
                    <span className="text-slate-800 font-medium ml-1">
                      {workface.startDate} ~ {workface.endDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400">作业面区域划定：</span>
                    <span className="text-blue-700 font-medium ml-1">
                      {workface.areaDefinition?.areaType ? `${workface.areaDefinition.areaType} (${workface.fence?.area || '3,630 ㎡'})` : (workface.fence?.area ? `${workface.fence.area} (空间划定已生效)` : '空间坐标已划定')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 安全防范管控措施 */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>现场安全防范措施</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {workface.safetyMeasures && workface.safetyMeasures.length > 0 ? (
                    workface.safetyMeasures.map((measure, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{measure}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 py-3">暂未配置特殊防范措施</div>
                  )}
                </div>
              </div>

              {/* 施工工艺与工程说明 */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                  <span>施工工艺与技术要求</span>
                </h3>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                  {workface.description || '暂无详细工艺描述。'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 智能设备 */}
          {activeTab === 'devices' && (
            <div className="space-y-6">
              {/* 1. 主基站 */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-blue-600" />
                  <span>主基站</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    必选定位设备
                  </span>
                </h3>

                {workface.boundBaseStations && workface.boundBaseStations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workface.boundBaseStations.map(bs => (
                      <div key={bs.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Radio className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-slate-800">{bs.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {bs.code} · IP: {bs.ip} · 覆盖: {bs.coverage}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {bs.status === 'online' ? '● 在线正常' : '○ 离线异常'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 text-center">
                    当前作业面未绑定主基站
                  </div>
                )}
              </div>

              {/* 2. 环境检测设备 */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>环境检测设备</span>
                </h3>

                {workface.boundGasDetectors && workface.boundGasDetectors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workface.boundGasDetectors.map(gd => (
                      <div key={gd.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span>{gd.name}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            gd.status === 'warning' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {gd.status === 'warning' ? '浓度异常预警' : '浓度正常'}
                          </span>
                        </div>

                        {/* 4合1实时读数网格 */}
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <div className="text-[10px] text-slate-400">氧气 (O₂)</div>
                            <div className="text-xs font-bold font-mono text-emerald-600 mt-0.5">{gd.readings.o2}</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <div className="text-[10px] text-slate-400">可燃气 (CH₄)</div>
                            <div className="text-xs font-bold font-mono text-slate-800 mt-0.5">{gd.readings.ch4}</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <div className="text-[10px] text-slate-400">一氧化碳 (CO)</div>
                            <div className="text-xs font-bold font-mono text-slate-800 mt-0.5">{gd.readings.co}</div>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-lg">
                            <div className="text-[10px] text-slate-400">硫化氢 (H₂S)</div>
                            <div className="text-xs font-bold font-mono text-slate-800 mt-0.5">{gd.readings.h2s}</div>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>设备SN: {gd.sn}</span>
                          <span>最后上报: {gd.lastUpdate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400 text-center">
                    当前作业面未开启环境检测设备联动
                  </div>
                )}
              </div>

              {/* 3. 视频监控与声光报警器 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-indigo-500" />
                    <span>AI 防爆视频监控</span>
                  </h3>
                  {workface.boundCameras && workface.boundCameras.length > 0 ? (
                    <div className="space-y-2">
                      {workface.boundCameras.map(cam => (
                        <div key={cam.id} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs flex items-center justify-between shadow-2xs">
                          <div>
                            <div className="font-semibold text-slate-800">{cam.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{cam.currentChannel} · {cam.type}</div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                            推流正常
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded text-xs text-slate-400 text-center">
                      未绑定摄像头
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-rose-500" />
                    <span>防爆声光报警器</span>
                  </h3>
                  {workface.boundAlarms && workface.boundAlarms.length > 0 ? (
                    <div className="space-y-2">
                      {workface.boundAlarms.map(alm => (
                        <div key={alm.id} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs flex items-center justify-between shadow-2xs">
                          <div>
                            <div className="font-semibold text-slate-800">{alm.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">自检状态: 正常 · {alm.lastTestTime}</div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                            在线待命
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded text-xs text-slate-400 text-center">
                      未绑定现场声光器
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 现场实时在场人员 */}
          {activeTab === 'personnel' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  当前作业面定位在线人数：<strong className="text-blue-600 font-mono font-bold text-sm">{workface.currentPersonnel?.length || 0}</strong> 人
                </div>
                {onNavigateToTracking && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTracking()}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <span>进入三维人员定位查看轨迹</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {workface.currentPersonnel && workface.currentPersonnel.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">姓名</th>
                        <th className="py-2.5 px-3 font-semibold">工种角色</th>
                        <th className="py-2.5 px-3 font-semibold">所属班组</th>
                        <th className="py-2.5 px-3 font-semibold">定位标签编号</th>
                        <th className="py-2.5 px-3 font-semibold">入舱/进场时间</th>
                        <th className="py-2.5 px-3 font-semibold">在场停留时长</th>
                        <th className="py-2.5 px-3 font-semibold">体征心率</th>
                        <th className="py-2.5 px-3 font-semibold">电量</th>
                        <th className="py-2.5 px-3 font-semibold text-center">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {workface.currentPersonnel.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-800">{p.name}</td>
                          <td className="py-2.5 px-3 text-slate-600">{p.role}</td>
                          <td className="py-2.5 px-3 text-slate-500">{p.team}</td>
                          <td className="py-2.5 px-3 font-mono text-blue-600">{p.tagId}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono">{p.entryTime}</td>
                          <td className="py-2.5 px-3 text-slate-600">{p.stayDuration}</td>
                          <td className="py-2.5 px-3 font-mono">
                            <span className="flex items-center gap-1 text-slate-700">
                              <Activity className="w-3 h-3 text-rose-500" />
                              {p.heartRate} bpm
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{p.battery}%</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              正常在岗
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                  当前作业面暂无施工人员在场定位记录
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 预警记录与合规检查 */}
          {activeTab === 'alarms' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <span>安全告警与合规处置记录</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <div className="font-semibold text-slate-800">
                          安全员在岗打卡合规核验通过
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          2026-09-30 08:05:00 · 责任安全员 {workface.safetyOfficer} 定位签到有效
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-medium">已闭环</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <div>
                        <div className="font-semibold text-slate-800">
                          进出受限空间电子台账自动同步
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          2026-09-30 08:15:00 · 结构班人员刷卡进场，基站覆盖率100%
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-blue-600 font-medium">自动核准</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <div>
                        <div className="font-semibold text-slate-800">
                          日常气体检测校准日志
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          2026-09-29 17:30:00 · 便携式四合一气体监测探头日常自检通过
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">例行归档</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮栏 */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-400">
            创建时间：{workface.createdAt} · 最后更新：{workface.updatedAt}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                alert(`已生成并导出【${workface.name}】三维作业面管控责任卡与设备清单 (PDF/Excel)`);
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>导出作业卡</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
