/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 智慧船厂 - 作业面管理：新增 / 编辑作业面表单模态框
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  ShieldAlert, 
  ShieldCheck,
  Cpu, 
  FileText, 
  Users, 
  Radio, 
  Flame, 
  Video, 
  Bell, 
  Plus, 
  Trash2,
  Check,
  AlertCircle,
  Building2,
  MapPin,
  Compass,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  PenTool,
  ChevronDown,
  Box
} from 'lucide-react';
import { 
  WorkfaceRecord, 
  WorkfaceBaseStation, 
  WorkfaceGasDetector, 
  WorkfaceCamera, 
  WorkfaceAlarmDevice,
  WorkfaceBelongingType,
  WorkfaceFence,
  WorkfaceAreaDefinition,
  SafetyOfficerItem,
  SHIPYARD_SAFETY_OFFICERS,
  SOUTHEAST_SHIPYARD_ZONES,
  PROJECT_FLOOR_OPTIONS
} from '@/src/data/workfaceData';
import { MOCK_PROJECTS } from '@/src/data/mockProjects';
import { MODEL_LAYER_OPTIONS } from '@/src/components/views/DeviceManagement';
import { WorkfaceFenceDrawer } from './WorkfaceFenceDrawer';
import { Workface3DSpatialDrawModal } from './Workface3DSpatialDrawModal';
import { SafetyOfficerSelect } from './SafetyOfficerSelect';

interface WorkfaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: WorkfaceRecord) => void;
  initialData?: WorkfaceRecord | null;
}

// 候选主基站库 (定位主基站必选项)
const CANDIDATE_BASE_STATIONS = [
  { id: 'BS-LNG-01', name: '1#液货舱主基站', code: 'DEV-BS-05', type: '主基站 (防爆UWB)', status: 'online' as const, ip: '192.168.10.21', coverage: '35m半径' },
  { id: 'BS-LNG-02', name: 'LNG艉部合拢主基站', code: 'DEV-BS-07', type: '主基站 (超宽带)', status: 'online' as const, ip: '192.168.10.22', coverage: '25m半径' },
  { id: 'BS-BOX-01', name: '10#箱位导轨主基站', code: 'DEV-BS-08', type: '主基站 (超宽带)', status: 'online' as const, ip: '192.168.10.31', coverage: '40m半径' },
  { id: 'BS-ENG-01', name: '机舱作业面主基站', code: 'LNG-BS-W02', type: '主基站 (防爆UWB)', status: 'online' as const, ip: '192.168.10.23', coverage: '30m半径' },
  { id: 'BS-PCTC-01', name: '滚装跳板作业面主基站', code: 'PCTC-BS-W01', type: '主基站 (工业级)', status: 'online' as const, ip: '192.168.10.45', coverage: '30m半径' },
  { id: 'BS-BULK-01', name: '1#大舱舷梯口主基站', code: 'BULK-BS-W01', type: '主基站 (防爆UWB)', status: 'online' as const, ip: '192.168.10.51', coverage: '25m半径' },
  { id: 'BS-WIND-01', name: '桩腿高空作业面主基站', code: 'WIND-BS-W01', type: '主基站 (高空专用)', status: 'online' as const, ip: '192.168.10.61', coverage: '30m半径' },
  { id: 'BS-SUP-01', name: '驾驶台通导主基站', code: 'DEV-BS-09', type: '主基站 (高精度)', status: 'online' as const, ip: '192.168.10.72', coverage: '25m半径' },
  { id: 'BS-CRANE-01', name: '龙门吊G-01主基站', code: 'DEV-BS-02', type: '主基站 (露天重载)', status: 'online' as const, ip: '192.168.10.15', coverage: '50m半径' }
];

// 候选环境检测设备库 (按需开启)
const CANDIDATE_GAS_DETECTORS = [
  { id: 'GAS-01', sn: 'GAS-LNG-101', name: '1#液货舱防爆四合一环境检测仪', status: 'online' as const, readings: { o2: '20.9%', ch4: '0% LEL', co: '4 ppm', h2s: '0.0 ppm' }, lastUpdate: '刚刚' },
  { id: 'GAS-02', sn: 'GAS-LNG-102', name: '底板汇流排移动式环境检测探头', status: 'online' as const, readings: { o2: '20.8%', ch4: '2% LEL', co: '6 ppm', h2s: '0.1 ppm' }, lastUpdate: '刚刚' },
  { id: 'GAS-03', sn: 'GAS-BOX-201', name: '10#箱位固定式环境检测仪', status: 'online' as const, readings: { o2: '20.9%', ch4: '0% LEL', co: '2 ppm', h2s: '0.0 ppm' }, lastUpdate: '刚刚' },
  { id: 'GAS-04', sn: 'GAS-ENG-101', name: '机舱双燃料低位气体环境探头', status: 'online' as const, readings: { o2: '20.7%', ch4: '1% LEL', co: '5 ppm', h2s: '0.0 ppm' }, lastUpdate: '刚刚' },
  { id: 'GAS-05', sn: 'GAS-BLK-301', name: '双层底压载舱气体环境在线监测仪', status: 'warning' as const, readings: { o2: '19.4%', ch4: '0% LEL', co: '8 ppm', h2s: '0.0 ppm' }, lastUpdate: '刚刚' },
  { id: 'GAS-06', sn: 'GAS-WND-401', name: '桩腿高空防爆环境检测仪', status: 'online' as const, readings: { o2: '20.9%', ch4: '0% LEL', co: '1 ppm', h2s: '0.0 ppm' }, lastUpdate: '刚刚' }
];

