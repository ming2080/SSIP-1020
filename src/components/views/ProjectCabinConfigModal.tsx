/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 智慧船厂 - 船舶项目船舱配置模态框
 * 业务定位：
 * 1. 针对船舶项目各有限空间/船舱进行进出人员统计规则设定（进/出船舱规则）。
 * 2. 船舱进出规则主要和低频激励器设备关联，支持设定多个设备与进/出规则相关联。
 * 3. 统计并展示进入船舱的人员总数与花名册，联动大屏“舱内密集人员数”与“船舱人员”标签。
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  Check, 
  Trash2, 
  Save, 
  Radio, 
  Plus, 
  Cpu, 
  SlidersHorizontal, 
  Clock, 
  ShieldAlert, 
  Users, 
  Layers, 
  ChevronRight, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Ship,
  Box
} from 'lucide-react';
import { CreatedProjectData } from './CreateProjectModal';
import { 
  CabinConfigItem, 
  CabinPersonnelItem, 
  ExciterDeviceOption, 
  MOCK_EXCITER_DEVICES, 
  getStoredCabinConfigs, 
  saveStoredCabinConfigs, 
  getStoredCabinPersonnel, 
  saveStoredCabinPersonnel 
} from '@/src/data/cabinConfigData';
import { getStoredWorkfaces, WorkfaceRecord } from '@/src/data/workfaceData';

