import React, { useState } from 'react';
import { 
  Ship, 
  Anchor, 
  Info, 
  Search, 
  Filter, 
  X, 
  Layers, 
  Box, 
  Cpu, 
  ShieldCheck, 
  Compass, 
  Maximize2,
  CheckCircle2,
  Eye,
  LayoutGrid,
  List,
  Plus,
  Edit3,
  Trash2,
  Settings,
  AlertTriangle
} from 'lucide-react';

// 导入 8 款不同船型的 3D 数字孪生模型渲染图
import lngModelBg from '@/src/assets/images/lng_ship_model_1787972569670.jpg';
import containerModelBg from '@/src/assets/images/container_ship_model_1787972581740.jpg';
import tankerModelBg from '@/src/assets/images/tanker_ship_model_1787972594875.jpg';
import bulkModelBg from '@/src/assets/images/bulk_ship_model_1787972609425.jpg';
import psvModelBg from '@/src/assets/images/psv_3d_model_1787972977692.jpg';
import workboatModelBg from '@/src/assets/images/workboat_3d_model_1787972992279.jpg';
import supportModelBg from '@/src/assets/images/support_3d_model_1787973007774.jpg';
import chemTankerModelBg from '@/src/assets/images/chemical_tanker_3d_1787973019008.jpg';

export interface ShipLayer {
  id: string;
  name: string;
  code: string;
  elevationRange: string;
  description: string;
}

export interface ShipModel {
  id: string;
  name: string;
  type: string;
  shipScale: '大型' | '小型';
  description: string;
  thumbnail: string;
  lodLevel: string;
  meshCount: string;
  compartments: number;
  parameters: {
    loa: string;
    beam: string;
    depth: string;
    draft: string;
    power: string;
    displacement: string;
    speed: string;
  };
  features: string[];
  layers: ShipLayer[];
}

