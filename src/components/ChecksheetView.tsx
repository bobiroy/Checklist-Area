import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Camera, 
  Upload, 
  Check, 
  AlertTriangle, 
  Printer, 
  CheckCircle2, 
  Layers, 
  Building2, 
  ArrowRight, 
  Eye, 
  Trash2, 
  Sparkles,
  ClipboardCheck,
  Scissors,
  Shirt,
  Package,
  Warehouse,
  Flame,
  Zap,
  ArrowDownCircle,
  Truck,
  Weight,
  Cpu,
  Store,
  UserCheck,
  User,
  Loader2
} from 'lucide-react';
import { InspectionFinding, FactoryOption, FindingCategory, PriorityLevel, UserAccount } from '../types';
import { SAMPLE_PHOTO_PRESETS } from '../data/mockData';
import { compressImageFile } from '../utils/imageCompressor';

export type ChecksheetAreaId = 'warehouse' | 'cutting' | 'distribusi' | 'sewing' | 'finish-good';
export type DistribusiSubAreaId = 'ppa' | 'supermarket' | 'heat-transfer';

export interface ChecksheetAreaConfig {
  id: ChecksheetAreaId;
  name: string;
  boxTitle: string; // The title that appears in the box
  department: string;
  defaultPic: string;
  icon: React.ElementType;
  badgeStyle: string;
  description: string;
  hasSubAreas?: boolean;
}

export interface DistribusiSubAreaConfig {
  id: DistribusiSubAreaId;
  name: string;
  fullTitle: string;
  boxTitle: string;
  defaultPic: string;
  icon: React.ElementType;
  description: string;
}

export interface CheckpointItem {
  id: string;
  code: string; // 'A', 'B', 'C', 'D', 'E', 'F'
  title: string;
  icon: React.ElementType;
  category: FindingCategory;
  questionId: string;
  questionEn: string;
  defaultPriority: PriorityLevel;
  suggestedFinding: string;
}

// 5 Main Areas Sesuai Permintaan User:
// 1. Warehouse, 2. Cutting, 3. Distribusi, 4. Sewing, 5. Finish Good
const CHECK_AREAS: ChecksheetAreaConfig[] = [
  {
    id: 'warehouse',
    name: 'Warehouse',
    boxTitle: 'WAREHOUSE AREA',
    department: 'Warehouse',
    defaultPic: 'Agus Pratama (SPV Gudang & Logistik)',
    icon: Warehouse,
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-300',
    description: 'Gudang penyimpanan roll kain utama, rak trims/aksesoris, staging box, dan jalur forklift/pallet.'
  },
  {
    id: 'cutting',
    name: 'Cutting',
    boxTitle: 'CUTTING AREA',
    department: 'Cutting',
    defaultPic: 'Bambang Haryanto (Supervisor Cutting)',
    icon: Scissors,
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-300',
    description: 'Area pemotongan manual/semi-otomatis, band knife cutter, fusing press station, dan penataan bundle.'
  },
  {
    id: 'distribusi',
    name: 'Distribusi',
    boxTitle: 'DISTRIBUSI AREA',
    department: 'Distribusi',
    defaultPic: 'Dedi Kurniawan (SPV Distribusi & Internal Logistics)',
    icon: Truck,
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    description: 'Departemen Distribusi internal: PPA (Auto & Manual), Supermarket Komponen, dan Heat Transfer Press.',
    hasSubAreas: true
  },
  {
    id: 'sewing',
    name: 'Sewing',
    boxTitle: 'SEWING LINE AREA',
    department: 'Sewing',
    defaultPic: 'Siti Rahmawati (SPV Sewing Line)',
    icon: Shirt,
    badgeStyle: 'bg-purple-50 text-purple-700 border-purple-300',
    description: 'Area perakitan jahit lini 1-8, meja feeder sewing, needle guard safety, dan in-line QC.'
  },
  {
    id: 'finish-good',
    name: 'Finish Good',
    boxTitle: 'FINISH GOOD AREA',
    department: 'Finish Good',
    defaultPic: 'Dewi Lestari (SPV Finish Good & Packing)',
    icon: Package,
    badgeStyle: 'bg-rose-50 text-rose-700 border-rose-300',
    description: 'Area steam iron, press setting, konveyor detektor jarum (metal detector), dan kartonasi ekspor siap kirim.'
  }
];

// 3 Spesifik Sub-Area Distribusi:
// 1. PPA, 2. Supermarket, 3. Heat Transfer
const DISTRIBUSI_SUB_AREAS: DistribusiSubAreaConfig[] = [
  {
    id: 'ppa',
    name: 'PPA',
    fullTitle: 'PPA Auto & Manual',
    boxTitle: 'PPA AUTO & MANUAL',
    defaultPic: 'Budi Santoso (Supervisor PPA & Distribusi)',
    icon: Cpu,
    description: 'Area auto-spreading kain, mesin potong otomatis (auto-cutter), pre-assembly & CAD spreading.'
  },
  {
    id: 'supermarket',
    name: 'Supermarket',
    fullTitle: 'Supermarket Komponen',
    boxTitle: 'SUPERMARKET AREA',
    defaultPic: 'Dedi Kurniawan (SPV Supermarket & Distribusi)',
    icon: Store,
    description: 'Area supermarket penyimpanan komponen potongan kain, rak kitting trims, kanban feeder, dan penataan trolley.'
  },
  {
    id: 'heat-transfer',
    name: 'Heat Transfer',
    fullTitle: 'Heat Transfer Press',
    boxTitle: 'HEAT TRANSFER AREA',
    defaultPic: 'Rudi Hartono (Leader Heat Transfer)',
    icon: Flame,
    description: 'Area mesin press heat transfer logo apparel, curing stiker merek, pengujian adhesi, dan suhu pemanas.'
  }
];

