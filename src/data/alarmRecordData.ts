import { AlarmEventRecord } from '@/src/types/alarmRecord';

export const INITIAL_ALARM_RECORDS: AlarmEventRecord[] = [
  // ====================== 1. 实时告警 (包含加班无安全员缺岗告警) ======================
  {
    id: 'ALM-OT-20260807-15',
    policyId: 10,
    policyName: '加班施工无安全岗位人员在岗告警',
    policyVersion: 'V1',
    policyType: '安全岗位缺岗',
    projectType: 'shipbuilding',
    projectName: '185-4 / 517-2 (03.923.933分段框架拼装)',
    isRealtime: true,
    conditionDesc: '加班时段 17:00-20:30 施工人数18人，无在岗安全员监护',
    currentValue: '安全岗位人员: 缺岗未在场',
    thresholdValue: '安全岗位人员在岗率 = 100%',
    unit: '状态',
    areaType: '造船台/船坞 · 施工区域',
    areaName: '16T前 · 内场/10T前/5#轨 (明烨)',
    areaConditions: [
      { type: '造船台/船坞', relation: '是', target: '内场/10T前/5#轨' }
    ],
    targetPerson: '莫济生',
    personId: 'OT-15',
    personRole: '加班施工负责人',
    personDept: '制造部 · 明烨施工队',
    personConditions: [
      { scope: '工种类别', relation: '是', target: '施工班长/填报人' }
    ],
    initialLevel: '高',
    currentLevel: '高',
    currentNotifyTarget: '制造部安全主任 & 调度中心',
    upgradeStatus: 'upgrading',
    upgradeCountdownSeconds: 120,
    upgradePlans: [
      {
        level: '高',
        target: '当班区域安全主管 & 应急指挥中心',
        countdown: '最高级别',
        status: 'active',
        triggeredAt: '2026-08-07 17:15:00'
      }
    ],
    notifyWays: ['声光报警通知', '发送短信通知'],
    soundLightStatus: 'active',
    smsNoticeCount: 2,
    repeatInterval: '重复告警',
    effectivePeriod: '永久',
    triggerTime: '2026-08-07 17:15:00',
    durationStr: '已持续 45分钟',
    processStatus: 'pending',
    handler: '待派遣安全员现场补位签到',
    handlerPhone: '18059875608',
    workflowLogs: [
      {
        id: 'step-1',
        stepName: '触发加班安全员缺岗告警',
        operator: '加班管理 & UWB定位智能联动系统',
        role: '自动监管引擎',
        department: '安环保卫部',
        time: '2026-08-07 17:15:00',
        action: '监测到制造部明烨团队18人加班施工，现场定位标签无持证安全员在线',
        comment: '已自动推送短信告警至制造部安全主任及现场填报人莫济生(18059875608)',
        status: 'completed'
      }
    ]
  },
  {
    id: 'ALM-OT-20260807-20',
    policyId: 10,
    policyName: '特种作业加班无安全监护人告警',
    policyVersion: 'V1',
    policyType: '安全岗位缺岗',
    projectType: 'shipbuilding',
    projectName: '18500-4 (打磨装配与管路定位)',
    isRealtime: true,
    conditionDesc: '一级动火/密闭空间加班作业，未检测到持证安全员定位',
    currentValue: '一级动火 + 密闭空间 (安全监护人: 缺失)',
    thresholdValue: '双人监护 + 专职安全员在场',
    unit: '状态',
    areaType: '密闭舱室 · 堆场5号轨',
    areaName: '堆场, 5号轨 (大连)',
    areaConditions: [
      { type: '密闭液货舱室', relation: '是', target: '5号轨密闭区域' }
    ],
    targetPerson: '白太良',
    personId: 'OT-20',
    personRole: '高危作业班长',
    personDept: '制造部 · 大连施工队',
    personConditions: [
      { scope: '工种类别', relation: '是', target: '特种作业人' }
    ],
    initialLevel: '高',
    currentLevel: '高',
    currentNotifyTarget: '厂级安全总监',
    upgradeStatus: 'upgrading',
    upgradeCountdownSeconds: 60,
    upgradePlans: [
      {
        level: '高',
        target: '厂级安全总监与应急指挥中心',
        countdown: '最高级别',
        status: 'active',
        triggeredAt: '2026-08-07 17:20:00'
      }
    ],
    notifyWays: ['声光报警通知', '发送短信通知'],
    soundLightStatus: 'active',
    smsNoticeCount: 3,
    repeatInterval: '重复告警',
    effectivePeriod: '永久',
    triggerTime: '2026-08-07 17:20:00',
    durationStr: '已持续 40分钟',
    processStatus: 'pending',
    handler: '待安全巡查员到场核验',
    handlerPhone: '18030272887',
    workflowLogs: [
      {
        id: 'step-1',
        stepName: '触发高危加班无监护告警',
        operator: '加班系统 & 告警管理引擎',
        role: '自动监管引擎',
        department: '质安环保部',
        time: '2026-08-07 17:20:00',
        action: '监测到一级动火+密闭空间高危加班，现场无安全员卡号在线，高危警报启动',
        status: 'completed'
      }
    ]
  },
  {
    id: 'ALM-20260906-001',
    policyId: 1,
    policyName: '1号船台密闭舱气体浓度多级告警',
    policyVersion: 'V2',
    policyType: '气体告警',
    projectType: 'shipbuilding',
    projectName: '17.4万方超大型LNG船 (H1821A)',
    deviceName: '防爆型固定式可燃气体探测仪',
    deviceCode: 'GT-G04-A',
    deviceType: '在线物联网传感探头',
    isRealtime: true,
    conditionDesc: '可燃气体超标浓度 > 15 ppm 持续3分钟',
    currentValue: '19.4 ppm (高出阈值 29%)',
    thresholdValue: '15.0 ppm',
    unit: 'ppm',
    areaType: '造船台/船坞 · 密闭液货舱室',
    areaName: '1号造船台 · 1#液货舱底舱隔舱',
    areaConditions: [
      { type: '造船台/船坞', relation: '是', target: '1号造船台' },
      { type: '密闭液货舱室', relation: '是', target: '1#液货舱' }
    ],
    targetPerson: '张伟',
    personId: 'EMP-015',
    personRole: '特种焊接工',
    personDept: '结构建造三队 · 焊接一组',
    personConditions: [
      { scope: '工种类别', relation: '是', target: '焊接工' },
      { scope: '工种类别', relation: '是', target: '装配钳工' }
    ],
    initialLevel: '低',
    currentLevel: '中',
    currentNotifyTarget: '车间安全主任-林峰',
    upgradeStatus: 'upgrading',
    upgradeCountdownSeconds: 168,
    upgradePlans: [
      {
        level: '低',
        target: '当班区域安全员 (陈建国)',
        countdown: '3分钟',
        status: 'passed',
        triggeredAt: '2026-09-06 20:38:12'
      },
      {
        level: '中',
        target: '车间安全主任 (林峰)',
        countdown: '5分钟',
        status: 'active',
        triggeredAt: '2026-09-06 20:41:12'
      },
      {
        level: '高',
        target: '厂级安全总监与应急指挥中心',
        countdown: '最高级别无需升级',
        status: 'pending'
      }
    ],
    notifyWays: ['声光报警通知', '发送短信通知'],
    soundLightStatus: 'active',
    smsNoticeCount: 2,
    repeatInterval: '重复告警',
    effectivePeriod: '永久',
    triggerTime: '2026-09-06 20:38:12',
    durationStr: '已持续 13分钟',
    processStatus: 'pending',
    handler: '待安全员接单签收',
    handlerPhone: '139-8821-9901',
    workflowLogs: [
      {
        id: 'step-1',
        stepName: '触发多级告警',
        operator: '气体智能传感网-Node-G04',
        role: '在线物联网传感设备',
        department: '安全监测中心',
        time: '2026-09-06 20:38:12',
        action: '监测到1#液货舱可燃气体浓度升至 16.2 ppm (超过阈值 15 ppm)',
        comment: '已触发低级告警，启动现场声光警报器，自动推送短信至当班安全员',
        status: 'completed'
      }
    ]
  }
];

