/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 智慧船厂 - 作业面管理主界面
 * 包含：作业面列表检索、多维统计、新增/编辑弹窗联动、详情页联动、批量操作与导出
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  Plus, 
  Layers, 
  ShieldAlert, 
  Users, 
  Cpu, 
  Radio, 
  Flame, 
  Video, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  Power, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building2, 
  MapPin, 
  Filter,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
  BarChart3
} from 'lucide-react';
import { 
  WorkfaceRecord, 
  getStoredWorkfaces, 
  saveStoredWorkfaces, 
  INITIAL_WORKFACES,
  SOUTHEAST_SHIPYARD_ZONES,
  WorkfaceBelongingType
} from '@/src/data/workfaceData';
import { MOCK_PROJECTS } from '@/src/data/mockProjects';
import { MODEL_LAYER_OPTIONS } from '@/src/components/views/DeviceManagement';
import { WorkfaceFormModal } from './WorkfaceFormModal';
import { WorkfaceDetailModal } from './WorkfaceDetailModal';

interface WorkfaceManagementProps {
  onNavigateToTracking?: (personId?: string) => void;
  onNavigateToMonitor?: () => void;
}

export function WorkfaceManagement({ onNavigateToTracking, onNavigateToMonitor }: WorkfaceManagementProps) {
  // 数据列表
  const [workfaces, setWorkfaces] = useState<WorkfaceRecord[]>(() => getStoredWorkfaces());
  
  // 选中的作业面 (批量操作)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // 检索筛选条件
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBelonging, setFilterBelonging] = useState<'ALL' | 'yard' | 'project'>('ALL');
  const [filterYardZone, setFilterYardZone] = useState('ALL');
  const [filterProject, setFilterProject] = useState('ALL');
  const [filterWorkType, setFilterWorkType] = useState('ALL');
  const [filterRiskLevel, setFilterRiskLevel] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterModelLevel, setFilterModelLevel] = useState('ALL');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 弹窗状态
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formInitialData, setFormInitialData] = useState<WorkfaceRecord | null>(null);
  
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedForDetail, setSelectedForDetail] = useState<WorkfaceRecord | null>(null);

  // Toast 提示
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 持久化存储更新
  const updateWorkfaceList = (newList: WorkfaceRecord[]) => {
    setWorkfaces(newList);
    saveStoredWorkfaces(newList);
  };

  // 重置筛选
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterBelonging('ALL');
    setFilterYardZone('ALL');
    setFilterProject('ALL');
    setFilterWorkType('ALL');
    setFilterRiskLevel('ALL');
    setFilterStatus('ALL');
    setFilterModelLevel('ALL');
    setCurrentPage(1);
    showToast('筛选条件已重置');
  };

  // 过滤后的数据
  const filteredWorkfaces = useMemo(() => {
    return workfaces.filter(wf => {
      // 关键字搜索
      if (searchTerm.trim()) {
        const keyword = searchTerm.toLowerCase().trim();
        const matchCode = wf.code.toLowerCase().includes(keyword);
        const matchName = wf.name.toLowerCase().includes(keyword);
        const matchOfficer = wf.safetyOfficer.toLowerCase().includes(keyword);
        const matchTeam = wf.teamName.toLowerCase().includes(keyword);
        const matchProject = wf.projectName?.toLowerCase().includes(keyword);
        const matchYardZone = wf.yardZoneName?.toLowerCase().includes(keyword);
        const matchYardSub = wf.yardSubAreaName?.toLowerCase().includes(keyword);
        if (!matchCode && !matchName && !matchOfficer && !matchTeam && !matchProject && !matchYardZone && !matchYardSub) {
          return false;
        }
      }

      // 归属区域类型筛选 (厂区 / 项目)
      if (filterBelonging !== 'ALL' && wf.belongingType !== filterBelonging) {
        return false;
      }

      // 厂区功能分区筛选
      if (filterYardZone !== 'ALL' && wf.yardZoneId !== filterYardZone) {
        return false;
      }

      // 项目筛选
      if (filterProject !== 'ALL' && wf.projectId !== filterProject) {
        return false;
      }

      // 作业类型筛选
      if (filterWorkType !== 'ALL' && wf.workType !== filterWorkType) {
        return false;
      }

      // 风险等级筛选
      if (filterRiskLevel !== 'ALL' && wf.riskLevel !== filterRiskLevel) {
        return false;
      }

      // 状态筛选
      if (filterStatus !== 'ALL' && wf.status !== filterStatus) {
        return false;
      }

      // 模型分层筛选
      if (filterModelLevel !== 'ALL' && wf.modelLevel !== filterModelLevel) {
        return false;
      }

      return true;
    });
  }, [workfaces, searchTerm, filterBelonging, filterYardZone, filterProject, filterWorkType, filterRiskLevel, filterStatus, filterModelLevel]);

  // 统计概览计算
  const stats = useMemo(() => {
    const total = workfaces.length;
    const active = workfaces.filter(w => w.status === 'active').length;
    const highRisk = workfaces.filter(w => w.riskLevel === '重大风险(红)' || w.riskLevel === '较大风险(橙)').length;
    const totalDevices = workfaces.reduce((acc, w) => {
      return acc + (w.boundBaseStations?.length || 0) + (w.boundGasDetectors?.length || 0) + (w.boundCameras?.length || 0);
    }, 0);
    const totalWorkers = workfaces.reduce((acc, w) => acc + (w.currentPersonnelCount || 0), 0);

    return { total, active, highRisk, totalDevices, totalWorkers };
  }, [workfaces]);

  // 分页数据截取
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWorkfaces.slice(start, start + pageSize);
  }, [filteredWorkfaces, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredWorkfaces.length / pageSize) || 1;

  // 全选/取消全选
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedList.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 单选切换
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 单条启停
  const handleToggleStatus = (wf: WorkfaceRecord) => {
    const nextStatus = wf.status === 'active' ? 'paused' : 'active';
    const updated = workfaces.map(item => {
      if (item.id === wf.id) {
        return {
          ...item,
          status: nextStatus,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      }
      return item;
    });
    updateWorkfaceList(updated);
    showToast(`作业面【${wf.name}】已${nextStatus === 'active' ? '激活启用' : '暂停作业'}`);
    
    // 同步详情弹窗
    if (selectedForDetail && selectedForDetail.id === wf.id) {
      setSelectedForDetail(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  // 删除单条
  const handleDeleteOne = (id: string, name: string) => {
    if (confirm(`确定要删除作业面【${name}】吗？删除后将解除关联的基站与定位映射关系。`)) {
      const updated = workfaces.filter(w => w.id !== id);
      updateWorkfaceList(updated);
      setSelectedIds(prev => prev.filter(item => item !== id));
      showToast(`作业面【${name}】已成功删除`);
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`确定要批量删除选中的 ${selectedIds.length} 个作业面吗？`)) {
      const updated = workfaces.filter(w => !selectedIds.includes(w.id));
      updateWorkfaceList(updated);
      setSelectedIds([]);
      showToast(`已批量删除 ${selectedIds.length} 个作业面`);
    }
  };

  // 批量激活
  const handleBatchActivate = () => {
    if (selectedIds.length === 0) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated = workfaces.map(w => {
      if (selectedIds.includes(w.id)) {
        return { ...w, status: 'active' as const, updatedAt: nowStr };
      }
      return w;
    });
    updateWorkfaceList(updated);
    showToast(`已批量激活 ${selectedIds.length} 个作业面`);
  };

  // 批量暂停
  const handleBatchPause = () => {
    if (selectedIds.length === 0) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated = workfaces.map(w => {
      if (selectedIds.includes(w.id)) {
        return { ...w, status: 'paused' as const, updatedAt: nowStr };
      }
      return w;
    });
    updateWorkfaceList(updated);
    showToast(`已批量暂停 ${selectedIds.length} 个作业面`);
  };

  // 打开新增
  const handleOpenCreate = () => {
    setFormInitialData(null);
    setIsFormOpen(true);
  };

  // 打开编辑
  const handleOpenEdit = (wf: WorkfaceRecord) => {
    setFormInitialData(wf);
    setIsFormOpen(true);
  };

  // 保存表单数据 (新增或编辑)
  const handleSaveForm = (record: WorkfaceRecord) => {
    if (formInitialData) {
      // 编辑更新
      const updated = workfaces.map(w => w.id === record.id ? record : w);
      updateWorkfaceList(updated);
      showToast(`作业面【${record.name}】已更新成功`);
      if (selectedForDetail && selectedForDetail.id === record.id) {
        setSelectedForDetail(record);
      }
    } else {
      // 新增插入头部
      const updated = [record, ...workfaces];
      updateWorkfaceList(updated);
      showToast(`作业面【${record.name}】已创建成功`);
    }
    setIsFormOpen(false);
  };

  // 打开详情
  const handleOpenDetail = (wf: WorkfaceRecord) => {
    setSelectedForDetail(wf);
    setIsDetailOpen(true);
  };

  // 导出报表
  const handleExportData = () => {
    const csvHeader = '编号,作业面名称,归属类型,所属对象,具体工位楼层,工位规格标高,作业类型,风险等级,责任安全员,安全员电话,责任班组,定员上限,在场人数,状态,更新时间\n';
    const csvRows = filteredWorkfaces.map(w => {
      const typeLabel = w.belongingType === 'yard' ? '船厂厂区' : '造船项目';
      const objName = w.belongingType === 'yard' ? (w.yardZoneName || '东南造船基地') : w.projectName;
      const subPos = w.belongingType === 'yard' ? (w.yardSubAreaName || w.dockingArea) : w.modelLevelName;
      const specElev = w.belongingType === 'yard' ? (w.yardSpecs || '-') : w.elevation;
      return `"${w.code}","${w.name}","${typeLabel}","${objName}","${subPos}","${specElev}","${w.workType}","${w.riskLevel}","${w.safetyOfficer}","${w.safetyOfficerPhone}","${w.teamName}",${w.capacityLimit},${w.currentPersonnelCount},"${w.status}","${w.updatedAt}"`;
    }).join('\n');

    const blob = new Blob(['\uFEFF' + csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `智慧船厂_作业面管理台账_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`已成功导出 ${filteredWorkfaces.length} 条作业面台账数据`);
  };

  // 风险徽标样式
  const getRiskBadgeCls = (level: string) => {
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
  const getStatusBadgeCls = (status: string) => {
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

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-hidden select-none">
      {/* Toast 消息提示 */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-800 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 顶部概览统计卡片栏 */}
      <div className="p-4 pb-2 bg-white border-b border-slate-200 shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. 总作业面 */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs text-slate-500 font-medium">作业面总数</div>
              <div className="text-xl font-bold font-mono text-slate-800 mt-1">{stats.total}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">全厂三维作业空间单元</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          {/* 2. 进行中作业面 */}
          <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs text-emerald-700 font-medium">当前作业中</div>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">{stats.active}</div>
              <div className="text-[10px] text-emerald-600/80 mt-0.5">实时定位与防脱岗监控</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* 3. 高/较大风险 */}
          <div className="p-3 bg-red-50/40 rounded-xl border border-red-100 flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs text-red-700 font-medium">重大/较大风险面</div>
              <div className="text-xl font-bold font-mono text-red-600 mt-1">{stats.highRisk}</div>
              <div className="text-[10px] text-red-600/80 mt-0.5">动火/受限空间一级重保</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100/70 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          {/* 4. 关联智能设备 */}
          <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs text-indigo-700 font-medium">覆盖感知设备数</div>
              <div className="text-xl font-bold font-mono text-indigo-700 mt-1">{stats.totalDevices}</div>
              <div className="text-[10px] text-indigo-600/80 mt-0.5">基站/气体/AI球机/声光</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-100/70 text-indigo-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          {/* 5. 在场作业人员 */}
          <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100 flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs text-amber-800 font-medium">现场作业总人数</div>
              <div className="text-xl font-bold font-mono text-amber-700 mt-1">{stats.totalWorkers}</div>
              <div className="text-[10px] text-amber-700/80 mt-0.5">实名标签在线打卡</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 综合操作与筛选工具栏 */}
      <div className="p-4 bg-white border-b border-slate-200 shrink-0 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 左侧多维筛选条件 */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 模糊搜索 */}
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="搜索作业面名称、编号、安全员..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
              />
            </div>

            {/* 归属类型筛选 (厂区 / 造船项目) */}
            <select
              value={filterBelonging}
              onChange={e => {
                setFilterBelonging(e.target.value as any);
                setFilterYardZone('ALL');
                setFilterProject('ALL');
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            >
              <option value="ALL">全部归属类型</option>
              <option value="yard">🏢 船厂厂区</option>
              <option value="project">🚢 造船项目</option>
            </select>

            {/* 联动筛选 A: 厂区功能分区 (平面图区域) */}
            {filterBelonging === 'yard' && (
              <select
                value={filterYardZone}
                onChange={e => {
                  setFilterYardZone(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 border border-blue-200 rounded-lg text-xs bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 animate-in fade-in duration-150"
              >
                <option value="ALL">全部厂区功能区</option>
                {SOUTHEAST_SHIPYARD_ZONES.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            )}

            {/* 联动筛选 B: 造船项目 */}
            {filterBelonging !== 'yard' && (
              <select
                value={filterProject}
                onChange={e => {
                  setFilterProject(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">全部造船工程</option>
                {MOCK_PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}

            {/* 联动筛选 C: 船体分层 (仅在项目类型时显示) */}
            {filterBelonging === 'project' && (
              <select
                value={filterModelLevel}
                onChange={e => {
                  setFilterModelLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 border border-indigo-200 rounded-lg text-xs bg-indigo-50/50 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-blue-500 animate-in fade-in duration-150"
              >
                <option value="ALL">全部船体分层</option>
                {MODEL_LAYER_OPTIONS.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            )}

            {/* 作业类型筛选 */}
            <select
              value={filterWorkType}
              onChange={e => {
                setFilterWorkType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">全部作业类型</option>
              <option value="合拢焊接">合拢焊接</option>
              <option value="密闭舱室作业">密闭舱室作业</option>
              <option value="高空涂装">高空涂装</option>
              <option value="管系装配">管系装配</option>
              <option value="电气舾装">电气舾装</option>
              <option value="探伤质检">探伤质检</option>
              <option value="通用作业">通用作业</option>
            </select>

            {/* 风险等级筛选 */}
            <select
              value={filterRiskLevel}
              onChange={e => {
                setFilterRiskLevel(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">全部风险等级</option>
              <option value="重大风险(红)">重大风险(红)</option>
              <option value="较大风险(橙)">较大风险(橙)</option>
              <option value="一般风险(黄)">一般风险(黄)</option>
              <option value="低风险(蓝)">低风险(蓝)</option>
            </select>

            {/* 运行状态筛选 */}
            <select
              value={filterStatus}
              onChange={e => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">全部状态</option>
              <option value="active">作业中</option>
              <option value="paused">暂停中</option>
              <option value="draft">待作业</option>
              <option value="completed">已完工</option>
            </select>

            {/* 重置按钮 */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-xs transition-colors flex items-center gap-1"
              title="清空所有筛选条件"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置</span>
            </button>
          </div>

          {/* 右侧主操作按钮 */}
          <div className="flex items-center gap-2">
            {onNavigateToMonitor && (
              <button
                type="button"
                onClick={onNavigateToMonitor}
                className="px-3 py-1.5 border border-indigo-200 text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="进入作业面空间监控与多维人员/环境分析大盘"
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>监控分析</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportData}
              className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>导出台账</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>新增作业面</span>
            </button>
          </div>
        </div>

        {/* 批量操作工具条 (选中记录时浮现) */}
        {selectedIds.length > 0 && (
          <div className="p-2.5 bg-blue-50/90 border border-blue-200 rounded-lg flex items-center justify-between text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-blue-900 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>已选中 <strong>{selectedIds.length}</strong> 项作业面</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBatchActivate}
                className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded text-xs transition-colors"
              >
                批量激活
              </button>
              <button
                type="button"
                onClick={handleBatchPause}
                className="px-2.5 py-1 bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 rounded text-xs transition-colors"
              >
                批量暂停
              </button>
              <button
                type="button"
                onClick={handleBatchDelete}
                className="px-2.5 py-1 bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded text-xs transition-colors"
              >
                批量删除
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 作业面列表表格展示区 */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-semibold sticky top-0 z-10 text-xs">
              <tr>
                <th className="py-2.5 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={paginatedList.length > 0 && selectedIds.length === paginatedList.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">作业面编号</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[160px]">作业面名称</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">归属类型</th>
                <th className="py-2.5 px-3 whitespace-nowrap">所属工程 / 区域</th>
                <th className="py-2.5 px-3 whitespace-nowrap">具体工位 / 楼层</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">作业类型</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">风险等级</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">感知设备</th>
                <th className="py-2.5 px-3 whitespace-nowrap">责任安全员</th>
                <th className="py-2.5 px-3 whitespace-nowrap">施工班组</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">在场/定员</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">状态</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center sticky right-0 bg-slate-50/95 shadow-[-4px_0_8px_rgba(0,0,0,0.02)] min-w-[140px]">
                  操作
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedList.length > 0 ? (
                paginatedList.map(wf => {
                  const isSelected = selectedIds.includes(wf.id);
                  const statusObj = getStatusBadgeCls(wf.status);
                  const isOverCapacity = wf.currentPersonnelCount > wf.capacityLimit;
                  const totalSensors = (wf.boundBaseStations?.length || 0) + (wf.boundGasDetectors?.length || 0) + (wf.boundCameras?.length || 0);

                  return (
                    <tr 
                      key={wf.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}
                    >
                      {/* 复选框 */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(wf.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* 作业面编号 */}
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-700 whitespace-nowrap">
                        {wf.code}
                      </td>

                      {/* 作业面名称 - 精简为单行纯净名称，支持点击直达详情 */}
                      <td className="py-2.5 px-3">
                        <button 
                          type="button"
                          onClick={() => handleOpenDetail(wf)}
                          className="font-medium text-slate-900 hover:text-blue-600 cursor-pointer transition-colors text-left truncate max-w-[200px] block"
                          title={wf.name}
                        >
                          {wf.name}
                        </button>
                      </td>

                      {/* 归属类型 */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {wf.belongingType === 'yard' ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            厂区
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                            项目
                          </span>
                        )}
                      </td>

                      {/* 所属工程 / 区域 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-700 font-medium">
                        {wf.belongingType === 'yard' ? (
                          <span title="东南造船基地平面图功能区">
                            {wf.yardZoneName || '东南造船基地'}
                          </span>
                        ) : (
                          <span title={wf.projectName}>
                            {wf.projectName}
                          </span>
                        )}
                      </td>

                      {/* 具体工位 / 楼层 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                        {wf.belongingType === 'yard' ? (
                          <span title={wf.yardSpecs || ''} className="font-medium text-slate-800">
                            {wf.yardSubAreaName || wf.dockingArea}
                          </span>
                        ) : (
                          <span>
                            {wf.modelLevelName || '主甲板层'}
                          </span>
                        )}
                      </td>

                      {/* 作业类型 - 紧凑工种标签 */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {wf.workType}
                        </span>
                      </td>

                      {/* 风险等级 - 醒目等级标签 */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getRiskBadgeCls(wf.riskLevel)}`}>
                          {wf.riskLevel}
                        </span>
                      </td>

                      {/* 感知设备 - 提炼核心总台数，悬浮提示明细 */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-xs font-mono border border-slate-200 cursor-help"
                          title={`关联设备: 主基站 ${wf.boundBaseStations?.length || 0} 台 | 环境检测 ${wf.boundGasDetectors?.length || 0} 台 | AI球机 ${wf.boundCameras?.length || 0} 台 | 声光 ${wf.boundAlarms?.length || 0} 台`}
                        >
                          <Cpu className="w-3 h-3 text-slate-400" />
                          <span>{totalSensors} 台</span>
                        </span>
                      </td>

                      {/* 责任安全员 - 仅保留安全员姓名，电话悬停可查 */}
                      <td 
                        className="py-2.5 px-3 whitespace-nowrap text-slate-800 font-medium"
                        title={`联系电话: ${wf.safetyOfficerPhone}`}
                      >
                        {wf.safetyOfficer}
                      </td>

                      {/* 施工班组 - 仅保留核心班组名 */}
                      <td 
                        className="py-2.5 px-3 whitespace-nowrap text-slate-700 truncate max-w-[140px]" 
                        title={`施工班组: ${wf.teamName} (班长: ${wf.teamLeader})`}
                      >
                        {wf.teamName}
                      </td>

                      {/* 在场 / 定员 - 单行紧凑展示，超员标红 */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap font-mono">
                        <span className={`font-semibold ${isOverCapacity ? 'text-red-600 font-bold' : 'text-slate-800'}`}>
                          {wf.currentPersonnelCount}
                        </span>
                        <span className="text-slate-400"> / {wf.capacityLimit}人</span>
                        {isOverCapacity && (
                          <span className="ml-1 text-[10px] text-red-500 font-sans font-medium">(超员)</span>
                        )}
                      </td>

                      {/* 状态 - 精炼状态徽标 */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border inline-flex items-center gap-1.5 ${statusObj.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusObj.dot}`} />
                          {statusObj.label}
                        </span>
                      </td>

                      {/* 操作列 - 紧凑清晰动作组 */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50/80 shadow-[-4px_0_8px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(wf)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            详情
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(wf)}
                            className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(wf)}
                            className={`font-medium transition-colors ${
                              wf.status === 'active' 
                                ? 'text-amber-600 hover:text-amber-800' 
                                : 'text-emerald-600 hover:text-emerald-800'
                            }`}
                          >
                            {wf.status === 'active' ? '暂停' : '激活'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOne(wf.id, wf.name)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                            title="删除作业面"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400 text-xs">
                    没有找到符合条件的作业面记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部规范分页栏 */}
      <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-2">
          <span>共 <strong className="text-slate-800">{filteredWorkfaces.length}</strong> 条记录</span>
          <span className="text-slate-300">|</span>
          <span>每页</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-slate-200 rounded text-xs bg-white text-slate-700 focus:outline-none"
          >
            <option value={10}>10 条</option>
            <option value={20}>20 条</option>
            <option value={50}>50 条</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 font-mono font-medium text-slate-800">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 新增 / 编辑弹窗 */}
      <WorkfaceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveForm}
        initialData={formInitialData}
      />

      {/* 详情页弹窗 */}
      <WorkfaceDetailModal
        isOpen={isDetailOpen}
        workface={selectedForDetail}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(wf) => {
          setIsDetailOpen(false);
          handleOpenEdit(wf);
        }}
        onToggleStatus={handleToggleStatus}
        onNavigateToTracking={onNavigateToTracking}
      />
    </div>
  );
}