// Poin Checksheet STOP-6 (Sesuai format gambar & standar K3)
const STOP6_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'apparatus',
    code: 'A',
    title: 'Apparatus',
    icon: Cpu,
    category: 'Safety Stop 6',
    questionId: 'Apakah di area {area} ada potensi terjadinya terjepit, terpotong, tertusuk,dll ?',
    questionEn: '(Is there a risk of bruises, cuts, punctures, etc. in the {area}?)',
    defaultPriority: 'High',
    suggestedFinding: 'Cover pelindung / interlock pengaman mesin terbuka, jari operator berisiko terjepit atau tertusuk jarum/pisau potong.'
  },
  {
    id: 'big-heavy',
    code: 'B',
    title: 'Big Heavy',
    icon: Weight,
    category: 'Safety Stop 6',
    questionId: 'Apakah di area {area} ada potensi tebentur benda berat/ tertimpa?',
    questionEn: '(Is there are Hit by Heavy Object in the {area}?)',
    defaultPriority: 'High',
    suggestedFinding: 'Tumpukan roll kain / material berat tanpa stopper pengaman, berisiko roboh menimpa pekerja.'
  },
  {
    id: 'car-vehicles',
    code: 'C',
    title: 'Car / Vehicles',
    icon: Truck,
    category: 'Safety Stop 6',
    questionId: 'Apakah di area {area} ada potensi tabrakan dengan kendaraan / forklift / hand pallet?',
    questionEn: '(Is there collision risk with operational vehicles, forklifts, tuggers or hand pallets in the {area}?)',
    defaultPriority: 'Critical',
    suggestedFinding: 'Jalur lintasan hand pallet / trolley berpotongan dengan pedestrian tanpa marka visual atau cermin cembung.'
  },
  {
    id: 'drop',
    code: 'D',
    title: 'Drop',
    icon: ArrowDownCircle,
    category: 'Safety Stop 6',
    questionId: 'Apakah di area {area} terdapat potensi kecelakaan terjatuh dan jatuh dari ketinggian ?',
    questionEn: '(Is there are potencial risk of drop from high place accident in the {area}?)',
    defaultPriority: 'High',
    suggestedFinding: 'Tangga akses inspeksi tanpa handrail kokoh atau ceceran minyak/oli licin di lantai kerja tanpa tanda bahaya.'
  },
  {
    id: 'electricity',
    code: 'E',
    title: 'Electricity',
    icon: Zap,
    category: 'Safety Stop 6',
    questionId: 'Apakah di area {area} ada potensi bahaya sengatan listrik, kabel terkelupas, atau panel terbuka?',
    questionEn: '(Is there risk of electrical shock, damaged wiring insulation, or open power distribution panels in the {area}?)',
    defaultPriority: 'Critical',
    suggestedFinding: 'Kabel instalasi mesin dinamo terkelupas di bawah injakan kaki atau panel MCB switchboard tidak tertutup rapat.'
  },
  {
    id: 'fire',
    code: 'F',
    title: 'Fire',
    icon: Flame,
    category: 'Safety Stop 6',
    questionId: 'Apakah di area {area} ada potensi bahaya kebakaran, tumpukan mudah terbakar, atau APAR terhalang?',
    questionEn: '(Is there fire risk, combustible textile fluff accumulation, or blocked fire extinguishers in the {area}?)',
    defaultPriority: 'Critical',
    suggestedFinding: 'Akses tabung APAR / pintu darurat terhalang palet box garmen dan penumpukan debu kain dekat sakelar panas.'
  }
];