const CANDIDATE_CAMERAS = [
  { id: 'CAM-01', name: '1#绝热合拢高点AI防爆球机', type: '防爆云台球机' as const, status: 'online' as const, rtspUrl: 'rtsp://192.168.10.201:554/live/stream1', currentChannel: 'CH-01' },
  { id: 'CAM-02', name: '舱口人员进出识别布控球', type: '防爆布控球' as const, status: 'online' as const, rtspUrl: 'rtsp://192.168.10.202:554/live/stream1', currentChannel: 'CH-02' },
  { id: 'CAM-03', name: '6号船台龙门吊吊运全景球机', type: '防爆云台球机' as const, status: 'online' as const, rtspUrl: 'rtsp://192.168.10.203:554/live/stream1', currentChannel: 'CH-03' },
  { id: 'CAM-04', name: '机舱中层平台监控枪机', type: 'AI抓拍枪机' as const, status: 'online' as const, rtspUrl: 'rtsp://192.168.10.204:554/live/stream1', currentChannel: 'CH-04' },
  { id: 'CAM-05', name: '艉部跳板抓拍AI摄像机', type: 'AI抓拍枪机' as const, status: 'online' as const, rtspUrl: 'rtsp://192.168.10.205:554/live/stream1', currentChannel: 'CH-05' },
  { id: 'CAM-06', name: '舱口防爆监护球机', type: '防爆布控球' as const, status: 'online' as const, rtspUrl: 'rtsp://192.168.10.206:554/live/stream1', currentChannel: 'CH-06' },
  { id: 'CAM-07', name: '风电桩腿高点AI云台摄像机', type: '防爆云台球机' as const, status: 'online' as const, rtspUrl: 'rtsp://192.168.10.207:554/live/stream1', currentChannel: 'CH-07' }
];

const CANDIDATE_ALARMS = [
  { id: 'ALM-DEV-01', name: '1#舱口防爆声光报警器', type: '防爆声光报警器' as const, status: 'online' as const, lastTestTime: '2026-09-28 16:30' },
  { id: 'ALM-DEV-02', name: '导轨架起吊垂直投影声光报警器', type: '防爆声光报警器' as const, status: 'online' as const, lastTestTime: '2026-09-29 09:00' },
  { id: 'ALM-DEV-03', name: '机舱出入口声光报警器', type: '防爆声光报警器' as const, status: 'online' as const, lastTestTime: '2026-09-27 11:20' },
  { id: 'ALM-DEV-04', name: '跳板动载升降警戒声光器', type: '防爆声光报警器' as const, status: 'online' as const, lastTestTime: '2026-09-26 14:00' },
  { id: 'ALM-DEV-05', name: '密闭舱口缺氧联动声光器', type: '防爆声光报警器' as const, status: 'online' as const, lastTestTime: '2026-09-28 10:00' },
  { id: 'ALM-DEV-06', name: '高空防坠失联联动声光器', type: '现场广播喇叭' as const, status: 'online' as const, lastTestTime: '2026-09-25 15:00' }
];

const COMMON_SAFETY_MEASURES = [
  '进入密闭受限空间前强制机械通风30分钟以上',
  '作业全过程开启4合1便携及固定式气体连续在线监测',
  '所有进出人员100%佩戴本安型防爆定位工牌',
  '动火作业需专职安全员现场全时旁站监护',
  '高空作业严格佩戴五点双大钩安全带并双钩互锁挂扣',
  '起吊作业垂直投影下方严禁任何人员滞留 (联动声光告警)',
  '作业区域外围设置电子围栏并专设应急呼叫喇叭'
];

