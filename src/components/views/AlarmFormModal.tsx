import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Check, 
  Info, 
  AlertTriangle, 
  GitBranch, 
  Sparkles, 
  Clock, 
  ShieldAlert,
  BellRing
} from 'lucide-react';
import { AlarmRuleItem, AlarmRuleVersion, generateVersionId, formatDateTime, ALARM_POLICY_TYPES } from '@/src/data/alarmData';

interface AlarmFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rule: AlarmRuleItem, isEdit: boolean) => void;
  editRule?: AlarmRuleItem | null; // 如果传入则为编辑模式，否则为新建模式
}

export function AlarmFormModal({ isOpen, onClose, onSubmit, editRule }: AlarmFormModalProps) {
  const isEdit = Boolean(editRule);

  // 表单字段状态
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  
  // 区域范围条件列表 (支持多条件组合)
  const [areaConditions, setAreaConditions] = useState([
    { type: '', relation: '是', target: '' }
  ]);

  // 人员范围条件列表 (支持多条件组合)
  const [personConditions, setPersonConditions] = useState([
    { scope: '', relation: '是', target: '' }
  ]);

  // 策略条件
  const [conditionType, setConditionType] = useState('');
  const [conditionOperator, setConditionOperator] = useState('');
  const [conditionValue, setConditionValue] = useState<number>(10);

  // 通知人员配置
  const [lowTarget, setLowTarget] = useState('');
  const [lowCountdown, setLowCountdown] = useState('');
  const [lowUnit, setLowUnit] = useState('分钟');

  const [midTarget, setMidTarget] = useState('');
  const [midCountdown, setMidCountdown] = useState('');
  const [midUnit, setMidUnit] = useState('分钟');

  const [highTarget, setHighTarget] = useState('');

  // 通知方式与周期
  const [notifySoundLight, setNotifySoundLight] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [alarmInterval, setAlarmInterval] = useState<'不重复' | '重复告警'>('不重复');
  const [effectivePeriod, setEffectivePeriod] = useState<'自定义' | '永久' | '联动【加班登记单】实际作业时段'>('永久');
  const [status, setStatus] = useState<'启用' | '禁用'>('启用');

  // 编辑模式特有：变更说明 / 备注
  const [changeNotes, setChangeNotes] = useState('');

  // 错误提示
  const [errorMsg, setErrorMsg] = useState('');

  // 预估新版本号计算
  const getNextVersionNumber = () => {
    if (!editRule || !editRule.versions || editRule.versions.length === 0) return 1;
    const maxNum = Math.max(...editRule.versions.map(v => v.versionNumber || 1));
    return maxNum + 1;
  };

  const nextVersionId = isEdit 
    ? generateVersionId(getNextVersionNumber()) 
    : generateVersionId(1);

  // 当 editRule 发生变化时，回填表单
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (editRule) {
        // 编辑模式：回填
        setName(editRule.name || '');
        setType(editRule.type || '');
        
        if (editRule.areaConditions && editRule.areaConditions.length > 0) {
          setAreaConditions([...editRule.areaConditions]);
        } else {
          setAreaConditions([{ type: '造船台/船坞', relation: '是', target: '1号造船台' }]);
        }

        if (editRule.personConditions && editRule.personConditions.length > 0) {
          setPersonConditions([...editRule.personConditions]);
        } else {
          setPersonConditions([{ scope: '全厂工人', relation: '是', target: '全体施工人员' }]);
        }

        setConditionType(editRule.conditionType || '滞留超时时长');
        setConditionOperator(editRule.conditionOperator || '大于');
        setConditionValue(editRule.conditionValue ?? 10);

        // 解析低中高通知
        const targets = editRule.notifyTargets || { low: '', lowCountdown: '', mid: '', midCountdown: '', high: '' };
        setLowTarget(targets.low || '');
        
        const lowCd = targets.lowCountdown || '';
        if (lowCd.includes('小时')) {
          setLowCountdown(lowCd.replace('小时', ''));
          setLowUnit('小时');
        } else {
          setLowCountdown(lowCd.replace('分钟', ''));
          setLowUnit('分钟');
        }

        setMidTarget(targets.mid || '');
        const midCd = targets.midCountdown || '';
        if (midCd.includes('小时')) {
          setMidCountdown(midCd.replace('小时', ''));
          setMidUnit('小时');
        } else {
          setMidCountdown(midCd.replace('分钟', ''));
          setMidUnit('分钟');
        }

        setHighTarget(targets.high || '');

        setNotifySoundLight(editRule.notifyWays ? editRule.notifyWays.includes('声光报警通知') : true);
        setNotifySms(editRule.notifyWays ? editRule.notifyWays.includes('发送短信通知') : false);
        setAlarmInterval(editRule.repeatInterval || '不重复');
        setEffectivePeriod(editRule.effectivePeriod || '永久');
        setStatus(editRule.status || '启用');
        setChangeNotes(`调整告警参数，更新至 ${nextVersionId}`);
      } else {
        // 新建模式：重置为默认值
        setName('');
        setType('');
        setAreaConditions([{ type: '', relation: '是', target: '' }]);
        setPersonConditions([{ scope: '', relation: '是', target: '' }]);
        setConditionType('');
        setConditionOperator('');
        setConditionValue(10);
        setLowTarget('');
        setLowCountdown('');
        setLowUnit('分钟');
        setMidTarget('');
        setMidCountdown('');
        setMidUnit('分钟');
        setHighTarget('');
        setNotifySoundLight(true);
        setNotifySms(false);
        setAlarmInterval('不重复');
        setEffectivePeriod('永久');
        setStatus('启用');
        setChangeNotes('');
      }
    }
  }, [isOpen, editRule]);

  if (!isOpen) return null;

  // 添加区域条件
  const handleAddAreaCondition = () => {
    setAreaConditions([...areaConditions, { type: '', relation: '是', target: '' }]);
  };

  const handleRemoveAreaCondition = (idx: number) => {
    if (areaConditions.length <= 1) return;
    setAreaConditions(areaConditions.filter((_, i) => i !== idx));
  };

  // 添加人员条件
  const handleAddPersonCondition = () => {
    setPersonConditions([...personConditions, { scope: '', relation: '是', target: '' }]);
  };

  const handleRemovePersonCondition = (idx: number) => {
    if (personConditions.length <= 1) return;
    setPersonConditions(personConditions.filter((_, i) => i !== idx));
  };

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('请输入告警策略名称');
      return;
    }
    if (!type) {
      setErrorMsg('请选择策略类型');
      return;
    }

    const now = new Date();
    const formattedNow = formatDateTime(now);

    // 计算主告警等级 (优先取有配置的最高等级或默认低)
    let mainLevel: '低' | '中' | '高' = '低';
    if (highTarget) {
      mainLevel = '高';
    } else if (midTarget) {
      mainLevel = '中';
    }

    const isTamperType = type === '标签防拆' || type.includes('防拆');
    const notifyWays: string[] = [];
    if (!isTamperType && notifySoundLight) notifyWays.push('声光报警通知');
    if (notifySms) notifyWays.push('发送短信通知');

    const lowCdFormatted = lowCountdown ? `${lowCountdown}${lowUnit}` : '';
    const midCdFormatted = midCountdown ? `${midCountdown}${midUnit}` : '';

    // 当前版本的快照对象
    const snapshot = {
      name: name.trim(),
      type: type,
      level: mainLevel,
      areaConditions: areaConditions.filter(c => c.type || c.target),
      personConditions: personConditions.filter(c => c.scope || c.target),
      conditionType: conditionType || '滞留超时时长',
      conditionOperator: conditionOperator || '大于',
      conditionValue: conditionValue,
      notifyTargets: {
        low: lowTarget,
        lowCountdown: lowCdFormatted,
        mid: midTarget,
        midCountdown: midCdFormatted,
        high: highTarget
      },
      notifyWays: notifyWays,
      repeatInterval: alarmInterval,
      effectivePeriod: effectivePeriod,
      status: status
    };

    if (isEdit && editRule) {
      // ===== 编辑模式：生成新版本并追加至历史 =====
      const newVersionNum = getNextVersionNumber();
      const newVersionId = generateVersionId(newVersionNum);

      const newVersionRecord: AlarmRuleVersion = {
        versionId: newVersionId,
        versionNumber: newVersionNum,
        createdAt: formattedNow,
        modifier: '系统管理员',
        changeNotes: changeNotes.trim() || `编辑告警配置项，更新为 ${newVersionId}`,
        snapshot: snapshot
      };

      const updatedRule: AlarmRuleItem = {
        ...editRule,
        name: name.trim(),
        type: type,
        level: mainLevel,
        notify: (lowTarget || midTarget || highTarget) ? '是' : '否',
        period: effectivePeriod,
        status: status,
        currentVersion: newVersionId,
        modifiedAt: formattedNow,
        // 更新当前版本列表（新版本插入最前面）
        versions: [newVersionRecord, ...(editRule.versions || [])],
        // 更新激活属性
        areaConditions: snapshot.areaConditions,
        personConditions: snapshot.personConditions,
        conditionType: snapshot.conditionType,
        conditionOperator: snapshot.conditionOperator,
        conditionValue: snapshot.conditionValue,
        notifyTargets: snapshot.notifyTargets,
        notifyWays: snapshot.notifyWays,
        repeatInterval: snapshot.repeatInterval,
        effectivePeriod: snapshot.effectivePeriod
      };

      onSubmit(updatedRule, true);
    } else {
      // ===== 新建模式：初始生成 V1 =====
      const initialVersionId = generateVersionId(1);

      const initialVersionRecord: AlarmRuleVersion = {
        versionId: initialVersionId,
        versionNumber: 1,
        createdAt: formattedNow,
        modifier: '系统管理员',
        changeNotes: '初始创建告警配置策略',
        snapshot: snapshot
      };

      const newRule: AlarmRuleItem = {
        id: Date.now(),
        name: name.trim(),
        type: type,
        level: mainLevel,
        notify: (lowTarget || midTarget || highTarget) ? '是' : '否',
        period: effectivePeriod,
        status: status,
        currentVersion: initialVersionId,
        modifiedAt: formattedNow,
        createdAt: formattedNow,
        versions: [initialVersionRecord],
        areaConditions: snapshot.areaConditions,
        personConditions: snapshot.personConditions,
        conditionType: snapshot.conditionType,
        conditionOperator: snapshot.conditionOperator,
        conditionValue: snapshot.conditionValue,
        notifyTargets: snapshot.notifyTargets,
        notifyWays: snapshot.notifyWays,
        repeatInterval: snapshot.repeatInterval,
        effectivePeriod: snapshot.effectivePeriod
      };

      onSubmit(newRule, false);
    }

    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 text-slate-700 font-sans"
      >
        {/* 1. 顶部标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs ${
              isEdit 
                ? 'bg-amber-500/10 border-amber-200 text-amber-600' 
                : 'bg-blue-600/10 border-blue-200 text-blue-600'
            }`}>
              {isEdit ? <GitBranch className="w-5 h-5" /> : <BellRing className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800 tracking-wide">
                  {isEdit ? `编辑告警配置项` : `新建告警配置`}
                </h2>
                {isEdit ? (
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>当前: {editRule?.currentVersion}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-emerald-700 font-bold">新版本: {nextVersionId}</span>
                  </span>
                ) : (
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    版本号: {nextVersionId}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEdit 
                  ? '修改配置并保存后将自动归档历史快照并递增生成新的告警版本编号' 
                  : '配置区域范围、人员过滤、多级联动升级策略与关联造船工程项目'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 表单内容区域 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-[13px]">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setErrorMsg('')}
                className="text-rose-400 hover:text-rose-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 版本递增提示横幅 (编辑模式) */}
          {isEdit && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900 shadow-2xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>版本自动递增机制：</strong>本次保存后将自动归档当前版本（{editRule?.currentVersion}），并生成最新版本 <strong>{nextVersionId}</strong>。
                </span>
              </div>
              <div className="font-mono text-[11px] text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded border border-amber-300/60">
                按 V{getNextVersionNumber()}-{nextVersionId.split('-')[1]} 命名
              </div>
            </div>
          )}

          {/* 告警策略名称 */}
          <div className="flex items-center">
            <label className="w-28 text-right pr-4 text-slate-600 shrink-0 font-medium">
              <span className="text-red-500 mr-1">*</span>告警策略名称
            </label>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={name}
                maxLength={255}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="请输入告警策略名称（如：1号船台密闭舱气体浓度多级告警）" 
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow text-[13px]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono pointer-events-none">
                {name.length} / 255
              </span>
            </div>
          </div>

          {/* 策略类型 */}
          <div className="flex items-center">
            <label className="w-28 text-right pr-4 text-slate-600 shrink-0 font-medium">
              <span className="text-red-500 mr-1">*</span>策略类型
            </label>
            <div className="flex-1">
              <select 
                value={type}
                onChange={(e) => {
                  const selectedType = e.target.value;
                  setType(selectedType);
                  if (errorMsg) setErrorMsg('');

                  // 自动联动填充针对【安全员缺岗/脱岗】的推荐策略配置
                  if (selectedType === '安全员缺岗/脱岗') {
                    if (!name.trim()) {
                      setName('加班作业现场安全员缺岗/脱岗智能监测规程');
                    }
                    setAreaConditions([
                      { type: '关联业务单据区域', relation: '否', target: '加班单指定施工区域 (如 185-4 / 517-2)' }
                    ]);
                    setPersonConditions([
                      { scope: '单据指定安全员/监护人', relation: '是', target: '单据登记之当班安全员 (如 周卫国)' }
                    ]);
                    setConditionType('脱离指定区域时长');
                    setConditionOperator('大于');
                    setConditionValue(10);
                  }
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[13px] bg-white cursor-pointer font-medium"
              >
                <option value="" disabled hidden>请选择策略类型</option>
                {ALARM_POLICY_TYPES.map(policyType => (
                  <option key={policyType} value={policyType}>
                    {policyType} {policyType === '安全员缺岗/脱岗' ? ' (⚡智能单据联动)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 区域范围 */}
          <div className="flex items-start">
            <label className="w-28 text-right pr-4 pt-2 text-slate-600 shrink-0 font-medium">
              <span className="text-red-500 mr-1">*</span>区域范围
            </label>
            <div className="flex-1 space-y-2">
              {areaConditions.map((cond, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <select 
                    value={cond.type}
                    onChange={(e) => {
                      const updated = [...areaConditions];
                      const selectedVal = e.target.value;
                      updated[idx].type = selectedVal;
                      // 自动设置对应默认目标及排除关系
                      if (selectedVal === '关联业务单据区域') {
                        updated[idx].relation = '否';
                        updated[idx].target = '加班单指定施工区域 (如 185-4 / 517-2)';
                      }
                      setAreaConditions(updated);
                    }}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-[13px] bg-white font-medium"
                  >
                    <option value="" disabled hidden>请选择区域类型</option>
                    <option value="关联业务单据区域">关联业务单据区域 (⚡动态读取加班单)</option>
                    <option value="造船台/船坞">造船台/船坞</option>
                    <option value="密闭液货舱室">密闭液货舱室</option>
                    <option value="车间生产线">车间生产线</option>
                    <option value="舾装码头">舾装码头</option>
                    <option value="高压配电区">高压配电区</option>
                  </select>

                  <select 
                    value={cond.relation}
                    onChange={(e) => {
                      const updated = [...areaConditions];
                      updated[idx].relation = e.target.value;
                      setAreaConditions(updated);
                    }}
                    className="w-28 px-2 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-[13px] bg-white font-medium"
                  >
                    <option value="是">是 (在区域内)</option>
                    <option value="否">否 (排除/不在区域内)</option>
                  </select>

                  <select 
                    value={cond.target}
                    onChange={(e) => {
                      const updated = [...areaConditions];
                      updated[idx].target = e.target.value;
                      setAreaConditions(updated);
                    }}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-[13px] bg-white font-medium"
                  >
                    <option value="" disabled hidden>请选择指定区域</option>
                    <option value="加班单指定施工区域 (如 185-4 / 517-2)">加班单指定施工区域 (如 185-4 / 517-2)</option>
                    <option value="1号造船台">1号造船台</option>
                    <option value="6号船台（平船台）">6号船台（平船台）</option>
                    <option value="1#液货舱">1#液货舱</option>
                    <option value="2#液货舱">2#液货舱</option>
                    <option value="总装车间">总装车间</option>
                    <option value="涂装车间">涂装车间</option>
                    <option value="机舱管路区">机舱管路区</option>
                    <option value="1号码头">1号码头</option>
                    <option value="2号码头 (移动码头)">2号码头 (移动码头)</option>
                    <option value="3号码头 (移动码头)">3号码头 (移动码头)</option>
                  </select>

                  {areaConditions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAreaCondition(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-rose-50 transition-colors"
                      title="删除此条件"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddAreaCondition}
                className="flex items-center gap-1 text-[#1677ff] bg-[#e6f4ff] hover:bg-[#bae0ff] border border-[#91caff] px-3 py-1 rounded-lg text-xs font-medium transition-colors mt-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> 添加（并且）区域条件
              </button>
            </div>
          </div>

          {/* 人员范围 */}
          <div className="flex items-start">
            <label className="w-28 text-right pr-4 pt-2 text-slate-600 shrink-0 font-medium">
              <span className="text-red-500 mr-1">*</span>人员范围
            </label>
            <div className="flex-1 space-y-2">
              {personConditions.map((cond, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <select 
                    value={cond.scope}
                    onChange={(e) => {
                      const updated = [...personConditions];
                      const selectedScope = e.target.value;
                      updated[idx].scope = selectedScope;
                      if (selectedScope === '单据指定安全员/监护人') {
                        updated[idx].target = '单据登记之当班安全员 (如 周卫国)';
                      }
                      setPersonConditions(updated);
                    }}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-[13px] bg-white font-medium"
                  >
                    <option value="" disabled hidden>请选择工人人员范围</option>
                    <option value="单据指定安全员/监护人">单据指定安全员/监护人 (⚡精准锁定单据主体)</option>
                    <option value="工种类别">工种类别</option>
                    <option value="作业班组">作业班组</option>
                    <option value="部门">部门</option>
                    <option value="指定人员">指定人员</option>
                    <option value="全厂工人">全厂工人</option>
                  </select>

                  <select 
                    value={cond.relation}
                    onChange={(e) => {
                      const updated = [...personConditions];
                      updated[idx].relation = e.target.value;
                      setPersonConditions(updated);
                    }}
                    className="w-28 px-2 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-[13px] bg-white font-medium"
                  >
                    <option value="是">是 (包含目标)</option>
                    <option value="否">否 (排除目标)</option>
                  </select>

                  <select 
                    value={cond.target}
                    onChange={(e) => {
                      const updated = [...personConditions];
                      updated[idx].target = e.target.value;
                      setPersonConditions(updated);
                    }}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 text-[13px] bg-white font-medium"
                  >
                    <option value="" disabled hidden>请选择具体对象</option>
                    <option value="单据登记之当班安全员 (如 周卫国)">单据登记之当班安全员 (如 周卫国)</option>
                    <option value="焊接工">焊接工</option>
                    <option value="装配钳工">装配钳工</option>
                    <option value="探伤质检员">探伤质检员</option>
                    <option value="起重工">起重工</option>
                    <option value="电工">电工</option>
                    <option value="外包施工人员">外包施工人员</option>
                    <option value="全体施工人员">全体施工人员</option>
                  </select>

                  {personConditions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePersonCondition(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-rose-50 transition-colors"
                      title="删除此条件"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddPersonCondition}
                className="flex items-center gap-1 text-[#1677ff] bg-[#e6f4ff] hover:bg-[#bae0ff] border border-[#91caff] px-3 py-1 rounded-lg text-xs font-medium transition-colors mt-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> 添加（并且）人员条件
              </button>
            </div>
          </div>

          {/* 策略条件 */}
          <div className="flex items-center">
            <label className="w-28 text-right pr-4 text-slate-600 shrink-0 font-medium">
              <span className="text-red-500 mr-1">*</span>策略条件
            </label>
            <div className="flex-1 flex items-center gap-3">
              <select 
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 text-[13px] bg-white font-medium"
              >
                <option value="" disabled hidden>请选择策略条件</option>
                <option value="脱离指定区域时长">脱离指定区域时长 (缺岗/脱岗判别)</option>
                <option value="连续缺岗时长">连续缺岗时长</option>
                <option value="滞留超时时长">滞留超时时长</option>
                <option value="可燃气体超标浓度">可燃气体超标浓度</option>
                <option value="静止不活动时长">静止不活动时长</option>
                <option value="无进出许可进入">无进出许可进入</option>
                <option value="未佩戴定位手环">未佩戴定位手环</option>
                <option value="防拆触点断开触发">防拆触点断开触发</option>
                <option value="烟雾浓度超标">烟雾浓度超标</option>
              </select>

              <select 
                value={conditionOperator}
                onChange={(e) => setConditionOperator(e.target.value)}
                className="w-32 px-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-blue-500 text-[13px] bg-white"
              >
                <option value="" disabled hidden>请选择</option>
                <option value="大于">大于</option>
                <option value="大于等于">大于等于</option>
                <option value="小于">小于</option>
                <option value="等于">等于</option>
                <option value="存在">存在</option>
              </select>

              {/* 步进器 */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => setConditionValue(Math.max(0, conditionValue - 1))}
                  className="px-2.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border-r border-slate-200 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input 
                  type="number"
                  value={conditionValue}
                  onChange={(e) => setConditionValue(Number(e.target.value) || 0)}
                  className="w-16 py-1.5 text-center text-slate-800 text-[13px] font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setConditionValue(conditionValue + 1)}
                  className="px-2.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border-l border-slate-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 通知人员表格 */}
          <div className="flex items-start">
            <label className="w-28 text-right pr-4 pt-2 text-slate-600 shrink-0 font-medium">
              <span className="text-red-500 mr-1">*</span>通知人员
            </label>
            <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fafafa] border-b border-slate-200 text-slate-600 font-medium">
                  <tr>
                    <th className="py-2.5 px-4 w-20 text-center">等级</th>
                    <th className="py-2.5 px-4"><span className="text-red-500 mr-1">*</span>通知对象</th>
                    <th className="py-2.5 px-4 w-64">触发升级倒计时</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {/* 低等级 */}
                  <tr>
                    <td className="py-2.5 px-4 text-center font-bold text-blue-600">低</td>
                    <td className="py-2.5 px-4">
                      <select 
                        value={lowTarget}
                        onChange={(e) => setLowTarget(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-[13px] bg-white"
                      >
                        <option value="" disabled hidden>请选择通知对象</option>
                        <option value="现场施工班组长">现场施工班组长</option>
                        <option value="当班区域安全员">当班区域安全员</option>
                        <option value="车间调度员">车间调度员</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={lowCountdown}
                          onChange={(e) => setLowCountdown(e.target.value)}
                          placeholder="请输入时长" 
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-[13px]"
                        />
                        <select 
                          value={lowUnit}
                          onChange={(e) => setLowUnit(e.target.value)}
                          className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-slate-600 text-[13px] bg-white"
                        >
                          <option value="分钟">分钟</option>
                          <option value="小时">小时</option>
                        </select>
                      </div>
                    </td>
                  </tr>

                  {/* 中等级 */}
                  <tr>
                    <td className="py-2.5 px-4 text-center font-bold text-amber-600">中</td>
                    <td className="py-2.5 px-4">
                      <select 
                        value={midTarget}
                        onChange={(e) => setMidTarget(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-[13px] bg-white"
                      >
                        <option value="" disabled hidden>请选择通知对象</option>
                        <option value="车间安全主任">车间安全主任</option>
                        <option value="造船项目副经理">造船项目副经理</option>
                        <option value="生产作业部长">生产作业部长</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={midCountdown}
                          onChange={(e) => setMidCountdown(e.target.value)}
                          placeholder="请输入时长" 
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-[13px]"
                        />
                        <select 
                          value={midUnit}
                          onChange={(e) => setMidUnit(e.target.value)}
                          className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-slate-600 text-[13px] bg-white"
                        >
                          <option value="分钟">分钟</option>
                          <option value="小时">小时</option>
                        </select>
                      </div>
                    </td>
                  </tr>

                  {/* 高等级 */}
                  <tr>
                    <td className="py-2.5 px-4 text-center font-bold text-red-600">高</td>
                    <td className="py-2.5 px-4">
                      <select 
                        value={highTarget}
                        onChange={(e) => setHighTarget(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-[13px] bg-white"
                      >
                        <option value="" disabled hidden>请选择通知对象</option>
                        <option value="厂级安全总监与应急指挥中心">厂级安全总监与应急指挥中心</option>
                        <option value="船厂总工程师与厂长">船厂总工程师与厂长</option>
                        <option value="造船项目第一负责人">造船项目第一负责人</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 text-xs italic">
                      最高级别无需升级
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 通知方式 */}
          <div className="flex items-center">
            <label className="w-28 text-right pr-4 text-slate-600 shrink-0 font-medium">
              通知方式
            </label>
            <div className="flex items-center gap-6 text-slate-700">
              {!(type === '标签防拆' || type.includes('防拆')) && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifySoundLight}
                    onChange={(e) => setNotifySoundLight(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span>声光报警通知</span>
                </label>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span>发送短信通知</span>
              </label>

              {(type === '标签防拆' || type.includes('防拆')) && (
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  标签防拆告警类型下仅保留发送短信通知
                </span>
              )}
            </div>
          </div>

          {/* 告警间隔 */}
          <div className="flex items-center">
            <label className="w-28 text-right pr-4 text-slate-600 shrink-0 font-medium">
              告警间隔
            </label>
            <div className="flex items-center gap-6 text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="alarmInterval"
                  value="不重复"
                  checked={alarmInterval === '不重复'}
                  onChange={() => setAlarmInterval('不重复')}
                  className="text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <span>不重复</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="alarmInterval"
                  value="重复告警"
                  checked={alarmInterval === '重复告警'}
                  onChange={() => setAlarmInterval('重复告警')}
                  className="text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <span>重复告警</span>
              </label>
            </div>
          </div>

          {/* 生效周期 */}
          <div className="flex items-center">
            <label className="w-28 text-right pr-4 text-slate-600 shrink-0 font-medium">
              生效周期
            </label>
            <div className="flex items-center gap-6 text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="effectivePeriod"
                  value="自定义"
                  checked={effectivePeriod === '自定义'}
                  onChange={() => setEffectivePeriod('自定义')}
                  className="text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <span>自定义</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="effectivePeriod"
                  value="永久"
                  checked={effectivePeriod === '永久'}
                  onChange={() => setEffectivePeriod('永久')}
                  className="text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <span>永久</span>
              </label>
            </div>
          </div>

          {/* 状态 */}
          <div className="flex items-center">
            <label className="w-28 text-right pr-4 text-slate-600 shrink-0 font-medium">
              <span className="text-red-500 mr-1">*</span>启用状态
            </label>
            <div className="flex items-center gap-6 text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="status"
                  value="禁用"
                  checked={status === '禁用'}
                  onChange={() => setStatus('禁用')}
                  className="text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <span>禁用</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="status"
                  value="启用"
                  checked={status === '启用'}
                  onChange={() => setStatus('启用')}
                  className="text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <span>启用</span>
              </label>
            </div>
          </div>

          {/* 编辑模式下的变更说明 */}
          {isEdit && (
            <div className="flex items-start pt-2 border-t border-slate-100">
              <label className="w-28 text-right pr-4 pt-2 text-slate-600 shrink-0 font-medium">
                版本变更说明
              </label>
              <div className="flex-1">
                <textarea
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  placeholder={`请简述本次版本更新的变动内容（如：调整了某船台触发条件或通知链）`}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
                />
                <span className="text-[11px] text-slate-400">
                  说明将记录进版本快照历史时间轴中，便于追溯。
                </span>
              </div>
            </div>
          )}

        </form>

        {/* 3. 底部操作按钮 */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center gap-3 shrink-0 rounded-b-2xl">
          <div className="text-xs text-slate-500 font-mono">
            {isEdit ? (
              <span>将生成新版本: <strong className="text-emerald-600">{nextVersionId}</strong></span>
            ) : (
              <span>初始版本: <strong className="text-blue-600">{nextVersionId}</strong></span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-white border border-slate-200 text-slate-600 text-[13px] rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-colors font-medium cursor-pointer shadow-xs"
            >
              取消
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#1677ff] hover:bg-blue-600 text-white text-[13px] rounded-xl shadow-md shadow-blue-500/20 transition-all font-semibold flex items-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <Check className="w-4 h-4" /> 
              <span>{isEdit ? `保存并发布新版本 ${nextVersionId}` : `保存配置 (${nextVersionId})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