// Poin Checksheet 6S
const SIX_S_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'sort',
    code: '1S',
    title: 'Sort (Ringkas)',
    icon: Layers,
    category: '5R',
    questionId: 'Apakah di area {area} bebas dari barang tidak perlu, kain BS yang menumpuk, atau barang rusak?',
    questionEn: '(Are there unwanted clutter, defective materials, or obsolete items eliminated in the {area}?)',
    defaultPriority: 'Medium',
    suggestedFinding: 'Penumpukan sisa potongan kain perca dan box tidak terpakai berserakan di bawah meja kerja.'
  },
  {
    id: 'set-in-order',
    code: '2S',
    title: 'Set in Order (Rapi)',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Apakah seluruh alat, template pola, dan gunting memiliki shadow board dengan penandaan jelas?',
    questionEn: '(Are tools, pattern templates, and scissors clearly organized with shadow boards in the {area}?)',
    defaultPriority: 'Medium',
    suggestedFinding: 'Gunting pemotong dan meteran diletakkan sembarangan tanpa label identitas shadow board.'
  },
  {
    id: 'shine',
    code: '3S',
    title: 'Shine (Resik)',
    icon: Sparkles,
    category: '5R',
    questionId: 'Apakah lantai linimasa, mesin produksi, dan pencahayaan bebas dari debu serat kain dan kotoran?',
    questionEn: '(Are workfloors, production machinery, and lights kept spotlessly clean from lint in the {area}?)',
    defaultPriority: 'Low',
    suggestedFinding: 'Penumpukan debu serat benang tebal di motor dinamo mesin dan filter ventilasi udara.'
  },
  {
    id: 'standardize',
    code: '4S',
    title: 'Standardize (Rawat)',
    icon: ClipboardCheck,
    category: '5R',
    questionId: 'Apakah garis batas demarkasi lantai (merah/kuning/hijau) dan instruksi kerja SOP terpampang standar?',
    questionEn: '(Are floor demarkation lines and SOP visual work instructions clearly visible and standardized in the {area}?)',
    defaultPriority: 'Medium',
    suggestedFinding: 'Cat marka jalur material kuning pudar dan instruksi batas ketinggian susunan roll tidak ada.'
  },
  {
    id: 'sustain',
    code: '5S',
    title: 'Sustain (Rajin)',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Apakah audit dan jadwal piket 5S ditaati dan form checklist harian diisi secara konsisten?',
    questionEn: '(Are daily 5S habits practiced and inspection logs filled consistently by operators in the {area}?)',
    defaultPriority: 'Low',
    suggestedFinding: 'Lembar cek 5S harian di stasiun kerja belum diperbarui selama 3 hari terakhir.'
  },
  {
    id: 'safety',
    code: '6S',
    title: 'Safety (Selamat)',
    icon: ShieldAlert,
    category: 'Safety Stop 6',
    questionId: 'Apakah operator memakai Alat Pelindung Diri (APD: sarung tangan baja, masker debu, earplug) dengan benar?',
    questionEn: '(Do operators properly wear Personal Protective Equipment (cut-resistant gloves, dust mask, earplugs) in the {area}?)',
    defaultPriority: 'High',
    suggestedFinding: 'Operator pemotong kain tidak mengenakan sarung tangan rantai pelindung sayatan (metal mesh glove).'
  }
];

interface ChecksheetViewProps {
  findings: InspectionFinding[];
  currentUser: UserAccount;
  onSaveFinding: (finding: InspectionFinding) => void;
  onSelectPhotoProof?: (finding: InspectionFinding) => void;
  onGoToInspectionTable?: () => void;
  selectedFactory?: FactoryOption;
  onSelectFactory?: (factory: FactoryOption) => void;
  onNavigateToFactoryDashboard?: (factory: FactoryOption) => void;
}

interface ItemFindingDraft {
  photoUrl: string;
  description: string;
  pic: string;
  assessor?: string;
  priority: PriorityLevel;
  savedFindingId?: string;
  savedTime?: string;
}