const initialMockShipModels: ShipModel[] = [
  {
    id: 'M-001',
    name: '17.4万m³ 薄膜型大型LNG船',
    type: 'LNG液化天然气船',
    shipScale: '大型',
    description: '采用 GTT NO96 薄膜型绝热货舱系统，具有高安全、低蒸发率的 3D 全舱段高精度数字孪生模型。',
    thumbnail: lngModelBg,
    lodLevel: 'LOD 400 (施工级)',
    meshCount: '1,280,000 面',
    compartments: 4,
    parameters: { 
      loa: '295.0', 
      beam: '45.0', 
      depth: '26.25', 
      draft: '11.5', 
      power: '双燃料低速机+轴带发电机',
      displacement: '118,000 吨',
      speed: '19.5 节'
    },
    features: ['3D 绝热层空间网格', '密闭货舱受限空间定位', '超低温泄漏监测点位'],
    layers: [
      { id: 'L-01', name: '甲板层 (主甲板/露天作业区)', code: 'DECK-01', elevationRange: '+18.5m ~ +26.25m', description: '露天系泊与吊装作业主区域' },
      { id: 'L-02', name: '货舱层 (NO.1-4 LNG货舱)', code: 'HOLD-02', elevationRange: '+2.0m ~ +18.5m', description: 'GTT NO96 绝热薄膜密闭舱段' },
      { id: 'L-03', name: '机舱层 (双燃料主机及辅机)', code: 'ENG-03', elevationRange: '-5.0m ~ +2.0m', description: '动力推进与气体压缩机房' },
      { id: 'L-04', name: '双层底及压载舱', code: 'BALLAST-04', elevationRange: '-12.0m ~ -5.0m', description: '水舱与结构支撑底层' }
    ]
  },
  {
    id: 'M-002',
    name: '24,000 TEU 超大型集装箱船',
    type: '超大型集装箱船',
    shipScale: '大型',
    description: '全球顶级装载量集装箱船 3D 模型，完整包含 24 层集装箱导轨架、系泊甲板及双岛式上层建筑网格。',
    thumbnail: containerModelBg,
    lodLevel: 'LOD 350',
    meshCount: '1,860,000 面',
    compartments: 12,
    parameters: { 
      loa: '399.9', 
      beam: '61.5', 
      depth: '33.2', 
      draft: '16.5', 
      power: 'WinGD 11X92DF 双燃料主机',
      displacement: '240,000 吨',
      speed: '22.0 节'
    },
    features: ['箱位 3D 空间坐标系', '舷边防落水警戒网格', '主机舱多层拓扑'],
    layers: [
      { id: 'L-01', name: '驾驶甲板与生活区', code: 'BRG-01', elevationRange: '+25.0m ~ +33.2m', description: '船长室与导航指挥中心' },
      { id: 'L-02', name: '集装箱绑扎甲板区', code: 'DECK-02', elevationRange: '+12.0m ~ +25.0m', description: '甲板箱位及锁具作业面' },
      { id: 'L-03', name: '货舱内部导轨架层', code: 'HOLD-03', elevationRange: '-5.0m ~ +12.0m', description: '舱内蜂窝状导轨支撑结构' },
      { id: 'L-04', name: '机舱与泵间底层', code: 'ENG-04', elevationRange: '-15.0m ~ -5.0m', description: '超大功率柴油机与推进轴系' }
    ]
  },
  {
    id: 'M-003',
    name: '30万吨 VLCC 超大型原油船',
    type: '超大型油轮 (VLCC)',
    shipScale: '大型',
    description: '双壳双底结构 3D 数字模型，精细刻画 15 个货油舱、双层底压载舱及主甲板复杂管系走线。',
    thumbnail: tankerModelBg,
    lodLevel: 'LOD 400',
    meshCount: '1,450,000 面',
    compartments: 15,
    parameters: { 
      loa: '333.0', 
      beam: '60.0', 
      depth: '30.0', 
      draft: '20.5', 
      power: '低速柴油机 + 脱硫塔系统',
      displacement: '348,000 吨',
      speed: '15.5 节'
    },
    features: ['货油管系 3D BIM 路由', '惰性气体密闭舱监测', '防爆区域立体电子围栏'],
    layers: [
      { id: 'L-01', name: '主甲板及管汇作业区', code: 'DECK-01', elevationRange: '+20.0m ~ +30.0m', description: '原油装卸管路与惰性气体系统' },
      { id: 'L-02', name: '货油舱中层区 (1-15舱)', code: 'OIL-02', elevationRange: '0.0m ~ +20.0m', description: '双壳原油储藏密闭舱段' },
      { id: 'L-03', name: '机舱及泵舱底层', code: 'ENG-03', elevationRange: '-10.0m ~ 0.0m', description: '深井泵控制与动力舱' }
    ]
  },
  {
    id: 'M-004',
    name: '82,000 DWT 卡姆萨尔型散货船',
    type: '卡姆萨尔型散货船',
    shipScale: '大型',
    description: '标准节能型大开口散货船 3D 孪生数模，包含 7 个独立货舱、液压舱盖及船台搭载分段基准点。',
    thumbnail: bulkModelBg,
    lodLevel: 'LOD 300',
    meshCount: '920,000 面',
    compartments: 7,
    parameters: { 
      loa: '229.0', 
      beam: '32.26', 
      depth: '20.35', 
      draft: '14.45', 
      power: 'MAN B&W 6S60ME 柴油机',
      displacement: '98,000 吨',
      speed: '14.2 节'
    },
    features: ['船台分段搭载对位基准', '大舱临边登高作业防护', '装载应力模拟网格'],
    layers: [
      { id: 'L-01', name: '主甲板与舱盖作业面', code: 'DECK-01', elevationRange: '+14.0m ~ +20.35m', description: '液压舱盖与锚机平台' },
      { id: 'L-02', name: '散货货舱区 (1-7舱)', code: 'HOLD-02', elevationRange: '-2.0m ~ +14.0m', description: '大开口散货装载空间' },
      { id: 'L-03', name: '机舱底层', code: 'ENG-03', elevationRange: '-8.0m ~ -2.0m', description: '主机与发电机组舱' }
    ]
  },
  {
    id: 'M-005',
    name: '75M 动力定位平台供应船',
    type: '平台供应船 (PSV)',
    shipScale: '小型',
    description: '配备 DP-2 动力定位系统，具备 650㎡ 开阔后甲板与散装泥浆/燃油输送系统 3D 数字仿真体。',
    thumbnail: psvModelBg,
    lodLevel: 'LOD 350',
    meshCount: '850,000 面',
    compartments: 6,
    parameters: { 
      loa: '75.0', 
      beam: '16.8', 
      depth: '7.5', 
      draft: '6.0', 
      power: '柴电全回转电力推进系统',
      displacement: '4,200 吨',
      speed: '13.5 节'
    },
    features: ['开阔甲板作业人员热力图', 'DP动力定位基站网络', '泥浆舱受限空间进出许可'],
    layers: [
      { id: 'L-01', name: '后甲板开阔作业区', code: 'DECK-01', elevationRange: '+4.0m ~ +7.5m', description: '散装物料与吊装区' },
      { id: 'L-02', name: '泥浆舱与干舱区', code: 'MUD-02', elevationRange: '-1.0m ~ +4.0m', description: '钻井泥浆及散装水泥舱' },
      { id: 'L-03', name: '全回转推进机舱', code: 'ENG-03', elevationRange: '-5.0m ~ -1.0m', description: '电力推进电机舱' }
    ]
  },
  {
    id: 'M-006',
    name: '69.8M 海上风电运维工作船',
    type: '风电运维船 (SOV)',
    shipScale: '小型',
    description: '双体高速耐波浪船型 3D 渲染模型，集成 3D 波浪补偿登乘栈桥与海上物资吊装回转吊机。',
    thumbnail: workboatModelBg,
    lodLevel: 'LOD 400',
    meshCount: '1,120,000 面',
    compartments: 5,
    parameters: { 
      loa: '69.8', 
      beam: '16.0', 
      depth: '6.8', 
      draft: '5.2', 
      power: '混合动力 + 蓄电池储能',
      displacement: '3,100 吨',
      speed: '16.0 节'
    },
    features: ['3D 动态波浪补偿栈桥联动', '风场运维人员登乘轨迹', '离岸作业高精度定位'],
    layers: [
      { id: 'L-01', name: '波浪补偿栈桥平台层', code: 'BRG-01', elevationRange: '+4.5m ~ +6.8m', description: '人员登乘风机塔筒缓冲平台' },
      { id: 'L-02', name: '运维人员舱室与甲板', code: 'ACCOM-02', elevationRange: '0.0m ~ +4.5m', description: '技术人员休息与装备库' },
      { id: 'L-03', name: '双体混合动力机舱', code: 'ENG-03', elevationRange: '-4.0m ~ 0.0m', description: '双体柴电与储能电池舱' }
    ]
  },
  {
    id: 'M-007',
    name: '37米 多用途海洋工程支持船',
    type: '多用途支持船 (AHTS)',
    shipScale: '小型',
    description: '灵活的多功能近海工作船 3D 模型，支持拖拽、抛锚、潜水支持及小规模物资补给。',
    thumbnail: supportModelBg,
    lodLevel: 'LOD 300',
    meshCount: '640,000 面',
    compartments: 4,
    parameters: { 
      loa: '37.0', 
      beam: '10.4', 
      depth: '4.5', 
      draft: '3.5', 
      power: '双机双桨常规柴油动力',
      displacement: '950 吨',
      speed: '12.0 节'
    },
    features: ['拖缆机作业危险警戒弧区', '潜水作业支持定位', '多模式锚泊姿态显示'],
    layers: [
      { id: 'L-01', name: '拖缆与锚机甲板层', code: 'DECK-01', elevationRange: '+2.0m ~ +4.5m', description: '甲板拖曳作业区' },
      { id: 'L-02', name: '常规机舱底层', code: 'ENG-02', elevationRange: '-3.0m ~ +2.0m', description: '柴油主机舱' }
    ]
  },
  {
    id: 'M-008',
    name: '18500 DWT 绿色节能油化船',
    type: '不锈钢化学品船',
    shipScale: '小型',
    description: 'IMO II 类化学品船 3D 高精度模型，具备独立双相不锈钢货舱、深井泵及全船防爆监测感知节点。',
    thumbnail: chemTankerModelBg,
    lodLevel: 'LOD 350',
    meshCount: '1,180,000 面',
    compartments: 14,
    parameters: { 
      loa: '149.8', 
      beam: '24.0', 
      depth: '13.2', 
      draft: '9.8', 
      power: '电控二冲程低速柴油机',
      displacement: '25,600 吨',
      speed: '14.0 节'
    },
    features: ['2205双相不锈钢舱壁三维网格', '有毒有害化学气体扩散模拟', '洗舱作业人员实时跟踪'],
    layers: [
      { id: 'L-01', name: '化学品主甲板管汇层', code: 'DECK-01', elevationRange: '+9.0m ~ +13.2m', description: '不锈钢输送管路与洗舱机' },
      { id: 'L-02', name: '不锈钢货舱区 (1-14舱)', code: 'HOLD-02', elevationRange: '0.0m ~ +9.0m', description: 'IMO II类独立货舱' },
      { id: 'L-03', name: '低速机舱底层', code: 'ENG-03', elevationRange: '-6.0m ~ 0.0m', description: '动力舱' }
    ]
  }
];