interface ProjectCabinConfigModalProps {
  isOpen: boolean;
  project: CreatedProjectData | null;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export function ProjectCabinConfigModal({
  isOpen,
  project,
  onClose,
  onSuccess
}: ProjectCabinConfigModalProps) {
  if (!isOpen || !project) return null;

  // 1. 船舱配置列表
  const [cabinConfigs, setCabinConfigs] = useState<CabinConfigItem[]>([]);
  const [selectedCabinId, setSelectedCabinId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLayer, setFilterLayer] = useState<string>('ALL');
  const [activeRuleTab, setActiveRuleTab] = useState<'entry' | 'exit' | 'threshold' | 'roster'>('entry');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 2. 选择激励器浮层状态
  const [isAddingExciter, setIsAddingExciter] = useState<'entry' | 'exit' | null>(null);
  const [exciterSearch, setExciterSearch] = useState('');

  // 3. 在舱人员列表 (从存储加载)
  const [allPersonnel, setAllPersonnel] = useState<CabinPersonnelItem[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 初始化加载项目关联的船舱及规则
  useEffect(() => {
    if (!project) return;
    const configs = getStoredCabinConfigs(project.id);
    const personnel = getStoredCabinPersonnel(project.id);

    // 检查是否有来自有限空间模块的新建舱室，如有则自动补充纳入
    const workfaces = getStoredWorkfaces().filter(
      wf => wf.projectId === project.id || wf.shipModelId === project.id || wf.belongingType === 'project'
    );

    let mergedConfigs = [...configs];
    workfaces.forEach(wf => {
      const existing = mergedConfigs.find(c => c.cabinId === wf.id || c.cabinCode === wf.code);
      if (!existing && (wf.workfaceType === '有限空间' || wf.belongingType === 'project')) {
        mergedConfigs.push({
          id: `CC-${project.id}-${wf.id}`,
          projectId: project.id,
          projectName: project.name,
          cabinId: wf.id,
          cabinCode: wf.code,
          cabinName: wf.name,
          modelLevel: wf.modelLevel || 'bottom',
          modelLevelName: wf.modelLevelName || '底舱层 (双层底/压载密闭舱)',
          volume: Number(wf.volume) || 2400,
          capacityLimit: wf.capacityLimit || 10,
          denseThreshold: 3,
          maxStayMinutes: 120,
          entryRule: {
            ruleName: `${wf.name}人孔进舱规则`,
            enabled: true,
            detectionMode: 'single_exciter',
            associatedDeviceIds: ['EXC-LNG-01'],
            debounceSeconds: 3
          },
          exitRule: {
            ruleName: `${wf.name}出舱结算规则`,
            enabled: true,
            detectionMode: 'single_exciter',
            associatedDeviceIds: ['EXC-LNG-02'],
            autoExitHours: 6
          },
          currentPersonnelCount: wf.currentPersonnelCount || 2,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
      }
    });

    setCabinConfigs(mergedConfigs);
    setAllPersonnel(personnel);
    if (mergedConfigs.length > 0 && !selectedCabinId) {
      setSelectedCabinId(mergedConfigs[0].id);
    }
  }, [project]);

  // 当前选中的舱室
  const currentCabin = useMemo(() => {
    return cabinConfigs.find(c => c.id === selectedCabinId) || cabinConfigs[0] || null;
  }, [cabinConfigs, selectedCabinId]);

  // 过滤后的船舱列表
  const filteredCabins = useMemo(() => {
    return cabinConfigs.filter(c => {
      if (filterLayer !== 'ALL' && c.modelLevel !== filterLayer) return false;
      if (searchTerm.trim()) {
        const kw = searchTerm.toLowerCase().trim();
        return c.cabinName.toLowerCase().includes(kw) || c.cabinCode.toLowerCase().includes(kw);
      }
      return true;
    });
  }, [cabinConfigs, filterLayer, searchTerm]);

  // 当前舱室的人员花名册
  const cabinPersonnelList = useMemo(() => {
    if (!currentCabin) return [];
    return allPersonnel.filter(p => p.cabinId === currentCabin.id || p.location === currentCabin.cabinName);
  }, [allPersonnel, currentCabin]);

  // 更新当前舱室属性
  const updateCurrentCabin = (updater: (prev: CabinConfigItem) => CabinConfigItem) => {
    if (!currentCabin) return;
    setCabinConfigs(prev => prev.map(c => c.id === currentCabin.id ? updater(c) : c));
  };

  // 添加激励器到进舱或出舱规则 (多设备关联)
  const handleAddExciterToRule = (exciterId: string, ruleType: 'entry' | 'exit') => {
    if (!currentCabin) return;
    updateCurrentCabin(cabin => {
      const targetRule = ruleType === 'entry' ? cabin.entryRule : cabin.exitRule;
      if (targetRule.associatedDeviceIds.includes(exciterId)) {
        return cabin;
      }
      const newDeviceIds = [...targetRule.associatedDeviceIds, exciterId];
      return {
        ...cabin,
        [ruleType === 'entry' ? 'entryRule' : 'exitRule']: {
          ...targetRule,
          associatedDeviceIds: newDeviceIds
        },
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
    });
    showToast(`已成功关联激励器设备`);
  };

  // 从规则中移除激励器
  const handleRemoveExciterFromRule = (exciterId: string, ruleType: 'entry' | 'exit') => {
    if (!currentCabin) return;
    updateCurrentCabin(cabin => {
      const targetRule = ruleType === 'entry' ? cabin.entryRule : cabin.exitRule;
      const newDeviceIds = targetRule.associatedDeviceIds.filter(id => id !== exciterId);
      return {
        ...cabin,
        [ruleType === 'entry' ? 'entryRule' : 'exitRule']: {
          ...targetRule,
          associatedDeviceIds: newDeviceIds
        },
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
    });
  };

  // 保存所有船舱配置
  const handleSaveConfigs = () => {
    if (!project) return;
    saveStoredCabinConfigs(project.id, cabinConfigs);
    saveStoredCabinPersonnel(allPersonnel);
    const totalCount = cabinConfigs.reduce((acc, c) => acc + (c.currentPersonnelCount || 0), 0);
    showToast(`船舱进出规则配置已成功保存！当前在舱统计总人数: ${totalCount} 人`);
    if (onSuccess) {
      onSuccess(`【${project.name}】船舱进出人员统计规则已保存生效`);
    }
    setTimeout(() => {
      onClose();
    }, 600);
  };

  // 快捷模拟人员进舱 (便于现场测试或业务验证)
  const handleSimulateEntry = () => {
    if (!currentCabin) return;
    const newWorkerId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomNames = ['张海龙', '陈伟强', '郭玉成', '李金鹏', '肖德宝', '崔建军'];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const firstExciterId = currentCabin.entryRule.associatedDeviceIds[0] || 'EXC-LNG-01';
    const exciterObj = MOCK_EXCITER_DEVICES.find(e => e.id === firstExciterId);

    const newItem: CabinPersonnelItem = {
      id: `CP-${Date.now()}`,
      workerId: newWorkerId,
      name: randomName,
      team: '焊装一班',
      trade: '焊工',
      tagCode: `TAG-UWB-${Math.floor(8000 + Math.random() * 1000)}`,
      phone: '138-0000-8888',
      location: currentCabin.cabinName,
      cabinId: currentCabin.id,
      projectId: project.id,
      projectName: project.name,
      entryTime: nowStr,
      durationMinutes: 1,
      duration: '刚刚进入',
      status: '在舱作业中',
      triggeredExciterCode: exciterObj?.code || 'EX-01-A',
      triggeredExciterName: exciterObj?.name || '人孔进舱激励器'
    };

    const updatedPersonnel = [newItem, ...allPersonnel];
    setAllPersonnel(updatedPersonnel);
    saveStoredCabinPersonnel(updatedPersonnel);

    updateCurrentCabin(cabin => ({
      ...cabin,
      currentPersonnelCount: (cabin.currentPersonnelCount || 0) + 1
    }));
    showToast(`人员【${randomName}】已触发进舱激励器，完成进舱登记`);
  };

  // 快捷模拟人员出舱
  const handleSimulateExit = (personId: string, personName: string) => {
    const updated = allPersonnel.filter(p => p.id !== personId);
    setAllPersonnel(updated);
    saveStoredCabinPersonnel(updated);

    updateCurrentCabin(cabin => ({
      ...cabin,
      currentPersonnelCount: Math.max(0, (cabin.currentPersonnelCount || 0) - 1)
    }));
    showToast(`人员【${personName}】已感应出舱激励器，结算出舱`);
  };

  // 统计在舱总人数
  const totalInProjectCabins = useMemo(() => {
    return cabinConfigs.reduce((acc, c) => acc + (c.currentPersonnelCount || 0), 0);
  }, [cabinConfigs]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="fixed top-12 right-12 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 顶部 Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  船舱配置 · 进出人员统计规则设定
                </h2>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-100/70 text-blue-800 border border-blue-200">
                  {project.shipCode || project.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                  {project.shipType || '在建船舶'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                项目名称: <span className="text-slate-700 font-medium">{project.name}</span> · 关联低频激励器设备，根据进出规则自动统计进入船舱人员
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 统计指标卡 */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
              <Users className="w-4 h-4 text-blue-600" />
              <span>规则统计在舱总数:</span>
              <span className="font-mono text-sm text-blue-700 font-extrabold">{totalInProjectCabins}</span>
              <span className="text-blue-500 text-[11px]">人</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 主体分栏内容 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧栏：舱室选择列表 */}
          <div className="w-80 border-r border-slate-200 bg-slate-50/50 flex flex-col shrink-0">
            {/* 搜索与过滤 */}
            <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索舱室名称 / 编号..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1">
                {['ALL', 'deck', 'middle', 'bottom', 'engine'].map(layer => (
                  <button
                    key={layer}
                    type="button"
                    onClick={() => setFilterLayer(layer)}
                    className={`flex-1 py-1 text-[11px] font-medium rounded transition-colors text-center ${
                      filterLayer === layer 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {layer === 'ALL' ? '全部' : layer === 'deck' ? '甲板' : layer === 'middle' ? '中舱' : layer === 'bottom' ? '底舱' : '机舱'}
                  </button>
                ))}
              </div>
            </div>

            {/* 舱室列表 */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              {filteredCabins.map(cabin => {
                const isSelected = currentCabin?.id === cabin.id;
                const entryCount = cabin.entryRule.associatedDeviceIds.length;
                const exitCount = cabin.exitRule.associatedDeviceIds.length;

                return (
                  <button
                    key={cabin.id}
                    type="button"
                    onClick={() => setSelectedCabinId(cabin.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                      isSelected 
                        ? 'bg-blue-50/80 border-blue-400 shadow-xs' 
                        : 'bg-white border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {cabin.cabinCode}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/60 px-1.5 py-0.2 rounded">
                        在舱 {cabin.currentPersonnelCount || 0} 人
                      </span>
                    </div>

                    <div className="font-semibold text-xs text-slate-900 truncate" title={cabin.cabinName}>
                      {cabin.cabinName}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span className="text-slate-600 truncate max-w-[120px]">
                        {cabin.modelLevelName.split(' ')[0]}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-emerald-700 font-medium">进: {entryCount}台</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-amber-700 font-medium">出: {exitCount}台</span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredCabins.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs">
                  暂无匹配的舱室
                </div>
              )}
            </div>
          </div>

          {/* 右侧主配置面板 */}
          {currentCabin ? (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* 舱室状态概览条 */}
              <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {currentCabin.cabinCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {currentCabin.cabinName}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {currentCabin.modelLevelName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-4">
                    <span>定员上限: <strong className="text-slate-700">{currentCabin.capacityLimit}人</strong></span>
                    <span>密集门限: <strong className="text-slate-700">{currentCabin.denseThreshold}人</strong></span>
                    <span>最长作业停留: <strong className="text-slate-700">{currentCabin.maxStayMinutes}分钟</strong></span>
                    <span>规则更新时间: <span className="font-mono text-slate-600">{currentCabin.updatedAt}</span></span>
                  </div>
                </div>

                {/* 快捷测试按钮 */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateEntry}
                    className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    title="模拟人员佩戴标签触发进舱激励器"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>模拟进舱</span>
                  </button>
                </div>
              </div>

              {/* 规则配置 Tab 切换栏 */}
              <div className="px-6 border-b border-slate-200 flex items-center gap-6 text-xs font-semibold bg-white">
                <button
                  type="button"
                  onClick={() => setActiveRuleTab('entry')}
                  className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                    activeRuleTab === 'entry'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LogIn className="w-4 h-4 text-emerald-600" />
                  <span>进船舱规则设定</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                    {currentCabin.entryRule.associatedDeviceIds.length} 台设备
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRuleTab('exit')}
                  className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                    activeRuleTab === 'exit'
                      ? 'border-amber-600 text-amber-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <LogOut className="w-4 h-4 text-amber-600" />
                  <span>出船舱规则设定</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800">
                    {currentCabin.exitRule.associatedDeviceIds.length} 台设备
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRuleTab('threshold')}
                  className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                    activeRuleTab === 'threshold'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>定员与超时报警门限</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRuleTab('roster')}
                  className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                    activeRuleTab === 'roster'
                      ? 'border-indigo-600 text-indigo-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>当前在舱人员名单</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800">
                    {cabinPersonnelList.length} 人
                  </span>
                </button>
              </div>

              {/* Tab 内容区 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. 进船舱规则设定 */}
                {activeRuleTab === 'entry' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                      <div>
                        <div className="font-semibold text-xs text-emerald-950 flex items-center gap-2">
                          <span>进舱规则状态</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            currentCabin.entryRule.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                          }`}>
                            {currentCabin.entryRule.enabled ? '已启用感知' : '已停用'}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800 mt-1">
                          当人员佩戴定位标签进入关联激励器有效感应区域时，系统触发进舱判定并纳入舱内人员统计。
                        </p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentCabin.entryRule.enabled}
                          onChange={e => {
                            updateCurrentCabin(cabin => ({
                              ...cabin,
                              entryRule: { ...cabin.entryRule, enabled: e.target.checked }
                            }));
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    {/* 规则基本信息 */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">进舱规则名称</label>
                        <input
                          type="text"
                          value={currentCabin.entryRule.ruleName}
                          onChange={e => {
                            const val = e.target.value;
                            updateCurrentCabin(c => ({
                              ...c,
                              entryRule: { ...c.entryRule, ruleName: val }
                            }));
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">感应防抖过滤时长 (秒)</label>
                        <select
                          value={currentCabin.entryRule.debounceSeconds}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateCurrentCabin(c => ({
                              ...c,
                              entryRule: { ...c.entryRule, debounceSeconds: val }
                            }));
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value={1}>1 秒 (瞬时触发)</option>
                          <option value={2}>2 秒 (标准门禁推荐)</option>
                          <option value={3}>3 秒 (防误报防晃动)</option>
                          <option value={5}>5 秒 (高防抖)</option>
                        </select>
                      </div>
                    </div>

                    {/* 关联激励器设备 (核心要求：支持设定多个设备关联) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                            <Radio className="w-4 h-4 text-emerald-600" />
                            <span>关联进舱激励器设备 (已关联 {currentCabin.entryRule.associatedDeviceIds.length} 台)</span>
                          </label>
                          <span className="text-[11px] text-slate-500">
                            支持设定多个低频激励器/门禁设备，涵盖多个舱口通道
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAddingExciter('entry')}
                          className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer font-medium shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>关联新激励器</span>
                        </button>
                      </div>

                      {/* 已关联设备卡片列表 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentCabin.entryRule.associatedDeviceIds.map(devId => {
                          const dev = MOCK_EXCITER_DEVICES.find(d => d.id === devId) || {
                            id: devId,
                            code: devId,
                            name: `激励器 ${devId}`,
                            location: '舱口安装位',
                            status: '在线' as const,
                            frequency: '125KHz 低频',
                            coverageRange: '2.0m'
                          };

                          return (
                            <div 
                              key={devId}
                              className="p-3 rounded-xl border border-emerald-200/90 bg-emerald-50/30 flex items-start justify-between relative group hover:border-emerald-400 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                                    {dev.code}
                                  </span>
                                  <span className="font-semibold text-xs text-slate-800">
                                    {dev.name}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                                    {dev.status}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                  <span>位置: {dev.location}</span>
                                  <span>·</span>
                                  <span className="text-emerald-700">{dev.frequency}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveExciterFromRule(devId, 'entry')}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                title="解除关联"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}

                        {currentCabin.entryRule.associatedDeviceIds.length === 0 && (
                          <div className="col-span-2 py-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                            尚未关联任何激励器设备，请点击右上角按钮添加
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 判定触发逻辑 */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                      <div className="font-semibold text-slate-800">进舱判定触发逻辑选择</div>
                      <div className="space-y-2">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="radio"
                            name="entryMode"
                            checked={currentCabin.entryRule.detectionMode === 'single_exciter'}
                            onChange={() => {
                              updateCurrentCabin(c => ({
                                ...c,
                                entryRule: { ...c.entryRule, detectionMode: 'single_exciter' }
                              }));
                            }}
                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="font-semibold text-slate-800">单设备感应触发 (推荐)</span>
                            <p className="text-slate-500 text-[11px]">
                              定位标签进入任一关联激励器场强覆盖范围（低频 125KHz，1.5~3m）即判定为有效进舱并登记入表。
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="radio"
                            name="entryMode"
                            checked={currentCabin.entryRule.detectionMode === 'dual_sequence'}
                            onChange={() => {
                              updateCurrentCabin(c => ({
                                ...c,
                                entryRule: { ...c.entryRule, detectionMode: 'dual_sequence' }
                              }));
                            }}
                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="font-semibold text-slate-800">双激励器进出方向时序判定</span>
                            <p className="text-slate-500 text-[11px]">
                              先经过外侧激励器后触发内侧激励器，确认人员为从外部进入舱内施工，防止舱口停留误判。
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. 出船舱规则设定 */}
                {activeRuleTab === 'exit' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                      <div>
                        <div className="font-semibold text-xs text-amber-950 flex items-center gap-2">
                          <span>出舱结算规则状态</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            currentCabin.exitRule.enabled ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'
                          }`}>
                            {currentCabin.exitRule.enabled ? '已启用结算' : '已停用'}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 mt-1">
                          当人员佩戴定位标签离开舱室并感应出舱激励器时，系统自动核减在舱人数，并停止作业停留计时。
                        </p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentCabin.exitRule.enabled}
                          onChange={e => {
                            updateCurrentCabin(cabin => ({
                              ...cabin,
                              exitRule: { ...cabin.exitRule, enabled: e.target.checked }
                            }));
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>

                    {/* 规则基本信息 */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">出舱规则名称</label>
                        <input
                          type="text"
                          value={currentCabin.exitRule.ruleName}
                          onChange={e => {
                            const val = e.target.value;
                            updateCurrentCabin(c => ({
                              ...c,
                              exitRule: { ...c.exitRule, ruleName: val }
                            }));
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">无信号超时自动结算出舱时长 (小时)</label>
                        <select
                          value={currentCabin.exitRule.autoExitHours}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateCurrentCabin(c => ({
                              ...c,
                              exitRule: { ...c.exitRule, autoExitHours: val }
                            }));
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        >
                          <option value={2}>2 小时</option>
                          <option value={4}>4 小时 (半工班)</option>
                          <option value={6}>6 小时</option>
                          <option value={8}>8 小时 (全工班自动离舱重置)</option>
                        </select>
                      </div>
                    </div>

                    {/* 关联出舱激励器设备 (核心要求：支持设定多个设备关联) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                            <Radio className="w-4 h-4 text-amber-600" />
                            <span>关联出舱激励器设备 (已关联 {currentCabin.exitRule.associatedDeviceIds.length} 台)</span>
                          </label>
                          <span className="text-[11px] text-slate-500">
                            支持设定多个出舱通道激励器，触发时自动结算出舱
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAddingExciter('exit')}
                          className="px-2.5 py-1 text-xs bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-1 cursor-pointer font-medium shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>关联新激励器</span>
                        </button>
                      </div>

                      {/* 已关联设备卡片列表 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentCabin.exitRule.associatedDeviceIds.map(devId => {
                          const dev = MOCK_EXCITER_DEVICES.find(d => d.id === devId) || {
                            id: devId,
                            code: devId,
                            name: `出舱激励器 ${devId}`,
                            location: '舱口逆向通道',
                            status: '在线' as const,
                            frequency: '125KHz 低频',
                            coverageRange: '2.0m'
                          };

                          return (
                            <div 
                              key={devId}
                              className="p-3 rounded-xl border border-amber-200/90 bg-amber-50/30 flex items-start justify-between relative group hover:border-amber-400 transition-colors"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                                    {dev.code}
                                  </span>
                                  <span className="font-semibold text-xs text-slate-800">
                                    {dev.name}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-700 font-medium">
                                    {dev.status}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                  <span>位置: {dev.location}</span>
                                  <span>·</span>
                                  <span className="text-amber-700">{dev.frequency}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveExciterFromRule(devId, 'exit')}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                title="解除关联"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}

                        {currentCabin.exitRule.associatedDeviceIds.length === 0 && (
                          <div className="col-span-2 py-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                            尚未关联任何出舱激励器设备，请点击右上角按钮添加
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. 定员与超时报警门限 */}
                {activeRuleTab === 'threshold' && (
                  <div className="space-y-6 animate-in fade-in duration-150 text-xs">
                    <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                      <div className="font-semibold text-blue-900 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-blue-600" />
                        <span>安全受控门限与大屏联动规则</span>
                      </div>
                      <p className="text-blue-700 text-[11px]">
                        系统根据设定的门限与实时进舱人员对比，当人数超过密集阈值或单人停留超时时，作业面大屏与监控台将触发智能声光预警。
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <label className="font-semibold text-slate-800 block">额定定员上限 (人)</label>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={currentCabin.capacityLimit}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateCurrentCabin(c => ({ ...c, capacityLimit: val }));
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono text-sm font-bold text-slate-800"
                        />
                        <p className="text-[11px] text-slate-500">超过此人数即判定为“高密超员”严重违规</p>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <label className="font-semibold text-slate-800 block">密集人员关注门限 (人)</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={currentCabin.denseThreshold}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateCurrentCabin(c => ({ ...c, denseThreshold: val }));
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono text-sm font-bold text-amber-700"
                        />
                        <p className="text-[11px] text-slate-500">默认3人，用于人员密集作业联动监护</p>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <label className="font-semibold text-slate-800 block">最长滞留预警门限 (分钟)</label>
                        <input
                          type="number"
                          min={15}
                          max={480}
                          step={15}
                          value={currentCabin.maxStayMinutes}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateCurrentCabin(c => ({ ...c, maxStayMinutes: val }));
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono text-sm font-bold text-rose-700"
                        />
                        <p className="text-[11px] text-slate-500">入舱超过此时间标记为“停留超时”并告警</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. 在舱人员名单预览 */}
                {activeRuleTab === 'roster' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-600">
                        根据当前进出规则判定，在舱作业受控人员共 <strong className="text-blue-600 font-mono text-sm">{cabinPersonnelList.length}</strong> 人
                      </div>

                      <button
                        type="button"
                        onClick={handleSimulateEntry}
                        className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer font-medium shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>手动模拟进舱打卡</span>
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                          <tr>
                            <th className="py-2.5 px-3">工号</th>
                            <th className="py-2.5 px-3">姓名</th>
                            <th className="py-2.5 px-3">班组</th>
                            <th className="py-2.5 px-3">工种</th>
                            <th className="py-2.5 px-3">定位标签号</th>
                            <th className="py-2.5 px-3">触发进舱激励器</th>
                            <th className="py-2.5 px-3">进入时间</th>
                            <th className="py-2.5 px-3">停留时长</th>
                            <th className="py-2.5 px-3">当前状态</th>
                            <th className="py-2.5 px-3 text-center">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cabinPersonnelList.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2 px-3 font-mono font-medium text-slate-700">{item.workerId}</td>
                              <td className="py-2 px-3 font-bold text-slate-900">{item.name}</td>
                              <td className="py-2 px-3 text-slate-600">{item.team}</td>
                              <td className="py-2 px-3 text-slate-600">{item.trade}</td>
                              <td className="py-2 px-3 font-mono text-blue-700">{item.tagCode}</td>
                              <td className="py-2 px-3 text-emerald-700">{item.triggeredExciterName}</td>
                              <td className="py-2 px-3 font-mono text-slate-500">{item.entryTime}</td>
                              <td className="py-2 px-3 font-mono font-semibold text-slate-700">{item.duration}</td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  item.status === '停留超时' 
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleSimulateExit(item.id, item.name)}
                                  className="text-rose-600 hover:text-rose-800 font-medium hover:underline cursor-pointer"
                                  title="模拟出舱打卡"
                                >
                                  出舱结算
                                </button>
                              </td>
                            </tr>
                          ))}

                          {cabinPersonnelList.length === 0 && (
                            <tr>
                              <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                                暂无人员进舱记录，当前舱内无人
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              请在左侧选择需要配置规则的船舱
            </div>
          )}
        </div>

        {/* 底部保存按钮栏 */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/90 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600" />
            <span>保存后规则将实时同步至现场物联感知引擎与作业面大屏</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveConfigs}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>保存配置并下发</span>
            </button>
          </div>
        </div>
      </div>

      {/* 关联新激励器浮层 */}
      {isAddingExciter && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => setIsAddingExciter(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Radio className="w-4 h-4 text-blue-600" />
                <span>选择关联的{isAddingExciter === 'entry' ? '进舱' : '出舱'}激励器设备</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingExciter(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索激励器名称 / 编码 / 安装位置..."
                value={exciterSearch}
                onChange={e => setExciterSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg">
              {MOCK_EXCITER_DEVICES.filter(dev => {
                if (exciterSearch.trim()) {
                  const kw = exciterSearch.toLowerCase();
                  return dev.name.toLowerCase().includes(kw) || dev.code.toLowerCase().includes(kw) || dev.location.toLowerCase().includes(kw);
                }
                return true;
              }).map(dev => {
                const targetRule = isAddingExciter === 'entry' ? currentCabin?.entryRule : currentCabin?.exitRule;
                const isAlreadyAdded = targetRule?.associatedDeviceIds.includes(dev.id);

                return (
                  <div key={dev.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                          {dev.code}
                        </span>
                        <span className="font-semibold text-xs text-slate-900">
                          {dev.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {dev.location} · <span className="text-blue-600">{dev.frequency}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isAlreadyAdded}
                      onClick={() => {
                        handleAddExciterToRule(dev.id, isAddingExciter);
                        setIsAddingExciter(null);
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        isAlreadyAdded 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                      }`}
                    >
                      {isAlreadyAdded ? '已关联' : '选择关联'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsAddingExciter(null)}
                className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