export const ChecksheetView: React.FC<ChecksheetViewProps> = ({
  findings,
  currentUser,
  onSaveFinding,
  onSelectPhotoProof,
  onGoToInspectionTable,
  selectedFactory: controlledFactory,
  onSelectFactory,
  onNavigateToFactoryDashboard
}) => {
  // 1. Selected Main Area (Default to 'distribusi' so PPA is immediately ready as requested)
  const [selectedAreaId, setSelectedAreaId] = useState<ChecksheetAreaId>('distribusi');

  // 2. Selected Sub-Area when Distribusi is active: 'ppa' | 'supermarket' | 'heat-transfer'
  const [selectedDistribusiSubArea, setSelectedDistribusiSubArea] = useState<DistribusiSubAreaId>('ppa');
  
  // 3. Selected Factory Unit (Synchronized with global app factory)
  const [internalFactory, setInternalFactory] = useState<FactoryOption>(controlledFactory || 'AOI 1');

  React.useEffect(() => {
    if (controlledFactory) {
      setInternalFactory(controlledFactory);
    }
  }, [controlledFactory]);

  const selectedFactory = controlledFactory || internalFactory;
  const setSelectedFactory = (fac: FactoryOption) => {
    setInternalFactory(fac);
    onSelectFactory?.(fac);
  };

  // 3b. Assessor Name State - Default kosong tanpa tulisan
  const [assessorName, setAssessorName] = useState<string>('');

  // 3c. PIC Name State - Input teks bebas nama PIC dibawah Assessor (Default kosong)
  const [customPicName, setCustomPicName] = useState<string>('');

  // 4. Category tab: 'stop6' (Safety STOP-6) or '6s' (Framework 6S)
  const [activeCategory, setActiveCategory] = useState<'stop6' | '6s'>('stop6');

  // 5. Scoring states: key = `${uniqueAreaKey}-${category}-${checkpointId}`, value = 1 (Aman) | 0 (Bahaya)
  const [scores, setScores] = useState<Record<string, 1 | 0>>({});

  // 6. In-place Draft Finding input for each checkpoint item
  const [draftFindings, setDraftFindings] = useState<Record<string, ItemFindingDraft>>({});

  // 7. Notification alert banner with factory context
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    findingId: string;
    factory: FactoryOption;
  } | null>(null);

  // 8. Photo compression loading indicator
  const [compressingId, setCompressingId] = useState<string | null>(null);

  const mainArea = CHECK_AREAS.find(a => a.id === selectedAreaId) || CHECK_AREAS[0];
  const activeSubArea = DISTRIBUSI_SUB_AREAS.find(s => s.id === selectedDistribusiSubArea) || DISTRIBUSI_SUB_AREAS[0];

  // Resolve current active configuration depending on whether Distribusi is selected
  const isDistribusi = selectedAreaId === 'distribusi';
  const currentKeyPrefix = isDistribusi ? `distribusi-${selectedDistribusiSubArea}` : selectedAreaId;
  const currentAreaDisplayName = isDistribusi ? `Distribusi (${activeSubArea.fullTitle})` : mainArea.name;
  const currentBoxTitle = isDistribusi ? activeSubArea.boxTitle : mainArea.boxTitle;
  const currentDepartment = mainArea.department;
  const currentDefaultPic = isDistribusi ? activeSubArea.defaultPic : mainArea.defaultPic;
  const currentDescription = isDistribusi ? activeSubArea.description : mainArea.description;

  const currentCheckpoints = activeCategory === 'stop6' ? STOP6_CHECKPOINTS : SIX_S_CHECKPOINTS;

  // Format question text with the current area name
  const formatQuestion = (text: string, areaName: string) => {
    return text.replace('{area}', areaName.toLowerCase());
  };

  // Helper key generator
  const getItemKey = (checkpointId: string) => `${currentKeyPrefix}-${activeCategory}-${checkpointId}`;

  // Handle Score Toggle
  const handleSetScore = (checkpointId: string, score: 1 | 0) => {
    const key = getItemKey(checkpointId);
    setScores(prev => ({
      ...prev,
      [key]: score
    }));

    // If score is 0 (Ada potensi bahaya / Tidak terpenuhi), auto-populate draft suggestion if empty
    if (score === 0) {
      const item = currentCheckpoints.find(c => c.id === checkpointId);
      const isItem5R = activeCategory === '6s' || item?.category === '5R';
      setDraftFindings(prev => {
        const existing = prev[key];
        if (!existing || !existing.description) {
          return {
            ...prev,
            [key]: {
              photoUrl: existing?.photoUrl || '',
              description: item?.suggestedFinding || '',
              pic: existing?.pic || (customPicName.trim() || ''),
              assessor: existing?.assessor || (assessorName.trim() || ''),
              priority: existing?.priority || item?.defaultPriority || 'High'
            }
          };
        }
        return prev;
      });
      setAlertInfo({
        message: isItem5R
          ? `⚠️ Poin "${item?.title}" tidak terpenuhi. Silakan isi foto & tekan "Simpan ke Database Temuan" di kolom kanan.`
          : `⚠️ Potensi Bahaya pada "${item?.title}". Silakan isi foto & tekan "Simpan ke Database Temuan" di kolom kanan.`,
        findingId: '',
        factory: selectedFactory
      });
      setTimeout(() => setAlertInfo(null), 5000);
    }
  };

  // Handle Draft Finding Field Change
  const handleUpdateDraft = (checkpointId: string, field: keyof ItemFindingDraft, value: string) => {
    const key = getItemKey(checkpointId);
    setDraftFindings(prev => {
      const existing = prev[key] || {
        photoUrl: '',
        description: '',
        pic: customPicName.trim() || '',
        assessor: assessorName.trim() || '',
        priority: 'High'
      };
      return {
        ...prev,
        [key]: {
          ...existing,
          [field]: value
        }
      };
    });
  };

  // Handle Photo Upload via Camera or File with automatic canvas compression
  const handleFileUpload = async (checkpointId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCompressingId(checkpointId);
      const compressedDataUrl = await compressImageFile(file, 1024, 1024, 0.7);
      handleUpdateDraft(checkpointId, 'photoUrl', compressedDataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          handleUpdateDraft(checkpointId, 'photoUrl', dataUrl);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setCompressingId(null);
    }
  };

  // Quick Preset Sample Photo Picker
  const handlePickPresetPhoto = (checkpointId: string, url: string) => {
    handleUpdateDraft(checkpointId, 'photoUrl', url);
  };

  // Save Finding directly into Global State
  const handleSaveDraftAsFinding = (checkpoint: CheckpointItem) => {
    const key = getItemKey(checkpoint.id);
    const draft = draftFindings[key];

    const description = draft?.description?.trim() || checkpoint.suggestedFinding;
    const photoUrl = draft?.photoUrl || SAMPLE_PHOTO_PRESETS[0].url; // Fallback to safe preset if no camera taken
    const pic = draft?.pic?.trim() || customPicName.trim() || currentDefaultPic;
    const priority = draft?.priority || checkpoint.defaultPriority;
    const findingAssessor = draft?.assessor?.trim() || assessorName.trim() || currentUser.name || 'Assessor Genba';

    const newFindingId = `FND-2026-CHK-${Math.floor(100 + Math.random() * 900)}`;

    const newFinding: InspectionFinding = {
      id: newFindingId,
      factory: selectedFactory,
      date: new Date().toISOString().split('T')[0],
      area: isDistribusi ? `Distribusi - ${activeSubArea.name}` : mainArea.name,
      finding: `[Checksheet ${checkpoint.code} - ${checkpoint.title}] ${description}`,
      category: checkpoint.category,
      pic: pic,
      department: isDistribusi ? 'Distribusi' : mainArea.department,
      correctiveAction: 'Menunggu analisis tindakan korektif PIC & tim Genba',
      status: 'Open',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      attachmentUrl: photoUrl,
      priority: priority,
      inspectorName: findingAssessor,
      recordedBy: findingAssessor,
      weekNumber: 38,
      hierarchyLevel: 'bi-monthly'
    };

    onSaveFinding(newFinding);
    onSelectFactory?.(selectedFactory);

    // Update draft to indicate saved state
    setDraftFindings(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { photoUrl, description, pic, priority }),
        photoUrl,
        description,
        pic,
        assessor: findingAssessor,
        priority,
        savedFindingId: newFindingId,
        savedTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    }));

    // Auto mark score to 0 (Ada potensi bahaya)
    setScores(prev => ({
      ...prev,
      [key]: 0
    }));

    setAlertInfo({
      message: `Temuan #${newFindingId} berhasil dicatat untuk unit "${selectedFactory}"!`,
      findingId: newFindingId,
      factory: selectedFactory
    });
  };

  // Summary Metrics for Active Sheet
  const totalCheckpointsInArea = currentCheckpoints.length;
  let evaluatedCount = 0;
  let safeCount = 0;
  let hazardCount = 0;

  currentCheckpoints.forEach(chk => {
    const key = getItemKey(chk.id);
    const score = scores[key];
    if (score !== undefined) {
      evaluatedCount++;
      if (score === 1) safeCount++;
      if (score === 0) hazardCount++;
    }
  });

  // Calculate findings recorded in this area
  const areaFindings = findings.filter(f => 
    f.area.toLowerCase().includes(currentAreaDisplayName.toLowerCase()) || 
    f.department.toLowerCase().includes(currentDepartment.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top Banner Alert if any */}
      {alertInfo && (
        <div className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in border-2 ${
          alertInfo.findingId 
            ? 'bg-emerald-50 border-emerald-500/50 text-emerald-950' 
            : 'bg-amber-50 border-amber-500/50 text-amber-950'
        }`}>
          <div className="flex items-start sm:items-center gap-3">
            <span className={`p-2 rounded-xl text-white shrink-0 shadow-xs ${
              alertInfo.findingId ? 'bg-emerald-600' : 'bg-amber-600'
            }`}>
              {alertInfo.findingId ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </span>
            <div>
              <p className="text-xs sm:text-sm font-black">
                {alertInfo.message}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5 font-medium">
                {alertInfo.findingId ? (
                  <span>
                    Temuan otomatis tersimpan di database unit <strong className="font-extrabold underline">{alertInfo.factory}</strong>.
                  </span>
                ) : (
                  <span>
                    Unit audit aktif: <strong className="font-extrabold">{alertInfo.factory}</strong>.
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {alertInfo.findingId && onNavigateToFactoryDashboard && (
              <button
                type="button"
                onClick={() => onNavigateToFactoryDashboard(alertInfo.factory)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Buka Factory Dashboard ({alertInfo.factory})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button 
              onClick={() => setAlertInfo(null)}
              className="p-1.5 opacity-70 hover:opacity-100 font-bold hover:bg-black/5 rounded-lg cursor-pointer text-base leading-none"
              title="Tutup notifikasi"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Control Bar: Factory Selection, Assessor Input & Print */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unit Pabrik:</span>
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['AOI 1', 'AOI 2', 'AOI 3', 'DC'] as FactoryOption[]).map(fac => (
                <button
                  key={fac}
                  onClick={() => setSelectedFactory(fac)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedFactory === fac
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fac}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onGoToInspectionTable && (
              <button
                onClick={onGoToInspectionTable}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-600" />
                <span>Lihat Tabel Temuan ({findings.length})</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Cetak lembar checksheet ke kertas atau PDF"
            >
              <Printer className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Cetak Checksheet (Print)</span>
            </button>
          </div>
        </div>

        {/* KOLOM PENGISIAN ASSESSOR & NAMA PIC (Input Teks Bebas) */}
        <div className="pt-3 border-t border-amber-200/80 bg-amber-50/60 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 sm:p-5 rounded-b-2xl space-y-3">
          {/* Row 1: Assessor Name */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <label htmlFor="input-assessor-name" className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-500 text-slate-950 font-black">
                  <UserCheck className="w-4 h-4" />
                </span>
                <span>Assessor / Inspektor Penemu Temuan:</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Ketik nama penemu temuan untuk ditampilkan langsung di dashboard pemantauan.
              </p>
            </div>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  id="input-assessor-name"
                  type="text"
                  value={assessorName}
                  onChange={(e) => setAssessorName(e.target.value)}
                  placeholder="Ketik nama assessor penemu temuan..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 border-2 border-amber-400 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-600 shadow-xs"
                />
                <UserCheck className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Row 2: PIC Area Name (Dibawah Textbox Nama Assessor) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-amber-200/60">
            <div className="space-y-0.5">
              <label htmlFor="input-pic-name" className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                <span className="p-1 rounded-lg bg-blue-600 text-white font-black">
                  <User className="w-4 h-4" />
                </span>
                <span>Nama PIC (Penanggung Jawab Area):</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Ketik nama PIC penanggung jawab perbaikan (default: {currentDefaultPic}).
              </p>
            </div>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  id="input-pic-name"
                  type="text"
                  value={customPicName}
                  onChange={(e) => setCustomPicName(e.target.value)}
                  placeholder={`Ketik nama PIC (contoh: ${currentDefaultPic.split(' ')[0]})...`}
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 border-2 border-blue-400 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 shadow-xs"
                />
                <User className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Area Selection Cards Sesuai Instruksi User:
          1. Warehouse, 2. Cutting, 3. Distribusi, 4. Sewing, 5. Finish Good */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <span>5 Area Inspeksi Genba / (Select 5 Production Areas)</span>
            <span className="text-[10px] font-normal text-slate-400 font-mono">(Klik area untuk ganti checksheet)</span>
          </label>
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {evaluatedCount}/{totalCheckpointsInArea} Poin Terisi ({safeCount} {activeCategory === '6s' ? 'Terpenuhi' : 'Aman'} &bull; {hazardCount} {activeCategory === '6s' ? 'Tidak Terpenuhi' : 'Bahaya'})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CHECK_AREAS.map((area, idx) => {
            const isSelected = area.id === selectedAreaId;
            const AreaIcon = area.icon;

            // count evaluations in this specific area
            let areaEval = 0;
            currentCheckpoints.forEach(chk => {
              const chkKey = area.id === 'distribusi'
                ? `distribusi-${selectedDistribusiSubArea}-${activeCategory}-${chk.id}`
                : `${area.id}-${activeCategory}-${chk.id}`;
              if (scores[chkKey] !== undefined) {
                areaEval++;
              }
            });

            return (
              <button
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-800'
                  }`}>
                    <AreaIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    Area 0{idx + 1}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                  {area.name}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-1 mt-1 flex items-center gap-1.5 font-medium">
                  <span className="text-slate-400 font-normal">Dept:</span>
                  <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] border ${area.badgeStyle}`}>
                    {area.department}
                  </span>
                </p>

                {area.hasSubAreas && (
                  <p className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                    3 Sub: {activeSubArea.name}
                  </p>
                )}

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Status Cek:</span>
                  <span className={`font-bold font-mono ${
                    areaEval === totalCheckpointsInArea ? 'text-emerald-600' : areaEval > 0 ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    {areaEval}/{totalCheckpointsInArea} Poin
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3 Sub-Area Buttons untuk Distribusi: "PPA", "Supermarket", dan "Heat Transfer" */}
        {isDistribusi && (
          <div className="p-4 bg-emerald-50/90 rounded-2xl border-2 border-emerald-300 shadow-xs space-y-2 animate-in fade-in slide-in-from-top-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                    Pilih Spesifik Area pada Distribusi:
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Silakan pilih sub-area distribusi untuk memuat checksheet &amp; input foto temuan spesifik:
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 border border-emerald-300">
                Aktif: {activeSubArea.fullTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {DISTRIBUSI_SUB_AREAS.map((sub, sIdx) => {
                const isSubSelected = selectedDistribusiSubArea === sub.id;
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedDistribusiSubArea(sub.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSubSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-500/30'
                        : 'bg-white hover:bg-emerald-100/60 text-emerald-900 border-emerald-200 shadow-2xs'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSubSelected ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <SubIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase ${isSubSelected ? 'text-emerald-200' : 'text-emerald-600'}`}>
                          Sub-Area 0{sIdx + 1}
                        </span>
                        {isSubSelected && (
                          <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded border border-emerald-400">
                            Dipilih
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-black truncate">
                        {sub.name}
                      </h5>
                      <p className={`text-[10px] truncate ${isSubSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {sub.fullTitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Checksheet Form Card (Styled to match the physical checksheet image uploaded by the user) */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-5 sm:p-8 space-y-6">
        
        {/* TOP TITLE BOX: EXACTLY MATCHING USER ATTACHED IMAGE (Bordered Framed Box) */}
        <div className="flex flex-col items-center justify-center pt-2 pb-4 border-b border-slate-200/80">
          <div className="border-2 border-slate-900 px-8 sm:px-14 py-2.5 bg-white shadow-xs">
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-wider text-center font-mono uppercase">
              {currentBoxTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-2 flex-wrap justify-center">
            <span>PT Apparel One Indonesia &bull; Unit: <strong className="text-slate-800">{selectedFactory}</strong> &bull; Departemen:</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[11px] border ${mainArea.badgeStyle}`}>
              {currentDepartment}
            </span>
            {isDistribusi && (
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                Sub: {activeSubArea.fullTitle}
              </span>
            )}
          </p>
        </div>

        {/* Section Heading & Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {activeCategory === 'stop6' ? 'Safety (STOP-6)' : 'Framework 6S (Housekeeping & K3)'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-300">
              Formulir Acuan Genba
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveCategory('stop6')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'stop6'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Safety (STOP-6)
            </button>
            <button
              onClick={() => setActiveCategory('6s')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === '6s'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Framework 6S
            </button>
          </div>
        </div>

        {/* Table / List of Checklist Points & Input Temuan Side-by-Side (Sesuai Gambar) */}
        <div className="space-y-6 pt-2">
          {currentCheckpoints.map((chk) => {
            const key = getItemKey(chk.id);
            const currentScore = scores[key];
            const draft = draftFindings[key];
            const isHazard = currentScore === 0;
            const isSafe = currentScore === 1;
            const is5R = activeCategory === '6s' || chk.category === '5R';

            return (
              <div 
                key={chk.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isHazard
                    ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                    : isSafe
                    ? 'border-emerald-200 bg-emerald-50/15'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* LEFT SIDE: Checkpoint Title, Question, and the 2 Score Boxes (1 vs 0) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Header: Code & Title */}
                    <div className="flex items-center gap-2.5">
                      <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                        {chk.code}
                      </span>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 italic">
                        {chk.title}
                      </h3>
                      {draft?.savedFindingId && (
                        <div className="flex flex-col items-end gap-0.5 ml-auto">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Temuan #{draft.savedFindingId}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-amber-600" />
                            Penemu: <strong className="text-slate-800">{draft.assessor || assessorName}</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Question (Indonesian & Blue Italic English matching image!) */}
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        {formatQuestion(chk.questionId, currentAreaDisplayName)}
                      </p>
                      <p className="text-xs italic text-blue-600 font-normal leading-snug">
                        {formatQuestion(chk.questionEn, currentAreaDisplayName)}
                      </p>
                    </div>

                    {/* Two Score Boxes: 1 (Aman / Ya Terpenuhi) vs 0 (Bahaya / Tidak Terpenuhi) */}
                    <div className="pt-2 flex flex-wrap items-start gap-4 sm:gap-6">
                      
                      {/* Box 1: Ya Terpenuhi (5R) / Tidak Ada Potensi Bahaya (STOP-6) */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSetScore(chk.id, 1)}
                          className={`w-16 sm:w-20 border-2 rounded-sm overflow-hidden text-center transition-all cursor-pointer ${
                            isSafe
                              ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                              : 'border-slate-800 hover:border-emerald-500'
                          }`}
                        >
                          <div className={`border-b-2 py-0.5 text-xs font-black italic font-mono ${
                            isSafe ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-900 border-slate-800'
                          }`}>
                            1
                          </div>
                          <div className={`h-9 sm:h-10 flex items-center justify-center font-bold text-sm ${
                            isSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-slate-400'
                          }`}>
                            {isSafe ? <Check className="w-5 h-5 text-emerald-700 stroke-[3]" /> : ''}
                          </div>
                        </button>

                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-900">
                            {is5R ? 'ya, terpenuhi' : 'tidak ada potensi bahaya'}
                          </p>
                          <p className="text-[11px] text-blue-600 italic leading-tight">
                            {is5R ? 'yes, fulfilled / compliant' : 'no, there are no potential for harm'}
                          </p>
                        </div>
                      </div>

                      {/* Box 0: Tidak Terpenuhi (5R) / Ya, Ada Potensi Bahaya (STOP-6) */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSetScore(chk.id, 0)}
                          className={`w-16 sm:w-20 border-2 rounded-sm overflow-hidden text-center transition-all cursor-pointer ${
                            isHazard
                              ? 'border-rose-600 ring-2 ring-rose-500/30'
                              : 'border-slate-800 hover:border-rose-500'
                          }`}
                        >
                          <div className={`border-b-2 py-0.5 text-xs font-black italic font-mono ${
                            isHazard ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-900 border-slate-800'
                          }`}>
                            0
                          </div>
                          <div className={`h-9 sm:h-10 flex items-center justify-center font-bold text-sm ${
                            isHazard ? 'bg-rose-100 text-rose-800' : 'bg-white text-slate-400'
                          }`}>
                            {isHazard ? <AlertTriangle className="w-5 h-5 text-rose-600 stroke-[2.5]" /> : ''}
                          </div>
                        </button>

                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-900">
                            {is5R ? 'tidak terpenuhi' : 'ya, ada potensi bahaya'}
                          </p>
                          <p className="text-[11px] text-blue-600 italic leading-tight">
                            {is5R ? 'not fulfilled / non-compliant' : 'yes, there is potential for harm'}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* RIGHT SIDE: "Item temuan" Input Box (Sesuai Kotak di Gambar) */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 italic tracking-wide">
                        Item temuan
                      </span>
                      {draft?.savedFindingId ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                          ✓ Tersimpan di Genba ({draft.savedTime || 'Terkirim'})
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          {isHazard ? '⚠️ Perlu Dokumentasi Foto' : 'Opsional jika ada catatan'}
                        </span>
                      )}
                    </div>

                    {/* Box Frame container (matching the rectangle border in the image) */}
                    <div className={`border-2 rounded-xl p-3 bg-white space-y-3 transition-colors ${
                      isHazard ? 'border-amber-400 ring-2 ring-amber-300/30' : 'border-slate-700'
                    }`}>
                      
                      {/* Photo Capture & Upload Box */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                          <span>Foto Bukti Temuan (Before):</span>
                          {draft?.photoUrl && (
                            <button
                              type="button"
                              onClick={() => handleUpdateDraft(chk.id, 'photoUrl', '')}
                              className="text-[10px] text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Hapus Foto
                            </button>
                          )}
                        </label>

                        {draft?.photoUrl ? (
                          <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video group">
                            <img 
                              src={draft.photoUrl} 
                              alt="Bukti Temuan" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {onSelectPhotoProof && draft.savedFindingId && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const match = findings.find(f => f.id === draft.savedFindingId);
                                    if (match) onSelectPhotoProof(match);
                                  }}
                                  className="px-2 py-1 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold rounded shadow-xs"
                                >
                                  Perbesar Foto
                                </button>
                              )}
                              <label className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded shadow-xs cursor-pointer">
                                Ganti Foto
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) => handleFileUpload(chk.id, e)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-300 rounded-lg p-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-center">
                            <div className="flex items-center justify-center gap-2">
                              {/* Camera Input */}
                              <label className={`px-3 py-1.5 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer ${
                                compressingId === chk.id ? 'bg-amber-700 opacity-80 cursor-wait' : 'bg-amber-600 hover:bg-amber-700'
                              }`}>
                                {compressingId === chk.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Camera className="w-3.5 h-3.5" />
                                )}
                                <span>{compressingId === chk.id ? 'Memproses Foto...' : 'Kamera HP'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) => handleFileUpload(chk.id, e)}
                                  className="hidden"
                                  disabled={compressingId === chk.id}
                                />
                              </label>

                              {/* Upload File */}
                              <label className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Pilih Gambar</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(chk.id, e)}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Preset Sample Quick Button */}
                            <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-center gap-1">
                              <span>Atau coba foto contoh:</span>
                              <button
                                type="button"
                                onClick={() => handlePickPresetPhoto(chk.id, SAMPLE_PHOTO_PRESETS[0].url)}
                                className="text-amber-700 underline font-semibold hover:text-amber-900 cursor-pointer"
                              >
                                Preset K3/Kabel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Uraian Temuan */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Catatan / Uraian Temuan:
                        </label>
                        <textarea
                          rows={2}
                          value={draft?.description || ''}
                          onChange={(e) => handleUpdateDraft(chk.id, 'description', e.target.value)}
                          placeholder={chk.suggestedFinding}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white placeholder:text-slate-400 leading-relaxed"
                        />
                      </div>

                      {/* Assessor Penemu Field */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-0.5 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-800">
                            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                            Assessor / Penemu Temuan:
                          </span>
                          <span className="text-[9px] text-amber-700 font-semibold bg-amber-50 px-1 rounded border border-amber-200">
                            Masuk ke Dashboard
                          </span>
                        </label>
                        <input
                          type="text"
                          value={draft?.assessor || assessorName}
                          onChange={(e) => handleUpdateDraft(chk.id, 'assessor', e.target.value)}
                          placeholder="Nama Assessor yang menemukan temuan..."
                          className="w-full px-2.5 py-1.5 text-xs font-bold border border-amber-300 rounded-lg bg-amber-50/30 text-slate-900 focus:bg-white focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      {/* PIC & Priority Selector */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            PIC Area:
                          </label>
                          <input
                            type="text"
                            value={draft?.pic !== undefined ? draft.pic : (customPicName || '')}
                            onChange={(e) => handleUpdateDraft(chk.id, 'pic', e.target.value)}
                            placeholder="Ketik nama PIC..."
                            className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded bg-white text-slate-900 placeholder:text-slate-400 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                            Prioritas:
                          </label>
                          <select
                            value={draft?.priority || chk.defaultPriority}
                            onChange={(e) => handleUpdateDraft(chk.id, 'priority', e.target.value as PriorityLevel)}
                            className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded bg-white font-medium"
                          >
                            <option value="Critical">Critical (Sangat Kritis)</option>
                            <option value="High">High (Tinggi)</option>
                            <option value="Medium">Medium (Sedang)</option>
                            <option value="Low">Low (Rendah)</option>
                          </select>
                        </div>
                      </div>

                      {/* Tombol Simpan ke Temuan Genba */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleSaveDraftAsFinding(chk)}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                            draft?.savedFindingId
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : isHazard
                              ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400/40'
                              : 'bg-amber-600 hover:bg-amber-700 text-white'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>
                            {draft?.savedFindingId
                              ? `✓ Masuk di Dashboard (#${draft.savedFindingId})`
                              : 'Simpan ke Database Temuan'}
                          </span>
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Footer of the checksheet: Sign-off & summary */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">Hasil Evaluasi Checksheet:</span>
            <p className="text-sm font-extrabold text-slate-900 mt-1">
              {safeCount} Poin Aman &bull; {hazardCount} Poin Bahaya
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Skor Keselamatan K3: {totalCheckpointsInArea > 0 ? Math.round((safeCount / totalCheckpointsInArea) * 100) : 100}%
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500">Temuan Tercatat di Area Ini:</span>
            <p className="text-sm font-extrabold text-amber-700 mt-1">
              {areaFindings.length} Temuan Aktif
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tercatat otomatis ke dashboard &amp; tabel inspeksi.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Verifikator &amp; Tanggal:</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {currentUser.name} ({new Date().toLocaleDateString('id-ID')})
              </p>
            </div>
            {onGoToInspectionTable && (
              <button
                type="button"
                onClick={onGoToInspectionTable}
                className="text-amber-700 hover:text-amber-800 font-bold text-[11px] flex items-center gap-1 mt-2 cursor-pointer"
              >
                <span>Lihat semua temuan di Tabel Inspeksi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