export function ShipModelManagement() {
  const [shipModels, setShipModels] = useState<ShipModel[]>(initialMockShipModels);
  const [selectedModel, setSelectedModel] = useState<ShipModel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScale, setSelectedScale] = useState<'全部' | '大型' | '小型'>('全部');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modal states: 'create' | 'edit' | 'detail' | 'layers' | null
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail' | 'layers' | null>(null);
  const [editingModel, setEditingModel] = useState<ShipModel | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form fields for create/edit
  const [formFields, setFormFields] = useState({
    name: '',
    type: 'LNG液化天然气船',
    shipScale: '大型' as '大型' | '小型',
    description: '',
    lodLevel: 'LOD 400 (施工级)',
    meshCount: '1,200,000 面',
    compartments: 4,
    loa: '250.0',
    beam: '40.0',
    depth: '24.0',
    draft: '10.0',
    power: '双燃料主机',
    displacement: '95,000 吨',
    speed: '18.0 节'
  });

  // Layer editing state when modalMode === 'layers'
  const [activeLayers, setActiveLayers] = useState<ShipLayer[]>([]);
  const [newLayerName, setNewLayerName] = useState('');
  const [newLayerCode, setNewLayerCode] = useState('');
  const [newLayerRange, setNewLayerRange] = useState('');
  const [newLayerDesc, setNewLayerDesc] = useState('');

  const filteredModels = shipModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          model.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScale = selectedScale === '全部' || model.shipScale === selectedScale;
    return matchesSearch && matchesScale;
  });

  const handleOpenCreate = () => {
    setFormFields({
      name: '',
      type: 'LNG液化天然气船',
      shipScale: '大型',
      description: '高精度3D船舶数字孪生数模，支持多层结构交互与智能安全监测。',
      lodLevel: 'LOD 400',
      meshCount: '1,250,000 面',
      compartments: 6,
      loa: '280.0',
      beam: '42.0',
      depth: '25.0',
      draft: '11.0',
      power: '双燃料低速机',
      displacement: '110,000 吨',
      speed: '19.0 节'
    });
    setModalMode('create');
  };

  const handleOpenEdit = (model: ShipModel) => {
    setEditingModel(model);
    setFormFields({
      name: model.name,
      type: model.type,
      shipScale: model.shipScale,
      description: model.description,
      lodLevel: model.lodLevel,
      meshCount: model.meshCount,
      compartments: model.compartments,
      loa: model.parameters.loa,
      beam: model.parameters.beam,
      depth: model.parameters.depth,
      draft: model.parameters.draft,
      power: model.parameters.power,
      displacement: model.parameters.displacement,
      speed: model.parameters.speed
    });
    setModalMode('edit');
  };

  const handleOpenLayers = (model: ShipModel) => {
    setEditingModel(model);
    setActiveLayers(model.layers ? [...model.layers] : []);
    setNewLayerName('');
    setNewLayerCode('');
    setNewLayerRange('');
    setNewLayerDesc('');
    setModalMode('layers');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.name.trim()) return;

    if (modalMode === 'create') {
      const newModel: ShipModel = {
        id: `M-${String(shipModels.length + 1).padStart(3, '0')}`,
        name: formFields.name,
        type: formFields.type,
        shipScale: formFields.shipScale,
        description: formFields.description,
        thumbnail: lngModelBg, // default thumbnail
        lodLevel: formFields.lodLevel,
        meshCount: formFields.meshCount,
        compartments: Number(formFields.compartments) || 4,
        parameters: {
          loa: formFields.loa,
          beam: formFields.beam,
          depth: formFields.depth,
          draft: formFields.draft,
          power: formFields.power,
          displacement: formFields.displacement,
          speed: formFields.speed
        },
        features: ['3D 空间网格', '区域数字化关联', '施工安全监控点'],
        layers: [
          { id: `L-${Date.now()}-1`, name: '主甲板作业区', code: 'DECK-01', elevationRange: '+15.0m ~ +25.0m', description: '露天作业甲板' },
          { id: `L-${Date.now()}-2`, name: '内部货舱/结构层', code: 'HOLD-02', elevationRange: '0.0m ~ +15.0m', description: '主体舱段' },
          { id: `L-${Date.now()}-3`, name: '机舱与动力底层', code: 'ENG-03', elevationRange: '-10.0m ~ 0.0m', description: '推进系统舱' }
        ]
      };
      setShipModels([newModel, ...shipModels]);
    } else if (modalMode === 'edit' && editingModel) {
      setShipModels(prev => prev.map(m => m.id === editingModel.id ? {
        ...m,
        name: formFields.name,
        type: formFields.type,
        shipScale: formFields.shipScale,
        description: formFields.description,
        lodLevel: formFields.lodLevel,
        meshCount: formFields.meshCount,
        compartments: Number(formFields.compartments) || m.compartments,
        parameters: {
          loa: formFields.loa,
          beam: formFields.beam,
          depth: formFields.depth,
          draft: formFields.draft,
          power: formFields.power,
          displacement: formFields.displacement,
          speed: formFields.speed
        }
      } : m));
    }
    setModalMode(null);
    setEditingModel(null);
  };

  const handleConfirmDelete = (id: string) => {
    setShipModels(prev => prev.filter(m => m.id !== id));
    setDeleteTargetId(null);
  };

  const handleAddLayer = () => {
    if (!newLayerName.trim()) return;
    const newL: ShipLayer = {
      id: `L-${Date.now()}`,
      name: newLayerName,
      code: newLayerCode || `LAYER-${activeLayers.length + 1}`,
      elevationRange: newLayerRange || '+0.0m ~ +10.0m',
      description: newLayerDesc || '自定义分层模型区域'
    };
    setActiveLayers([...activeLayers, newL]);
    setNewLayerName('');
    setNewLayerCode('');
    setNewLayerRange('');
    setNewLayerDesc('');
  };

  const handleDeleteLayer = (layerId: string) => {
    setActiveLayers(activeLayers.filter(l => l.id !== layerId));
  };

  const handleSaveLayers = () => {
    if (!editingModel) return;
    setShipModels(prev => prev.map(m => m.id === editingModel.id ? { ...m, layers: activeLayers } : m));
    setModalMode(null);
    setEditingModel(null);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* 顶部搜索与类型筛选工具栏 */}
      <div className="flex flex-wrap justify-between items-center bg-white p-3.5 border border-slate-200 rounded-xl shadow-sm shrink-0 gap-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索 3D 船模名称或船型..." 
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {(['全部', '大型', '小型'] as const).map((scale) => (
              <button
                key={scale}
                onClick={() => setSelectedScale(scale)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  selectedScale === scale
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {scale === '全部' ? '全部规模' : `${scale}船型`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Box className="w-4 h-4 text-blue-600" />
            <span>已载入 <strong className="text-slate-800">{filteredModels.length}</strong> 款高精度 3D 船模数模</span>
          </div>

          {/* 新增船模按钮 */}
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>新增船模</span>
          </button>

          {/* 视图模式切换器 (卡片式 / 列表式) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="卡片式展示"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>卡片视图</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="列表式展示"
            >
              <List className="w-3.5 h-3.5" />
              <span>列表视图</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D 船模内容视图 (卡片式 / 列表式) */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {filteredModels.map(model => (
              <div 
                key={model.id} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group flex flex-col"
              >
                {/* 3D 模型视口预览区域 */}
                <div className="aspect-[16/9] relative bg-slate-950 overflow-hidden cursor-pointer" onClick={() => setSelectedModel(model)}>
                  <img 
                    src={model.thumbnail} 
                    alt={model.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                  />
                  
                  {/* 微光覆层 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none"></div>

                  {/* 左上角 船型类型尺寸 (大型/小型) 标识 */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 backdrop-blur-md shadow-lg rounded-full text-[11px] font-bold px-2.5 py-0.5 border">
                    {model.shipScale === '大型' ? (
                      <span className="bg-blue-600/90 text-white border-blue-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Ship className="w-3 h-3 text-cyan-200" />
                        <span>大型船型</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-600/90 text-white border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Ship className="w-3 h-3 text-emerald-200" />
                        <span>小型船型</span>
                      </span>
                    )}
                  </div>

                  {/* 右上角 详细船型描述 */}
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur text-slate-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-700/60 shadow-sm">
                    {model.type}
                  </div>
                </div>

                {/* 卡片详情内容 */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1.5 min-w-0">
                    <Ship className="w-4 h-4 text-blue-600 shrink-0" />
                    <h3 className="font-bold text-slate-800 text-sm truncate" title={model.name}>
                      {model.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed h-8">
                    {model.description}
                  </p>

                  {/* 核心参数胶囊 */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100 mb-3 text-center">
                    <div>
                      <div className="text-[9px] text-slate-400">总长(LOA)</div>
                      <div className="text-xs font-bold font-mono text-slate-700">{model.parameters.loa}m</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400">型宽(Beam)</div>
                      <div className="text-xs font-bold font-mono text-slate-700">{model.parameters.beam}m</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400">型深(Depth)</div>
                      <div className="text-xs font-bold font-mono text-slate-700">{model.parameters.depth}m</div>
                    </div>
                  </div>
                  
                  {/* 底部按钮栏：查看、编辑、分层配置、删除 */}
                  <div className="mt-auto pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5 text-[11px]">
                    <button 
                      onClick={() => setSelectedModel(model)}
                      className="flex items-center justify-center gap-1 py-1.5 font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> 查看
                    </button>
                    <button 
                      onClick={() => handleOpenLayers(model)}
                      className="flex items-center justify-center gap-1 py-1.5 font-semibold text-purple-700 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" /> 分层配置
                    </button>
                    <button 
                      onClick={() => handleOpenEdit(model)}
                      className="flex items-center justify-center gap-1 py-1.5 font-semibold text-sky-600 bg-sky-50 border border-sky-100 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> 编辑
                    </button>
                    <button 
                      onClick={() => setDeleteTargetId(model.id)}
                      className="flex items-center justify-center gap-1 py-1.5 font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 列表式展示视图 (Table View) */
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-700 font-bold">
                    <th className="py-3 px-3.5 w-16 text-center border-r border-slate-200/50">代号</th>
                    <th className="py-3 px-3 w-28 text-center border-r border-slate-200/50">3D数模</th>
                    <th className="py-3 px-4 min-w-[200px] border-r border-slate-200/50">3D船模名称与说明</th>
                    <th className="py-3 px-3.5 whitespace-nowrap border-r border-slate-200/50">船型规模</th>
                    <th className="py-3 px-3.5 whitespace-nowrap border-r border-slate-200/50">船型类型</th>
                    <th className="py-3 px-4 whitespace-nowrap border-r border-slate-200/50">主尺度 (LOA × 宽 × 深)</th>
                    <th className="py-3 px-4 text-center min-w-[210px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredModels.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        未匹配到符合条件的 3D 船模
                      </td>
                    </tr>
                  ) : (
                    filteredModels.map(model => (
                      <tr key={model.id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-500 border-r border-slate-100">
                          {model.id}
                        </td>
                        <td className="py-2.5 px-3 text-center border-r border-slate-100">
                          <div 
                            onClick={() => setSelectedModel(model)}
                            className="w-20 h-12 rounded-lg bg-slate-950 overflow-hidden relative cursor-pointer border border-slate-200 shadow-2xs group-hover:border-blue-400 transition-all inline-block"
                          >
                            <img src={model.thumbnail} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                              <Eye className="w-4 h-4 text-white opacity-80 group-hover:opacity-100 transition-opacity drop-shadow" />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <Ship className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span 
                              className="hover:text-blue-600 cursor-pointer transition-colors"
                              onClick={() => setSelectedModel(model)}
                            >
                              {model.name}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-relaxed">
                            {model.description}
                          </div>
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap border-r border-slate-100">
                          <span className={`px-2.5 py-0.5 font-bold rounded-md text-[11px] inline-block ${
                            model.shipScale === '大型'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/70'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                          }`}>
                            {model.shipScale}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap border-r border-slate-100">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded-md text-[11px] inline-block">
                            {model.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap border-r border-slate-100">
                          <div className="font-mono text-xs text-slate-800 font-bold">
                            {model.parameters.loa}m × {model.parameters.beam}m × {model.parameters.depth}m
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            吃水: {model.parameters.draft}m | {model.parameters.speed}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => setSelectedModel(model)}
                              className="px-2.5 py-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded transition-all cursor-pointer inline-flex items-center gap-0.5 shadow-2xs"
                            >
                              <Eye className="w-3 h-3" />
                              <span>查看</span>
                            </button>
                            <button 
                              onClick={() => handleOpenLayers(model)}
                              className="px-2.5 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 rounded transition-all cursor-pointer inline-flex items-center gap-0.5 shadow-2xs"
                            >
                              <Layers className="w-3 h-3" />
                              <span>分层</span>
                            </button>
                            <button 
                              onClick={() => handleOpenEdit(model)}
                              className="px-2.5 py-1 text-[11px] font-bold text-sky-600 bg-sky-50 border border-sky-200 hover:bg-sky-100 rounded transition-all cursor-pointer inline-flex items-center gap-0.5 shadow-2xs"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>编辑</span>
                            </button>
                            <button 
                              onClick={() => setDeleteTargetId(model.id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded transition-all cursor-pointer inline-flex items-center gap-0.5 shadow-2xs"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>删除</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3D 船模详细参数与结构弹窗 */}
      {selectedModel && (
        <div 
          onClick={() => setSelectedModel(null)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden border border-slate-200 max-h-[90vh]"
          >
            {/* 顶部渲染大图展示 */}
            <div className="relative aspect-[21/9] bg-slate-950 overflow-hidden shrink-0">
              <img 
                src={selectedModel.thumbnail} 
                alt={selectedModel.name} 
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
              
              {/* 关闭按钮 */}
              <button 
                onClick={() => setSelectedModel(null)}
                className="absolute top-4 right-4 text-white hover:text-slate-200 bg-black/40 hover:bg-black/70 p-2 rounded-full backdrop-blur-md transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 仅显示船名与类型 */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full backdrop-blur ${
                    selectedModel.shipScale === '大型'
                      ? 'bg-blue-600/90 text-white'
                      : 'bg-emerald-600/90 text-white'
                  }`}>
                    {selectedModel.shipScale}
                  </span>
                  <span className="text-cyan-300 text-xs font-bold bg-slate-900/80 backdrop-blur px-2.5 py-0.5 rounded-full border border-slate-700/60">
                    {selectedModel.type}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 drop-shadow-md">
                  <Ship className="w-6 h-6 text-cyan-400 shrink-0" /> {selectedModel.name}
                </h2>
              </div>
            </div>
            
            {/* 内容区 */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* 简介 */}
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {selectedModel.description}
              </p>

              {/* 核心主尺度参数 */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span> 船舶主尺度与关键物理参数
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">总长 (LOA)</div>
                    <div className="font-mono text-base font-bold text-slate-800">{selectedModel.parameters.loa} <span className="text-xs text-slate-500 font-sans">米</span></div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">型宽 (Beam)</div>
                    <div className="font-mono text-base font-bold text-slate-800">{selectedModel.parameters.beam} <span className="text-xs text-slate-500 font-sans">米</span></div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">型深 (Depth)</div>
                    <div className="font-mono text-base font-bold text-slate-800">{selectedModel.parameters.depth} <span className="text-xs text-slate-500 font-sans">米</span></div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">设计吃水 (Draft)</div>
                    <div className="font-mono text-base font-bold text-slate-800">{selectedModel.parameters.draft} <span className="text-xs text-slate-500 font-sans">米</span></div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">满载排水量</div>
                    <div className="font-mono text-sm font-bold text-slate-800">{selectedModel.parameters.displacement}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">设计航速</div>
                    <div className="font-mono text-sm font-bold text-slate-800">{selectedModel.parameters.speed}</div>
                  </div>
                  <div className="col-span-2 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-medium mb-1">主机及推进形式</div>
                    <div className="text-xs font-bold text-slate-800 truncate">{selectedModel.parameters.power}</div>
                  </div>
                </div>
              </div>

              {/* 船模分层结构速览 */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-purple-600 rounded-full"></span> 3D 模型分层结构信息 ({selectedModel.layers?.length || 0}层)
                  </span>
                </h3>
                <div className="space-y-2">
                  {selectedModel.layers && selectedModel.layers.length > 0 ? (
                    selectedModel.layers.map((layer, idx) => (
                      <div key={layer.id || idx} className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-slate-800">{layer.name}</span>
                            <span className="ml-2 text-slate-400 font-mono text-[10px]">[{layer.code}]</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded text-[11px]">
                            {layer.elevationRange}
                          </span>
                          <span className="text-slate-500 text-[11px] hidden sm:inline">{layer.description}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-xs py-3 text-center bg-slate-50 rounded-xl">暂无分层配置信息</div>
                  )}
                </div>
              </div>

            </div>

            {/* 弹窗底部操作 */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
              <button
                onClick={() => setSelectedModel(null)}
                className="px-6 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增 / 编辑 船模模态框 */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Ship className="w-4 h-4 text-blue-600" />
                <span>{modalMode === 'create' ? '新增 3D 船模数模' : `编辑船模参数：${editingModel?.name}`}</span>
              </h3>
              <button 
                onClick={() => { setModalMode(null); setEditingModel(null); }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    船模名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formFields.name}
                    onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                    placeholder="如: 15万吨散货船"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">船型分类名称</label>
                  <input
                    type="text"
                    value={formFields.type}
                    onChange={(e) => setFormFields({ ...formFields, type: e.target.value })}
                    placeholder="如: 散货船"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">船型规模</label>
                  <select
                    value={formFields.shipScale}
                    onChange={(e) => setFormFields({ ...formFields, shipScale: e.target.value as '大型' | '小型' })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
                  >
                    <option value="大型">大型船型</option>
                    <option value="小型">小型船型</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">LOD 建模精度</label>
                  <input
                    type="text"
                    value={formFields.lodLevel}
                    onChange={(e) => setFormFields({ ...formFields, lodLevel: e.target.value })}
                    placeholder="如: LOD 400"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">船模描述摘要</label>
                  <textarea
                    rows={2}
                    value={formFields.description}
                    onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                    placeholder="请输入该 3D 船模的构造特点与应用说明..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">总长 LOA (米)</label>
                  <input
                    type="text"
                    value={formFields.loa}
                    onChange={(e) => setFormFields({ ...formFields, loa: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">型宽 Beam (米)</label>
                  <input
                    type="text"
                    value={formFields.beam}
                    onChange={(e) => setFormFields({ ...formFields, beam: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">型深 Depth (米)</label>
                  <input
                    type="text"
                    value={formFields.depth}
                    onChange={(e) => setFormFields({ ...formFields, depth: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">吃水 Draft (米)</label>
                  <input
                    type="text"
                    value={formFields.draft}
                    onChange={(e) => setFormFields({ ...formFields, draft: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">满载排水量</label>
                  <input
                    type="text"
                    value={formFields.displacement}
                    onChange={(e) => setFormFields({ ...formFields, displacement: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">设计航速</label>
                  <input
                    type="text"
                    value={formFields.speed}
                    onChange={(e) => setFormFields({ ...formFields, speed: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">主机及推进形式</label>
                  <input
                    type="text"
                    value={formFields.power}
                    onChange={(e) => setFormFields({ ...formFields, power: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setModalMode(null); setEditingModel(null); }}
                  className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium cursor-pointer shadow-2xs"
                >
                  保存船模
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 分层配置模态框 (Layer Configuration Modal) */}
      {modalMode === 'layers' && editingModel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="px-5 py-3.5 bg-purple-900 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-300" />
                <span>分层配置管理：{editingModel.name}</span>
              </h3>
              <button 
                onClick={() => { setModalMode(null); setEditingModel(null); }}
                className="text-purple-300 hover:text-white p-1 rounded-lg hover:bg-purple-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="bg-purple-50/70 border border-purple-200/80 p-3 rounded-xl text-purple-900 flex items-center justify-between">
                <div>
                  <strong className="font-bold">当前船模层级总数：</strong> {activeLayers.length} 层
                </div>
                <span className="text-[11px] text-purple-700">可自由新增、修改或删除三维模型分层区块</span>
              </div>

              {/* 新增分层表单 */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-purple-600" /> 添加新分层
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5 text-[11px]">分层名称 <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      value={newLayerName}
                      onChange={(e) => setNewLayerName(e.target.value)}
                      placeholder="如: 甲板层 (上甲板)"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5 text-[11px]">分层代码编码</label>
                    <input
                      type="text"
                      value={newLayerCode}
                      onChange={(e) => setNewLayerCode(e.target.value)}
                      placeholder="如: DECK-02"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5 text-[11px]">标高范围</label>
                    <input
                      type="text"
                      value={newLayerRange}
                      onChange={(e) => setNewLayerRange(e.target.value)}
                      placeholder="如: +12.0m ~ +20.0m"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5 text-[11px]">分层说明描述</label>
                    <input
                      type="text"
                      value={newLayerDesc}
                      onChange={(e) => setNewLayerDesc(e.target.value)}
                      placeholder="如: 露天吊装及人员作业区"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAddLayer}
                    className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> 添加到分层列表
                  </button>
                </div>
              </div>

              {/* 已有分层列表 */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">当前分层列表</h4>
                {activeLayers.length === 0 ? (
                  <div className="text-slate-400 py-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                    暂无分层配置，请在上方添加
                  </div>
                ) : (
                  activeLayers.map((layer, index) => (
                    <div key={layer.id || index} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-mono font-bold flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{layer.name} <span className="font-mono text-slate-400 font-normal text-[11px]">[{layer.code}]</span></div>
                          <div className="text-[11px] text-slate-500">{layer.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-purple-700 font-bold bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded text-[11px]">
                          {layer.elevationRange}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteLayer(layer.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="删除此分层"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => { setModalMode(null); setEditingModel(null); }}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveLayers}
                className="px-5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                保存分层配置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-5 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-50 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">确认删除该 3D 船模？</h4>
                <p className="text-slate-500 mt-0.5">删除后，关联此船型的项目和三维场景配置可能会受影响。</p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => handleConfirmDelete(deleteTargetId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