export function WorkfaceFormModal({ isOpen, onClose, onSave, initialData }: WorkfaceFormModalProps) {
  // 表单活动标签页
  const [activeTab, setActiveTab] = useState<'basic' | 'personnel' | 'safety'>('basic');
  
  // 表单状态定义
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  
  // 归属区域类型: 船厂厂区 | 造船项目
  const [belongingType, setBelongingType] = useState<WorkfaceBelongingType>('yard');
  
  // 1. 厂区二级联动状态 (东南造船基地平面图)
  const [yardZoneId, setYardZoneId] = useState<string>(SOUTHEAST_SHIPYARD_ZONES[0].id);
  const [yardSubAreaId, setYardSubAreaId] = useState<string>(SOUTHEAST_SHIPYARD_ZONES[0].subAreas[0].id);

  // 2. 造船项目及二级楼层联动状态
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [shipCode, setShipCode] = useState('');
  const [dockingArea, setDockingArea] = useState('');
  const [modelLevel, setModelLevel] = useState<'deck' | 'middle' | 'bottom' | 'engine' | 'bridge'>('middle');
  const [elevation, setElevation] = useState('');
  
  const [workType, setWorkType] = useState<WorkfaceRecord['workType']>('合拢焊接');
  const [riskLevel, setRiskLevel] = useState<WorkfaceRecord['riskLevel']>('重大风险(红)');
  const [status, setStatus] = useState<WorkfaceRecord['status']>('active');

  // 作业面区域划定数据状态 (不叫电子围栏，是作业面区域划定)
  const [areaDemarcationType, setAreaDemarcationType] = useState<string>('作业区');
  const [areaDemarcationShape, setAreaDemarcationShape] = useState<string>('矩形');
  const [areaDemarcationColor, setAreaDemarcationColor] = useState<string>('#3b82f6');
  const [drawnCoordinatesText, setDrawnCoordinatesText] = useState<string>('[25.4, 25.8  58.2, 25.8  58.2, 68.4  25.4, 68.4]');
  const [is3DModalOpen, setIs3DModalOpen] = useState<boolean>(false);
  const [isAddStationOpen, setIsAddStationOpen] = useState<boolean>(false);
  const [stationSearchQuery, setStationSearchQuery] = useState<string>('');

  // 空间多边形/矩形坐标数据
  const [fence, setFence] = useState<WorkfaceFence>({
    type: 'rectangle',
    points: [
      { x: 18, y: 20 },
      { x: 82, y: 20 },
      { x: 82, y: 76 },
      { x: 18, y: 76 }
    ],
    area: '3,630 ㎡',
    perimeter: '302 m',
    status: 'active'
  });

  // 三维空间区域划定保存回调
  const handle3DSpatialSave = (result: {
    coordinatesText: string;
    points: { x: number; y: number }[];
    coveredBaseStationIds: string[];
    areaSize: string;
    perimeter: string;
  }) => {
    setDrawnCoordinatesText(result.coordinatesText);
    setFence({
      type: areaDemarcationShape === '矩形' ? 'rectangle' : 'polygon',
      points: result.points,
      area: result.areaSize,
      perimeter: result.perimeter,
      status: 'active'
    });
    // 空间框选识别出基站设备后自动合并关联
    if (result.coveredBaseStationIds && result.coveredBaseStationIds.length > 0) {
      setSelectedBaseStationIds(prev => Array.from(new Set([...prev, ...result.coveredBaseStationIds])));
    }
  };

  // 人员与安全责任 (支持设定多个责任安全员)
  const [selectedOfficers, setSelectedOfficers] = useState<SafetyOfficerItem[]>([
    SHIPYARD_SAFETY_OFFICERS[0]
  ]);
  const [safetyOfficer, setSafetyOfficer] = useState('周卫国');
  const [safetyOfficerPhone, setSafetyOfficerPhone] = useState('13812345601');
  const [teamName, setTeamName] = useState('船体二分厂-绝热结构合拢班');
  const [teamLeader, setTeamLeader] = useState('赵宏');
  const [teamLeaderPhone, setTeamLeaderPhone] = useState('13955667788');
  const [capacityLimit, setCapacityLimit] = useState(12);

  // 计划与时段
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [dailyWorkHours, setDailyWorkHours] = useState('08:00 - 20:30');

  // 绑定设备 (主基站必选，其余三类设备按需开启)
  const [selectedBaseStationIds, setSelectedBaseStationIds] = useState<string[]>(['BS-LNG-01']);
  const [enableGasDetectors, setEnableGasDetectors] = useState<boolean>(false);
  const [selectedGasDetectorIds, setSelectedGasDetectorIds] = useState<string[]>([]);
  const [enableCameras, setEnableCameras] = useState<boolean>(false);
  const [selectedCameraIds, setSelectedCameraIds] = useState<string[]>([]);
  const [enableAlarms, setEnableAlarms] = useState<boolean>(false);
  const [selectedAlarmIds, setSelectedAlarmIds] = useState<string[]>([]);

  // 安全防范与说明
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([]);
  const [customMeasureInput, setCustomMeasureInput] = useState('');
  const [description, setDescription] = useState('');

  // 错误提示
  const [errorMsg, setErrorMsg] = useState('');

  // 辅助获取当前选中的厂区区域与工位
  const currentYardZone = SOUTHEAST_SHIPYARD_ZONES.find(z => z.id === yardZoneId) || SOUTHEAST_SHIPYARD_ZONES[0];
  const currentYardSubArea = currentYardZone.subAreas.find(s => s.id === yardSubAreaId) || currentYardZone.subAreas[0];

  // 初始化填充数据
  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setName(initialData.name);
      setBelongingType(initialData.belongingType || (initialData.yardZoneId ? 'yard' : 'project'));
      setYardZoneId(initialData.yardZoneId || SOUTHEAST_SHIPYARD_ZONES[0].id);
      setYardSubAreaId(initialData.yardSubAreaId || SOUTHEAST_SHIPYARD_ZONES[0].subAreas[0].id);
      
      setProjectId(initialData.projectId || (MOCK_PROJECTS[0]?.id || ''));
      setProjectName(initialData.projectName || (MOCK_PROJECTS[0]?.name || ''));
      setShipCode(initialData.shipCode || '');
      setDockingArea(initialData.dockingArea || '');
      setModelLevel(initialData.modelLevel || 'middle');
      setElevation(initialData.elevation || '');
      setWorkType(initialData.workType);
      setRiskLevel(initialData.riskLevel);
      setStatus(initialData.status);

      // 安全员解析与回填 (支持多安全员)
      if (initialData.safetyOfficers && initialData.safetyOfficers.length > 0) {
        setSelectedOfficers(initialData.safetyOfficers);
      } else if (initialData.safetyOfficer) {
        const names = initialData.safetyOfficer.split(/[、,，\s]+/).filter(Boolean);
        const matched = names.map(n => {
          const found = SHIPYARD_SAFETY_OFFICERS.find(o => o.name === n);
          return found || {
            id: `SO-${n}`,
            name: n,
            phone: initialData.safetyOfficerPhone || '13812345601',
            department: '造船工程安监科',
            role: '专职安全员',
            certNumber: 'SA-2024-DEF'
          };
        });
        setSelectedOfficers(matched.length > 0 ? matched : [SHIPYARD_SAFETY_OFFICERS[0]]);
      } else {
        setSelectedOfficers([SHIPYARD_SAFETY_OFFICERS[0]]);
      }

      // 作业面区域划定与三维坐标回填
      if (initialData.areaDefinition) {
        setAreaDemarcationType(initialData.areaDefinition.areaType || '作业区');
        setAreaDemarcationShape(initialData.areaDefinition.areaShape || '矩形');
        setAreaDemarcationColor(initialData.areaDefinition.areaColor || '#3b82f6');
        setDrawnCoordinatesText(
          initialData.areaDefinition.coordinatesText || 
          (initialData.fence?.points?.length 
            ? `[${initialData.fence.points.map(p => `${p.x.toFixed(1)}, ${p.y.toFixed(1)}`).join('  ')}]` 
            : '[25.4, 25.8  58.2, 25.8  58.2, 68.4  25.4, 68.4]')
        );
      } else if (initialData.fence?.points?.length) {
        setDrawnCoordinatesText(`[${initialData.fence.points.map(p => `${p.x.toFixed(1)}, ${p.y.toFixed(1)}`).join('  ')}]`);
      } else {
        setDrawnCoordinatesText('[25.4, 25.8  58.2, 25.8  58.2, 68.4  25.4, 68.4]');
      }

      if (initialData.fence) {
        setFence(initialData.fence);
      } else {
        setFence({
          type: 'rectangle',
          points: [
            { x: 18, y: 20 },
            { x: 82, y: 20 },
            { x: 82, y: 76 },
            { x: 18, y: 76 }
          ],
          area: '3,630 ㎡',
          perimeter: '302 m',
          status: 'active'
        });
      }

      setSafetyOfficer(initialData.safetyOfficer);
      setSafetyOfficerPhone(initialData.safetyOfficerPhone);
      setTeamName(initialData.teamName);
      setTeamLeader(initialData.teamLeader);
      setTeamLeaderPhone(initialData.teamLeaderPhone);
      setCapacityLimit(initialData.capacityLimit);

      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setDailyWorkHours(initialData.dailyWorkHours);

      // 设备回填与按需开启判定
      const bsIds = initialData.boundBaseStations?.map(b => b.id) || [];
      setSelectedBaseStationIds(bsIds.length > 0 ? bsIds : ['BS-LNG-01']);

      const gasIds = initialData.boundGasDetectors?.map(g => g.id) || [];
      setSelectedGasDetectorIds(gasIds);
      setEnableGasDetectors(gasIds.length > 0);

      const camIds = initialData.boundCameras?.map(c => c.id) || [];
      setSelectedCameraIds(camIds);
      setEnableCameras(camIds.length > 0);

      const almIds = initialData.boundAlarms?.map(a => a.id) || [];
      setSelectedAlarmIds(almIds);
      setEnableAlarms(almIds.length > 0);

      setSelectedMeasures(initialData.safetyMeasures || []);
      setDescription(initialData.description || '');
    } else {
      // 默认生成编号
      const randomSeq = Math.floor(100 + Math.random() * 900);
      setCode(`WF-AUTO-${randomSeq}`);
      setName('');
      setBelongingType('yard');
      setYardZoneId(SOUTHEAST_SHIPYARD_ZONES[0].id);
      setYardSubAreaId(SOUTHEAST_SHIPYARD_ZONES[0].subAreas[0].id);
      
      if (MOCK_PROJECTS.length > 0) {
        const first = MOCK_PROJECTS[0];
        setProjectId(first.id);
        setProjectName(first.name);
        setShipCode(first.shipCode || 'HULL-LNG-174');
        setDockingArea(first.dockingArea || '东南造船厂 1号造船台');
      }
      setModelLevel('middle');
      setElevation('+8.0m ~ +16.0m (中舱货油/货舱层)');
      setWorkType('合拢焊接');
      setRiskLevel('重大风险(红)');
      setStatus('active');
      setSelectedOfficers([SHIPYARD_SAFETY_OFFICERS[0]]);
      setSafetyOfficer(SHIPYARD_SAFETY_OFFICERS[0].name);
      setSafetyOfficerPhone(SHIPYARD_SAFETY_OFFICERS[0].phone);
      setTeamName('总装分厂-分段总组一班');
      setTeamLeader('陈志强');
      setTeamLeaderPhone('13959012302');
      setCapacityLimit(15);
      setStartDate('2026-10-01');
      setEndDate('2026-12-31');
      setDailyWorkHours('08:00 - 20:30');
      
      // 主基站必选：默认选中1台，其余三类设备默认不开启
      setSelectedBaseStationIds(['BS-LNG-01']);
      setEnableGasDetectors(false);
      setSelectedGasDetectorIds([]);
      setEnableCameras(false);
      setSelectedCameraIds([]);
      setEnableAlarms(false);
      setSelectedAlarmIds([]);
      
      // 作业面区域划定默认参数
      setAreaDemarcationType('作业区');
      setAreaDemarcationShape('矩形');
      setAreaDemarcationColor('#3b82f6');
      setDrawnCoordinatesText('[25.4, 25.8  58.2, 25.8  58.2, 68.4  25.4, 68.4]');
      setIsAddStationOpen(false);
      
      setFence({
        type: 'rectangle',
        points: [
          { x: 18, y: 20 },
          { x: 82, y: 20 },
          { x: 82, y: 76 },
          { x: 18, y: 76 }
        ],
        area: '3,630 ㎡',
        perimeter: '302 m',
        status: 'active'
      });

      setSelectedMeasures(COMMON_SAFETY_MEASURES.slice(0, 4));
      setDescription('');
    }
    setErrorMsg('');
    setActiveTab('basic');
  }, [initialData, isOpen]);

  // 厂区一级区域切换联动
  const handleYardZoneChange = (zId: string) => {
    setYardZoneId(zId);
    const z = SOUTHEAST_SHIPYARD_ZONES.find(item => item.id === zId);
    if (z && z.subAreas.length > 0) {
      setYardSubAreaId(z.subAreas[0].id);
    }
  };

  // 厂区二级工位切换
  const handleYardSubAreaChange = (subId: string) => {
    setYardSubAreaId(subId);
  };

  // 当选择不同造船项目时，自动联动船体编号和泊位
  const handleProjectChange = (pId: string) => {
    setProjectId(pId);
    const proj = MOCK_PROJECTS.find(p => p.id === pId);
    if (proj) {
      setProjectName(proj.name);
      setShipCode(proj.shipCode || '');
      setDockingArea(proj.dockingArea || '标准船台泊位');
    }
  };

  // 当选择不同二级楼层位置时，自动填充推荐标高范围
  const handleModelLevelChange = (lvl: 'deck' | 'middle' | 'bottom' | 'engine' | 'bridge') => {
    setModelLevel(lvl);
    const floor = PROJECT_FLOOR_OPTIONS.find(l => l.id === lvl);
    if (floor) {
      setElevation(floor.elevation);
    }
  };

  // 添加自定义安全防范措施
  const handleAddCustomMeasure = () => {
    if (!customMeasureInput.trim()) return;
    if (!selectedMeasures.includes(customMeasureInput.trim())) {
      setSelectedMeasures([...selectedMeasures, customMeasureInput.trim()]);
    }
    setCustomMeasureInput('');
  };

  // 提交保存
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('请输入作业面名称');
      setActiveTab('basic');
      return;
    }
    if (!code.trim()) {
      setErrorMsg('请输入作业面编号');
      setActiveTab('basic');
      return;
    }
    if (belongingType === 'yard') {
      if (!yardZoneId || !yardSubAreaId) {
        setErrorMsg('请选择厂区一级分区及二级工位位置');
        setActiveTab('basic');
        return;
      }
    } else {
      if (!projectId) {
        setErrorMsg('请选择所属造船工程项目');
        setActiveTab('basic');
        return;
      }
    }

    // 必填校验：责任安全员 (支持多个)
    if (selectedOfficers.length === 0) {
      setErrorMsg('请至少设定一位责任安全员');
      setActiveTab('personnel');
      return;
    }

    // 必填校验：主基站为必选设备
    if (selectedBaseStationIds.length === 0) {
      setErrorMsg('主基站为必选设备，请至少绑定一台主基站以确保作业面定位覆盖');
      setActiveTab('basic');
      return;
    }

    const boundStations: WorkfaceBaseStation[] = CANDIDATE_BASE_STATIONS
      .filter(bs => selectedBaseStationIds.includes(bs.id))
      .map(bs => ({
        id: bs.id,
        name: bs.name,
        code: bs.code,
        type: bs.type,
        status: bs.status,
        ip: bs.ip,
        coverage: bs.coverage
      }));

    // 环境检测设备 (仅在启用时绑定)
    const boundGases: WorkfaceGasDetector[] = enableGasDetectors
      ? CANDIDATE_GAS_DETECTORS
          .filter(g => selectedGasDetectorIds.includes(g.id))
          .map(g => ({
            id: g.id,
            sn: g.sn,
            name: g.name,
            status: g.status,
            readings: g.readings,
            lastUpdate: '刚刚'
          }))
      : [];

    // AI 监控球机 (仅在启用时绑定)
    const boundCams: WorkfaceCamera[] = enableCameras
      ? CANDIDATE_CAMERAS
          .filter(c => selectedCameraIds.includes(c.id))
          .map(c => ({
            id: c.id,
            name: c.name,
            type: c.type,
            status: c.status,
            rtspUrl: c.rtspUrl,
            currentChannel: c.currentChannel
          }))
      : [];

    // 防爆声光报警器 (仅在启用时绑定)
    const boundAlms: WorkfaceAlarmDevice[] = enableAlarms
      ? CANDIDATE_ALARMS
          .filter(a => selectedAlarmIds.includes(a.id))
          .map(a => ({
            id: a.id,
            name: a.name,
            type: a.type,
            status: a.status,
            lastTestTime: a.lastTestTime
          }))
      : [];

    const floorObj = PROJECT_FLOOR_OPTIONS.find(l => l.id === modelLevel);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const officerNames = selectedOfficers.map(o => o.name).join('、');
    const officerPhones = selectedOfficers.map(o => o.phone).filter(Boolean).join(', ');

    const recordToSave: WorkfaceRecord = {
      id: initialData ? initialData.id : `WF-${Date.now().toString().slice(-6)}`,
      code: code.trim(),
      name: name.trim(),
      belongingType,
      
      // 厂区专属字段
      yardZoneId: belongingType === 'yard' ? yardZoneId : undefined,
      yardZoneName: belongingType === 'yard' ? currentYardZone.name : undefined,
      yardSubAreaId: belongingType === 'yard' ? yardSubAreaId : undefined,
      yardSubAreaName: belongingType === 'yard' ? currentYardSubArea.name : undefined,
      yardSpecs: belongingType === 'yard' ? currentYardSubArea.specs : undefined,
      
      // 项目专属字段与兜底
      projectId: belongingType === 'project' ? projectId : 'SEC-YARD',
      projectName: belongingType === 'project' ? projectName : '东南造船基地',
      shipCode: belongingType === 'project' ? shipCode : '',
      dockingArea: belongingType === 'project' ? (dockingArea || '标准船台泊位') : currentYardSubArea.name,
      modelLevel: belongingType === 'project' ? modelLevel : 'deck',
      modelLevelName: belongingType === 'project' ? (floorObj ? floorObj.name : '主甲板层') : currentYardSubArea.name,
      elevation: belongingType === 'project' ? (elevation || (floorObj ? floorObj.elevation : '+16.0m ~ +22.0m')) : currentYardSubArea.specs,
      
      // 作业面区域划定与空间范围数据
      areaDefinition: {
        areaType: areaDemarcationType,
        areaColor: areaDemarcationColor,
        areaShape: areaDemarcationShape,
        coordinatesText: drawnCoordinatesText,
        points: fence.points,
        areaSize: fence.area,
        perimeter: fence.perimeter
      },
      fence,

      workType,
      riskLevel,
      status,
      safetyOfficer: officerNames,
      safetyOfficerPhone: officerPhones,
      safetyOfficers: selectedOfficers,
      teamName: teamName.trim(),
      teamLeader: teamLeader.trim(),
      teamLeaderPhone: teamLeaderPhone.trim(),
      capacityLimit: Number(capacityLimit) || 10,
      currentPersonnelCount: initialData ? initialData.currentPersonnelCount : (status === 'active' ? 4 : 0),
      currentPersonnel: initialData ? initialData.currentPersonnel : [],
      boundBaseStations: boundStations,
      boundGasDetectors: boundGases,
      boundCameras: boundCams,
      boundAlarms: boundAlms,
      startDate,
      endDate,
      dailyWorkHours,
      safetyMeasures: selectedMeasures,
      description: description.trim(),
      createdAt: initialData ? initialData.createdAt : nowStr,
      updatedAt: nowStr
    };

    onSave(recordToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {initialData ? `编辑作业面 - ${initialData.name}` : '新增作业面'}
              </h2>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 错误提示 */}
        {errorMsg && (
          <div className="mx-6 mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 步骤 / 选项卡导航 */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'basic' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>基础信息</span>
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
            <span>责任与定员</span>
          </button>


          <button
            type="button"
            onClick={() => setActiveTab('safety')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'safety' 
                ? 'border-blue-600 text-blue-600 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>安全要求</span>
          </button>
        </div>

        {/* 表单内容区 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: 基础信息 */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 作业面编号 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    作业面编号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="如 WF-LNG-01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                {/* 作业面名称 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    作业面名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="如 1#液货舱绝热合拢作业面"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* 作业面归属区域类型选择 (厂区 / 造船项目) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>作业面归属区域类型 <span className="text-red-500">*</span></span>
                  </label>
                </div>

                {/* 归属类型卡片式单选组 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBelongingType('yard')}
                    className={`px-3.5 py-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      belongingType === 'yard'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      belongingType === 'yard' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>船厂厂区作业面</span>
                        {belongingType === 'yard' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">东南造船基地平面图车间/工位</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBelongingType('project')}
                    className={`px-3.5 py-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      belongingType === 'project'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      belongingType === 'project' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>造船项目作业面</span>
                        {belongingType === 'project' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">在建工程船舶与船体楼层分层</div>
                    </div>
                  </button>
                </div>

                {/* 1. 厂区类型: 东南造船基地平面图二级联动选择 */}
                {belongingType === 'yard' && (
                  <div className="pt-3 border-t border-slate-200 space-y-3 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 一级功能分区 */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          一级：厂区功能分区 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={yardZoneId}
                          onChange={e => handleYardZoneChange(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          {SOUTHEAST_SHIPYARD_ZONES.map(zone => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name} ({zone.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 二级具体位置/工位/车间 */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          二级：具体工位 / 车间 / 平台 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={yardSubAreaId}
                          onChange={e => handleYardSubAreaChange(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          {currentYardZone.subAreas.map(sub => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name} ({sub.specs})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. 项目类型: 造船项目与二级楼层位置选择 */}
                {belongingType === 'project' && (
                  <div className="pt-3 border-t border-slate-200 space-y-3 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 一级：造船项目 */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          一级：所属造船项目 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={projectId}
                          onChange={e => handleProjectChange(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          {MOCK_PROJECTS.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.shipCode || p.id})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 二级：楼层位置选择 */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          二级：船体楼层位置选择 <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={modelLevel}
                          onChange={e => handleModelLevelChange(e.target.value as any)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          {PROJECT_FLOOR_OPTIONS.map(layer => (
                            <option key={layer.id} value={layer.id}>
                              {layer.name} ({layer.code}) - {layer.elevation}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 作业面区域划定 (三维空间划定与关联基站协同) */}
              <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-3.5 shadow-2xs">
                {/* 模块头部 */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                    <span>作业面区域划定</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      三维空间划定
                    </span>
                  </div>
                  {drawnCoordinatesText && (
                    <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>三维空间坐标已就绪</span>
                    </span>
                  )}
                </div>

                {/* 划定表单设置行 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* 划定类型 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      <span className="text-red-500 mr-1">*</span>划定类型
                    </label>
                    <select
                      value={areaDemarcationType}
                      onChange={e => setAreaDemarcationType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="作业区">作业区 (常规连续施工)</option>
                      <option value="受限空间">受限空间 (密闭舱室作业)</option>
                      <option value="特种动火区">特种动火区 (合拢动火焊接)</option>
                      <option value="高空管控区">高空管控区 (高空防坠重点区)</option>
                      <option value="吊装警戒区">吊装警戒区 (龙门吊防碰区域)</option>
                      <option value="重点防护区">重点防护区 (高危管制)</option>
                    </select>
                  </div>

                  {/* 划定形状 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      <span className="text-red-500 mr-1">*</span>划定形状
                    </label>
                    <select
                      value={areaDemarcationShape}
                      onChange={e => setAreaDemarcationShape(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="矩形">标准矩形框选</option>
                      <option value="多边形">多边形轮廓打点</option>
                      <option value="自定义">自定义空间形态</option>
                    </select>
                  </div>

                  {/* 绘制区域操作按钮 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      <span className="text-red-500 mr-1">*</span>绘制区域
                    </label>
                    <button
                      type="button"
                      onClick={() => setIs3DModalOpen(true)}
                      className="w-full px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Box className="w-4 h-4" />
                      <span>{drawnCoordinatesText ? '进入三维页面重新设置' : '点此进入三维页面设置'}</span>
                    </button>
                  </div>
                </div>

                {/* 框选的坐标系信息反馈卡片 */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-slate-700 shrink-0">框选坐标系：</span>
                      <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium truncate max-w-md" title={drawnCoordinatesText}>
                        {drawnCoordinatesText || '[25.4, 25.8  58.2, 25.8  58.2, 68.4  25.4, 68.4]'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* 在些范围内关联的基站设备，支持手动添加及移除功能 */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-bold text-slate-800">范围内关联的基站设备</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-medium border border-blue-200">
                        已关联 {selectedBaseStationIds.length} 台
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddStationOpen(!isAddStationOpen)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddStationOpen ? '收起候选基站' : '手动添加基站'}</span>
                    </button>
                  </div>

                  {/* 手动添加基站候选抽屉 */}
                  {isAddStationOpen && (
                    <div className="p-3 bg-white border border-blue-200 rounded-lg shadow-sm space-y-2.5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={stationSearchQuery}
                            onChange={e => setStationSearchQuery(e.target.value)}
                            placeholder="按基站名称或编号模糊搜索..."
                            className="w-full pl-3 pr-8 py-1.5 border border-slate-300 rounded-md text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          {stationSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setStationSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const filteredIds = CANDIDATE_BASE_STATIONS
                                .filter(bs => bs.name.toLowerCase().includes(stationSearchQuery.toLowerCase()) || bs.code.toLowerCase().includes(stationSearchQuery.toLowerCase()))
                                .map(bs => bs.id);
                              setSelectedBaseStationIds(prev => Array.from(new Set([...prev, ...filteredIds])));
                            }}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-medium rounded border border-blue-200 transition-colors cursor-pointer"
                          >
                            全选
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const filteredIds = CANDIDATE_BASE_STATIONS
                                .filter(bs => bs.name.toLowerCase().includes(stationSearchQuery.toLowerCase()) || bs.code.toLowerCase().includes(stationSearchQuery.toLowerCase()))
                                .map(bs => bs.id);
                              setSelectedBaseStationIds(prev => prev.filter(id => !filteredIds.includes(id)));
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded border border-slate-200 transition-colors cursor-pointer"
                          >
                            取消全选
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                        <span>点击勾选添加主基站到当前作业面：</span>
                        <span className="text-slate-400 font-normal">
                          符合条件 {CANDIDATE_BASE_STATIONS.filter(bs => bs.name.toLowerCase().includes(stationSearchQuery.toLowerCase()) || bs.code.toLowerCase().includes(stationSearchQuery.toLowerCase())).length} / 共 {CANDIDATE_BASE_STATIONS.length} 台
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                        {CANDIDATE_BASE_STATIONS
                          .filter(bs => bs.name.toLowerCase().includes(stationSearchQuery.toLowerCase()) || bs.code.toLowerCase().includes(stationSearchQuery.toLowerCase()))
                          .map(bs => {
                            const isSelected = selectedBaseStationIds.includes(bs.id);
                            return (
                              <div
                                key={bs.id}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedBaseStationIds(selectedBaseStationIds.filter(id => id !== bs.id));
                                  } else {
                                    setSelectedBaseStationIds([...selectedBaseStationIds, bs.id]);
                                  }
                                }}
                                className={`p-2 rounded-md border text-xs cursor-pointer flex items-center justify-between transition-all ${
                                  isSelected 
                                    ? 'bg-blue-50/90 border-blue-400 text-blue-900 font-medium shadow-2xs' 
                                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
                                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                                  }`}>
                                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                  <span className="font-mono text-slate-500 text-[11px]">{bs.code}</span>
                                  <span className="truncate">{bs.name}</span>
                                </div>
                              </div>
                            );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 关联基站列表：显示编号和名称，支持手动移除 */}
                  {selectedBaseStationIds.length === 0 ? (
                    <div className="p-3 text-center bg-white border border-dashed border-slate-300 rounded-lg text-slate-400 text-xs">
                      当前划定范围内未关联主基站，请点击右上角「手动添加基站」或在三维页面中框选
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {selectedBaseStationIds.map(bsId => {
                        const bs = CANDIDATE_BASE_STATIONS.find(b => b.id === bsId) || {
                          id: bsId,
                          name: bsId,
                          code: bsId
                        };
                        return (
                          <div
                            key={bsId}
                            className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs hover:border-blue-200 transition-colors shadow-2xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                              <span className="font-mono font-medium text-slate-500 text-[11px]">{bs.code}</span>
                              <span className="font-medium text-slate-800 truncate">{bs.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBaseStationIds(selectedBaseStationIds.filter(id => id !== bsId));
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer shrink-0 ml-1"
                              title="移除该基站"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 作业类型 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    主要作业类型
                  </label>
                  <select
                    value={workType}
                    onChange={e => setWorkType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="合拢焊接">合拢焊接 (特种动火)</option>
                    <option value="密闭舱室作业">密闭舱室作业 (受限空间)</option>
                    <option value="高空涂装">高空涂装 (超高空作业)</option>
                    <option value="管系装配">管系装配 (动力系统)</option>
                    <option value="电气舾装">电气舾装 (通导/动力柜)</option>
                    <option value="探伤质检">探伤质检 (无损探伤NDT)</option>
                    <option value="通用作业">通用作业 (常态施工)</option>
                  </select>
                </div>

                {/* 风险等级 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    风险管控等级
                  </label>
                  <select
                    value={riskLevel}
                    onChange={e => setRiskLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="重大风险(红)">重大风险(红) - 一级管控</option>
                    <option value="较大风险(橙)">较大风险(橙) - 二级管控</option>
                    <option value="一般风险(黄)">一般风险(黄) - 三级管控</option>
                    <option value="低风险(蓝)">低风险(蓝) - 四级常态</option>
                  </select>
                </div>

                {/* 初始运行状态 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    作业面状态
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="active">作业中 (进行实时感知与定位)</option>
                    <option value="paused">暂停中 (设备维持监测/禁止入内)</option>
                    <option value="draft">待作业 (方案编制中)</option>
                    <option value="completed">已完工 (已验收归档)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 责任与定员 */}
          {activeTab === 'personnel' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>责任安全员与施工班组</span>
                </div>

                {/* 责任安全员 (支持设定多个安全员，模糊搜索 + 多选) */}
                <div>
                  <SafetyOfficerSelect
                    selectedOfficers={selectedOfficers}
                    onChange={(officers) => {
                      setSelectedOfficers(officers);
                      if (officers.length > 0) {
                        setSafetyOfficer(officers.map(o => o.name).join('、'));
                        setSafetyOfficerPhone(officers.map(o => o.phone).filter(Boolean).join(', '));
                      } else {
                        setSafetyOfficer('');
                        setSafetyOfficerPhone('');
                      }
                    }}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      施工责任班组
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      placeholder="如 船体二分厂-绝热结构班"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      班组长姓名
                    </label>
                    <input
                      type="text"
                      value={teamLeader}
                      onChange={e => setTeamLeader(e.target.value)}
                      placeholder="如 赵宏"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      班组长电话
                    </label>
                    <input
                      type="text"
                      value={teamLeaderPhone}
                      onChange={e => setTeamLeaderPhone(e.target.value)}
                      placeholder="如 13955667788"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 定员上限与作业周期 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    作业面定员上限 (人) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={capacityLimit}
                    onChange={e => setCapacityLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    施工开工日期
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    预计完工日期
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  每日允许作业时段
                </label>
                <input
                  type="text"
                  value={dailyWorkHours}
                  onChange={e => setDailyWorkHours(e.target.value)}
                  placeholder="如 08:00 - 20:30"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 3: 关联设备 */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              {/* 1. 主基站 (必须选择的设备，常驻展开) */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Radio className="w-4 h-4 text-blue-600" />
                    <span>主基站</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold border border-blue-200">
                      必选项 <span className="text-red-500">*</span>
                    </span>
                  </div>

                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-medium ${
                    selectedBaseStationIds.length > 0 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-red-50 text-red-600 border border-red-200 animate-pulse'
                  }`}>
                    {selectedBaseStationIds.length > 0 ? `已选 ${selectedBaseStationIds.length} 台` : '未选择 (必选)'}
                  </span>
                </div>
                
                {/* 候选列表：仅显示编号和名称 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto p-0.5">
                  {CANDIDATE_BASE_STATIONS.map(bs => {
                    const isChecked = selectedBaseStationIds.includes(bs.id);
                    return (
                      <div
                        key={bs.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedBaseStationIds(selectedBaseStationIds.filter(id => id !== bs.id));
                          } else {
                            setSelectedBaseStationIds([...selectedBaseStationIds, bs.id]);
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          isChecked 
                            ? 'bg-blue-50/90 border-blue-500 text-blue-900 shadow-2xs' 
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-500 text-[11px] font-medium">{bs.code}</span>
                            <span className="font-medium text-slate-800">{bs.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. 环境检测设备 (按需启用) */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>环境检测设备</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      按需启用
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !enableGasDetectors;
                        setEnableGasDetectors(next);
                        if (!next) setSelectedGasDetectorIds([]);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        enableGasDetectors 
                          ? 'bg-amber-500 text-white shadow-2xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${enableGasDetectors ? 'bg-white' : 'bg-slate-400'}`} />
                      <span>{enableGasDetectors ? '已开启' : '未开启 (点击开启)'}</span>
                    </button>
                    {enableGasDetectors && (
                      <span className="text-[11px] text-amber-700 font-mono font-medium">
                        已选 {selectedGasDetectorIds.length} 台
                      </span>
                    )}
                  </div>
                </div>

                {/* 候选列表：仅在开启时展示，只显示编号和名称 */}
                {enableGasDetectors && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-0.5 animate-in fade-in duration-150">
                    {CANDIDATE_GAS_DETECTORS.map(gd => {
                      const isChecked = selectedGasDetectorIds.includes(gd.id);
                      return (
                        <div
                          key={gd.id}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedGasDetectorIds(selectedGasDetectorIds.filter(id => id !== gd.id));
                            } else {
                              setSelectedGasDetectorIds([...selectedGasDetectorIds, gd.id]);
                            }
                          }}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isChecked 
                              ? 'bg-amber-50/90 border-amber-400 text-amber-900 shadow-2xs' 
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                              isChecked ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-500 text-[11px] font-medium">{gd.sn}</span>
                              <span className="font-medium text-slate-800">{gd.name}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. AI 监控球机 (按需启用) */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Video className="w-4 h-4 text-indigo-500" />
                    <span>AI 监控球机</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      按需启用
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !enableCameras;
                        setEnableCameras(next);
                        if (!next) setSelectedCameraIds([]);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        enableCameras 
                          ? 'bg-indigo-600 text-white shadow-2xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${enableCameras ? 'bg-white' : 'bg-slate-400'}`} />
                      <span>{enableCameras ? '已开启' : '未开启 (点击开启)'}</span>
                    </button>
                    {enableCameras && (
                      <span className="text-[11px] text-indigo-700 font-mono font-medium">
                        已选 {selectedCameraIds.length} 台
                      </span>
                    )}
                  </div>
                </div>

                {/* 候选列表：仅在开启时展示，只显示编号和名称 */}
                {enableCameras && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-44 overflow-y-auto p-0.5 animate-in fade-in duration-150">
                    {CANDIDATE_CAMERAS.map(cam => {
                      const isChecked = selectedCameraIds.includes(cam.id);
                      return (
                        <div
                          key={cam.id}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedCameraIds(selectedCameraIds.filter(id => id !== cam.id));
                            } else {
                              setSelectedCameraIds([...selectedCameraIds, cam.id]);
                            }
                          }}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isChecked 
                              ? 'bg-indigo-50/90 border-indigo-400 text-indigo-900 shadow-2xs' 
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                              isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-500 text-[11px] font-medium">{cam.id}</span>
                              <span className="font-medium text-slate-800">{cam.name}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. 防爆声光报警器 (按需启用) */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Bell className="w-4 h-4 text-rose-500" />
                    <span>防爆声光报警器</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      按需启用
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !enableAlarms;
                        setEnableAlarms(next);
                        if (!next) setSelectedAlarmIds([]);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        enableAlarms 
                          ? 'bg-rose-600 text-white shadow-2xs' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${enableAlarms ? 'bg-white' : 'bg-slate-400'}`} />
                      <span>{enableAlarms ? '已开启' : '未开启 (点击开启)'}</span>
                    </button>
                    {enableAlarms && (
                      <span className="text-[11px] text-rose-700 font-mono font-medium">
                        已选 {selectedAlarmIds.length} 台
                      </span>
                    )}
                  </div>
                </div>

                {/* 候选列表：仅在开启时展示，只显示编号和名称 */}
                {enableAlarms && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-44 overflow-y-auto p-0.5 animate-in fade-in duration-150">
                    {CANDIDATE_ALARMS.map(alm => {
                      const isChecked = selectedAlarmIds.includes(alm.id);
                      return (
                        <div
                          key={alm.id}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedAlarmIds(selectedAlarmIds.filter(id => id !== alm.id));
                            } else {
                              setSelectedAlarmIds([...selectedAlarmIds, alm.id]);
                            }
                          }}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isChecked 
                              ? 'bg-rose-50/90 border-rose-400 text-rose-900 shadow-2xs' 
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                              isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-500 text-[11px] font-medium">{alm.id}</span>
                              <span className="font-medium text-slate-800">{alm.name}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: 安全要求 */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  现场安全防范要求
                </label>

                <div className="space-y-2 mb-3">
                  {COMMON_SAFETY_MEASURES.map(measure => {
                    const isChecked = selectedMeasures.includes(measure);
                    return (
                      <div
                        key={measure}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedMeasures(selectedMeasures.filter(m => m !== measure));
                          } else {
                            setSelectedMeasures([...selectedMeasures, measure]);
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                          isChecked 
                            ? 'bg-blue-50/70 border-blue-400 text-blue-900 font-medium' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{measure}</span>
                      </div>
                    );
                  })}
                </div>

                {/* 添加自定义措施 */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customMeasureInput}
                    onChange={e => setCustomMeasureInput(e.target.value)}
                    placeholder="输入其他特殊安全管控措施..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomMeasure();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomMeasure}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加</span>
                  </button>
                </div>
              </div>

              {/* 作业面详细施工工艺与备注 */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  施工工艺与备注说明
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  placeholder="记录施工工法、审批票号、特殊注意事项等..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* 底部按钮栏 */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'safety') setActiveTab('personnel');
                    else if (activeTab === 'personnel') setActiveTab('basic');
                  }}
                  className="text-slate-600 hover:text-slate-900 font-medium mr-3 cursor-pointer"
                >
                  ← 上一步
                </button>
              )}
              {activeTab !== 'safety' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'basic') setActiveTab('personnel');
                    else if (activeTab === 'personnel') setActiveTab('safety');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  下一步 →
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{initialData ? '保存修改' : '确认创建作业面'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 三维空间作业面区域划定设置模态框 */}
      <Workface3DSpatialDrawModal
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
        onSave={handle3DSpatialSave}
        areaType={areaDemarcationType}
        areaColor={areaDemarcationColor}
        areaShape={areaDemarcationShape}
        projectName={belongingType === 'project' ? projectName : undefined}
        zoneName={currentYardZone.name}
        subAreaName={currentYardSubArea.name}
        levelName={belongingType === 'project' ? (PROJECT_FLOOR_OPTIONS.find(l => l.id === modelLevel)?.name || '主甲板层') : undefined}
        elevation={belongingType === 'project' ? (PROJECT_FLOOR_OPTIONS.find(l => l.id === modelLevel)?.elevation || elevation) : '+8.0m ~ +16.0m'}
        candidateBaseStations={CANDIDATE_BASE_STATIONS}
        initialPoints={fence.points}
      />
    </div>
  );
}