const ALARM_STORAGE_KEY = 'shipyard_alarm_records_v1';

export function getStoredAlarmRecords(): AlarmEventRecord[] {
  try {
    const saved = localStorage.getItem(ALARM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load alarm records from localStorage', e);
  }
  return INITIAL_ALARM_RECORDS;
}

export function saveStoredAlarmRecords(records: AlarmEventRecord[]): void {
  try {
    localStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent('alarm_records_updated', { detail: { records } }));
  } catch (e) {
    console.error('Failed to save alarm records to localStorage', e);
  }
}

/**
 * 联动更新/同步加班单的安全员缺岗告警到告警管理中心
 */
export function syncOvertimeAlarmToRecords(
  overtimeId: string,
  overtimeInfo: {
    shipNo: string;
    workArea: string;
    contractor: string;
    projectName: string;
    timeRange: string;
    workerCount: number;
    reporter: string;
    reporterPhone: string;
    safetyOfficer: string;
    safetyOfficerPhone?: string;
    safetyStatus: 'present' | 'absent' | 'unassigned';
    isHotWork: boolean;
    isConfinedSpace: boolean;
  }
): void {
  const alarmId = `ALM-OT-20260807-${overtimeId}`;
  const allAlarms = getStoredAlarmRecords();
  const existingIndex = allAlarms.findIndex(a => a.id === alarmId);

  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (overtimeInfo.safetyStatus === 'absent' || overtimeInfo.safetyStatus === 'unassigned') {
    const isHighRisk = overtimeInfo.isHotWork || overtimeInfo.isConfinedSpace;
    const policyTitle = isHighRisk 
      ? '特种作业加班无安全监护人告警' 
      : '加班施工无安全岗位人员在岗告警';

    const newAlarmRecord: AlarmEventRecord = {
      id: alarmId,
      policyId: 10,
      policyName: policyTitle,
      policyVersion: 'V1',
      policyType: '安全岗位缺岗',
      projectType: 'shipbuilding',
      projectName: `${overtimeInfo.shipNo} (${overtimeInfo.projectName})`,
      isRealtime: true,
      conditionDesc: `加班时间 ${overtimeInfo.timeRange}，施工人数${overtimeInfo.workerCount}人，安全岗位人员(${overtimeInfo.safetyOfficer || '缺失'})未在线在岗`,
      currentValue: `安全岗位人员状态: ${overtimeInfo.safetyStatus === 'absent' ? '缺岗未在场' : '未配备'}`,
      thresholdValue: '安全岗位人员在岗率 = 100%',
      unit: '状态',
      areaType: '造船台/船坞 · 施工区域',
      areaName: `${overtimeInfo.workArea} (${overtimeInfo.contractor})`,
      areaConditions: [
        { type: '造船台/船坞', relation: '是', target: overtimeInfo.workArea }
      ],
      targetPerson: overtimeInfo.reporter,
      personId: `OT-${overtimeId}`,
      personRole: '加班负责人',
      personDept: overtimeInfo.contractor,
      personConditions: [
        { scope: '工种类别', relation: '是', target: '施工负责人' }
      ],
      initialLevel: isHighRisk ? '高' : '中',
      currentLevel: isHighRisk ? '高' : '中',
      currentNotifyTarget: '当班区域安全主管 & 应急指挥中心',
      upgradeStatus: 'upgrading',
      upgradeCountdownSeconds: 120,
      upgradePlans: [
        {
          level: isHighRisk ? '高' : '中',
          target: '当班区域安全主管 & 应急指挥中心',
          countdown: '最高级别',
          status: 'active',
          triggeredAt: nowStr
        }
      ],
      notifyWays: ['声光报警通知', '发送短信通知'],
      soundLightStatus: 'active',
      smsNoticeCount: 1,
      repeatInterval: '重复告警',
      effectivePeriod: '永久',
      triggerTime: nowStr,
      durationStr: '刚刚触发',
      processStatus: 'pending',
      handler: '待安全员到位补卡',
      handlerPhone: overtimeInfo.reporterPhone,
      workflowLogs: [
        {
          id: `step-${Date.now()}`,
          stepName: '加班无安全员自动告警',
          operator: '加班系统与告警管理联动引擎',
          role: '自动感知系统',
          department: '安环保卫部',
          time: nowStr,
          action: `自动监测到【${overtimeInfo.shipNo}】加班现场未匹配到在岗安全员（当前设定: ${overtimeInfo.safetyOfficer}），已联动上报至告警管理中心`,
          status: 'completed'
        }
      ]
    };

    if (existingIndex >= 0) {
      allAlarms[existingIndex] = { ...allAlarms[existingIndex], ...newAlarmRecord, isRealtime: true, processStatus: 'pending' };
    } else {
      allAlarms.unshift(newAlarmRecord);
    }
  } else {
    // 安全员在岗 present -> 如果原来有告警，标记为已恢复/已闭环
    if (existingIndex >= 0) {
      allAlarms[existingIndex] = {
        ...allAlarms[existingIndex],
        isRealtime: false,
        processStatus: 'closed',
        resolvedTime: nowStr,
        closedTime: nowStr,
        currentValue: `安全岗位人员已在岗: ${overtimeInfo.safetyOfficer}`,
        workflowLogs: [
          ...allAlarms[existingIndex].workflowLogs,
          {
            id: `step-${Date.now()}`,
            stepName: '安全岗位核销到岗',
            operator: overtimeInfo.safetyOfficer || '安全员',
            role: '安全工程师',
            department: '安环保卫部',
            time: nowStr,
            action: `安全岗位人员【${overtimeInfo.safetyOfficer}】已成功在岗到位打卡，告警联动解除自动归档`,
            status: 'completed'
          }
        ]
      };
    }
  }

  saveStoredAlarmRecords(allAlarms);
}
