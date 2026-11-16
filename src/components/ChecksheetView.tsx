import React, { useState, useEffect } from 'react';
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
  Loader2,
  Lock,
  Search,
  Wrench,
  RotateCcw,
  Coffee,
  DoorOpen,
  FileText,
  ShieldCheck,
  Clock,
  Bell
} from 'lucide-react';
import { InspectionFinding, FactoryOption, FindingCategory, PriorityLevel, UserAccount } from '../types';
import { compressImageFile } from '../utils/imageCompressor';

export type ChecksheetAreaId = 'warehouse' | 'cutting' | 'distribusi' | 'sewing' | 'finish-good';
export type DistribusiSubAreaId = 'ppa' | 'supermarket' | 'heat-transfer';
export type WarehouseSubAreaId = 'warehouse-accessories' | 'warehouse-fabric';

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

export interface WarehouseSubAreaConfig {
  id: WarehouseSubAreaId;
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
  pillar?: string;
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
    description: 'Departemen Gudang penyimpanan: Warehouse Accessories dan Warehouse Fabric.',
    hasSubAreas: true
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

// 2 Spesifik Sub-Area Warehouse Sesuai Instruksi User:
// 1. Warehouse Accessories, 2. Warehouse Fabric
const WAREHOUSE_SUB_AREAS: WarehouseSubAreaConfig[] = [
  {
    id: 'warehouse-accessories',
    name: 'Warehouse Accessories',
    fullTitle: 'Warehouse Accessories (Trims, Label & Metal Detector)',
    boxTitle: 'WAREHOUSE ACCESSORIES AREA',
    defaultPic: 'Anita Wijaya (SPV Accessories & Trims Warehouse)',
    icon: Package,
    description: 'Penyimpanan accessories, trims, zipper, button, benang, woven label, kancing, dan metal detector check.'
  },
  {
    id: 'warehouse-fabric',
    name: 'Warehouse Fabric',
    fullTitle: 'Warehouse Fabric (Roll Kain, Staging & Relaxing)',
    boxTitle: 'WAREHOUSE FABRIC AREA',
    defaultPic: 'Agus Pratama (SPV Fabric Roll Storage & Logistik)',
    icon: Warehouse,
    description: 'Penerimaan dan penyimpanan roll kain utama, rak staging kain, relaksasi kain, dan jalur forklift/pallet.'
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

// 10 Poin Pengecekan Khusus Warehouse pada Framework 6S
export const WAREHOUSE_6S_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'wh-6s-1',
    code: '1',
    title: 'Area Penerimaan & Waiting Inspection',
    icon: Layers,
    category: '5R',
    questionId: 'Area penerimaan dan waiting inspection material terpisah dengan tanda area yang jelas',
    questionEn: '(Separate material receiving and waiting inspection areas are available with clearly marked areas)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'wh-6s-2',
    code: '2',
    title: 'Penyimpanan Reject Material Terkunci',
    icon: Lock,
    category: '5R',
    questionId: 'Reject material diletakkan terpisah, tertutup, terkunci, dan datanya sesuai logbook',
    questionEn: '(Reject material is placed separately, segregated, locked, and has the same amount as listed in logbook)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'wh-6s-3',
    code: '3',
    title: 'Pemeriksaan Metal Detector Accessories',
    icon: Search,
    category: 'Quality',
    questionId: 'Semua accessories dicek dengan Metal Detector (menyesuaikan dengan requirement buyer)',
    questionEn: '(All accessories must be checked by Metal Detector (according to buyer\'s requirements))',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'wh-6s-4',
    code: '4',
    title: 'Peralatan Bantu Metal, Toolbox & Logbook',
    icon: Wrench,
    category: '5R',
    questionId: 'Peralatan bantu kerja berbahan metal di letakkan pada toolbox/ shadows box, terkunci, list alat sesuai, dokumentasi log book jelas.',
    questionEn: '(Metal work tools are placed in the toolbox/shadows box, locked, tool list is appropriate, log book documentation is clear)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'wh-6s-5',
    code: '5',
    title: 'Area Return Material dari Sewing',
    icon: RotateCcw,
    category: '5R',
    questionId: 'Area return material  (pengembalian dari sewing) memiliki visualisasi jelas disertai dengan ID PO tersebut dan tertata rapi',
    questionEn: '(The material return area has a clear visualization accompanied by the ID PO and is neatly arranged)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'wh-6s-6',
    code: '6',
    title: 'Penempatan Alat Kerja, Botol & Alat Kebersihan',
    icon: Coffee,
    category: '5R',
    questionId: 'Semua peralatan bantu kerja, botol minum dan alat kebersihan diletakkan pada tempat yang disediakan setelah digunakan',
    questionEn: '(All working tools , drinking bottles and housekeeping tools are placed in the space provided after use)',
    defaultPriority: 'Low',
    suggestedFinding: ''
  },
  {
    id: 'wh-6s-7',
    code: '7',
    title: 'Kebersihan Debu, Sarang Laba-laba & Kotoran',
    icon: Sparkles,
    category: '5R',
    questionId: 'Seluruh area bersih dari sarang laba-laba, debu dan kotoran',
    questionEn: '(The entire area is clean from cobwebs, dust and dirt.)',
    defaultPriority: 'Low',
    suggestedFinding: ''
  },
  {
    id: 'wh-6s-8',
    code: '8',
    title: 'Jalur Evakuasi Bebas Rintangan (Clear Path)',
    icon: DoorOpen,
    category: 'Safety Stop 6',
    questionId: 'Seluruh jalur evakuasi clear tidak terhalang material, palet, troli, box atau karton',
    questionEn: '(All evacuation routes are clear and not obstructed by materials, pallets, trolley, box or carton)',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },
  {
    id: 'wh-6s-9',
    code: '9',
    title: 'Work Instruction (WI) untuk Semua Proses',
    icon: FileText,
    category: '5R',
    questionId: 'Ada WI (Work Instruction) untuk semua proses kerja (penempatan tersentral/ atau per area). Terlihat jelas dan mudah dimengerti',
    questionEn: '(There are WI (Work Instruction) for all work processes (placed centralized / per area). Looks clear and easy to understand)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'wh-6s-10',
    code: '10',
    title: 'Kondisi & Perawatan Rak / Peralatan',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Apakah seluruh rak / peralatan terawat dan tidak ditemukan kerusakan?',
    questionEn: '(Are all shelves/equipment maintained and are there no damages found?)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  }
];

// 12 Poin Pengecekan Khusus Warehouse Fabric pada Framework 6S Sesuai Instruksi User
export const WAREHOUSE_FABRIC_6S_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'wh-fab-1',
    code: '1',
    title: 'Area Penerimaan & Waiting Inspection',
    icon: Layers,
    category: '5R',
    questionId: 'Area penerimaan dan waiting inspection material terpisah dengan tanda area yang jelas',
    questionEn: '(Separate material receiving and waiting inspection areas are available with clearly marked areas)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-2',
    code: '2',
    title: 'Penyimpanan Reject Material Terkunci',
    icon: Lock,
    category: '5R',
    questionId: 'Reject material diletakkan terpisah, tertutup, terkunci, dan datanya sesuai logbook',
    questionEn: '(Reject material is placed separately, segregated, locked, and has the same amount as listed in logbook)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-3',
    code: '3',
    title: 'Pemisahan Material Fast, Slow Moving & >2 Tahun',
    icon: Clock,
    category: '5R',
    questionId: 'Material fast moving, slow moving dan lebih dari 2 tahun terpisah',
    questionEn: '(Fast moving, slow moving and more than 2 years materials are separated)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-4',
    code: '4',
    title: 'Peralatan Bantu Metal, Toolbox & Logbook',
    icon: Wrench,
    category: '5R',
    questionId: 'Peralatan bantu kerja berbahan metal di letakkan pada toolbox/ shadows box, terkunci, list alat sesuai, dokumentasi log book jelas.',
    questionEn: '(Metal work tools are placed in the toolbox/shadows box, locked, tool list is appropriate, log book documentation is clear)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-5',
    code: '5',
    title: 'Area Return Material dari Sewing (ID Item Fabric)',
    icon: RotateCcw,
    category: '5R',
    questionId: 'Area return material (pengembalian dari sewing) memiliki visualisasi jelas disertai dengan ID item Fabric tersebut dan tertata rapi',
    questionEn: '(The material return area has a clear visualization accompanied by the ID of the fabric item and is neatly arranged)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-6',
    code: '6',
    title: 'Penempatan Forklift, Botol Minum & Alat Kebersihan',
    icon: Coffee,
    category: '5R',
    questionId: 'Semua peralatan bantu (forklift), botol minum dan alat kebersihan diletakkan pada tempat yang disediakan setelah digunakan',
    questionEn: '(All working tools, handling equipment (forklifts), drinking bottles and housekeeping tools are placed in the space provided after use)',
    defaultPriority: 'Low',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-7',
    code: '7',
    title: 'Roll Fabric Tertutup Plastik',
    icon: ShieldCheck,
    category: '5R',
    questionId: 'Semua roll fabric tertutup plastik',
    questionEn: '(All fabric rolls are covered)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-8',
    code: '8',
    title: 'Kebersihan Debu, Sarang Laba-laba & Kotoran',
    icon: Sparkles,
    category: '5R',
    questionId: 'Seluruh area bersih dari sarang laba-laba, debu dan kotoran',
    questionEn: '(The entire area is clean from cobwebs, dust and dirt.)',
    defaultPriority: 'Low',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-9',
    code: '9',
    title: 'Jalur Evakuasi Bebas Rintangan (Clear Path)',
    icon: DoorOpen,
    category: 'Safety Stop 6',
    questionId: 'Seluruh jalur evakuasi clear tidak terhalang material, palet, troli, box atau karton',
    questionEn: '(All evacuation routes are clear and not obstructed by materials, pallets, trolley, box or carton)',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-10',
    code: '10',
    title: 'Work Instruction (WI) untuk Semua Proses',
    icon: FileText,
    category: '5R',
    questionId: 'Ada WI (Work Instruction) untuk semua proses kerja (penempatan tersentral/ atau per area). Terlihat jelas dan mudah dimengerti',
    questionEn: '(There are WI (Work Instruction) for all work processes (placed centralized / per area). Looks clear and easy to understand)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-11',
    code: '11',
    title: 'Record Proses Relax & Tidak Menumpuk Kain',
    icon: ClipboardCheck,
    category: 'Quality',
    questionId: 'Semua proses relax memiliki record yang jelas dan kain tidak ditumpuk setelah proses relax',
    questionEn: '(All relax processes have clear records and fabrics are not stacked after the relax process)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-12',
    code: '12',
    title: 'Kondisi Palet, Rak & Trolley Bebas Snagging',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Semua palet, rak, dan trolley dalam kondisi baik, tidak terkelupas sehingga tidak berpotensi snagging',
    questionEn: '(All pallets, racks and trolleys are in good condition, not peeled so there is no risk of snagging)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  }
];

// 13 Point Checksheet Framework 6S Khusus Area Cutting (Sort, Set in order, Shine, Standardize, Sustain)
export const CUTTING_6S_CHECKPOINTS: CheckpointItem[] = [
  // --- SORT ---
  {
    id: 'cut-6s-1',
    code: '1',
    pillar: 'Sort',
    title: 'Identifikasi & Isolasi Mesin Tidak Berfungsi',
    icon: Wrench,
    category: '5R',
    questionId: 'Jika terdapat mesin yang tidak berfungsi diidentifikasi dan diisolasi.',
    questionEn: '(If there are malfunctioning machines are identified and isolated.)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'cut-6s-2',
    code: '2',
    pillar: 'Sort',
    title: 'Identifikasi Area QC, Numbering dan Bundling',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Area QC,numbering dan bundling teridentifikasi dengan jelas',
    questionEn: '(QC, numbering and bundling areas are clearly identified)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'cut-6s-3',
    code: '3',
    pillar: 'Sort',
    title: 'Pengikatan Aman Gunting / Cekris / Alat ke Mesin',
    icon: Scissors,
    category: '5R',
    questionId: 'Semua gunting / cekris / alat diikat dengan aman ke mesin untuk menghindari kehilangan atau kontaminasi garmen',
    questionEn: '(All scissors / snips / tools are tied securely to machine to avoid loss or garment contamination)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },

  // --- SET IN ORDER ---
  {
    id: 'cut-6s-4',
    code: '4',
    pillar: 'Set in order',
    title: 'Kerapian Kepala Kain & Pola dalam Lemari Penyimpanan',
    icon: Package,
    category: '5R',
    questionId: 'Kepala kain,pola tertata rapi didalam lemari / tempat penyimpanan, dilengkapi dengan identitas',
    questionEn: '(Roll ends are store well organized with clear identity)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'cut-6s-5',
    code: '5',
    pillar: 'Set in order',
    title: 'Peralatan Logam di Toolbox / Shadows Box & Logbook',
    icon: Lock,
    category: '5R',
    questionId: 'Peralatan bantu kerja berbahan metal di letakkan pada toolbox/ shadows box, terkunci, list alat sesuai, dokumentasi log book jelas.',
    questionEn: '(Metal work tools are placed in the toolbox/shadows box, locked, tool list is appropriate, log book documentation is clear)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'cut-6s-6',
    code: '6',
    pillar: 'Set in order',
    title: 'Penempatan Alat Kerja, Botol Minum & Alat Kebersihan',
    icon: Coffee,
    category: '5R',
    questionId: 'Semua peralatan kerja (penjepit kain, alat numbering), botol minum dan alat kebersihan diletakkan pada tempat yang disediakan setelah digunakan',
    questionEn: '(All work equipment (fabric clamps, numbering tools), drinking bottles and housekeepping tools are placed in the space provided for them after use)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- SHINE ---
  {
    id: 'cut-6s-7',
    code: '7',
    pillar: 'Shine',
    title: 'Penyimpanan Hasil Potongan (Panel) Bebas Kontak Lantai',
    icon: Shirt,
    category: '5R',
    questionId: 'Hasil potongan (panel) di dalam polybag tidak diletakkan langsung bersentuhan dengan lantai',
    questionEn: '(Panels are stored inside polybag and is not directly touching the floor)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'cut-6s-8',
    code: '8',
    pillar: 'Shine',
    title: 'Kebersihan Seluruh Area dari Debu, Kotoran & Sarang Laba-laba',
    icon: Sparkles,
    category: '5R',
    questionId: 'Seluruh area bersih dari sarang laba-laba, debu dan kotoran',
    questionEn: '(The entire area is clean from cobwebs, dust and dirt.)',
    defaultPriority: 'Low',
    suggestedFinding: ''
  },
  {
    id: 'cut-6s-9',
    code: '9',
    pillar: 'Shine',
    title: 'Jalur Evakuasi Bebas Rintangan (Clear Path)',
    icon: DoorOpen,
    category: 'Safety Stop 6',
    questionId: 'Seluruh jalur evakuasi clear tidak terhalang material, palet, troli, box atau karton',
    questionEn: '(All evacuation routes are clear and not obstructed by materials, pallets, trolley, box or carton)',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },

  // --- STANDARDIZE ---
  {
    id: 'cut-6s-10',
    code: '10',
    pillar: 'Standardize',
    title: 'Work Instruction (WI) untuk Semua Proses Kerja',
    icon: FileText,
    category: '5R',
    questionId: 'Ada WI (Work Instruction) untuk semua proses kerja (penempatan tersentral/ atau per area). Terlihat jelas dan mudah dimengerti',
    questionEn: '(There are WI (Work Instruction) for all work processes (placed centralized / per area). Looks clear and easy to understand)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'cut-6s-11',
    code: '11',
    pillar: 'Standardize',
    title: 'Ketersediaan Sampel, Colour Continuity Card & Approval Side',
    icon: ClipboardCheck,
    category: 'Quality',
    questionId: 'Sampel, colour continuity card dan approval side tersedia dan terupdate sesuai dengan jalannya produksi',
    questionEn: '(Samples, color continuity cards and approval sides are available and updated according to the production process)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- SUSTAIN ---
  {
    id: 'cut-6s-12',
    code: '12',
    pillar: 'Sustain',
    title: 'Kondisi Marker, Troli & Box Kain Bebas Snagging',
    icon: Layers,
    category: '5R',
    questionId: 'Kondisi penyimpanan marker, troli kain, dan box penyimpanan kain yang sudah terpotong tidak ada kerusakan yang berpotensi snagging',
    questionEn: '(Pattern storage, fabric trolley, and fabric box for aftercut cloth does not have any damage which may cause snagging)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'cut-6s-13',
    code: '13',
    pillar: 'Sustain',
    title: 'Kondisi Baik Sarung Tangan Besi (Chainmail Gloves)',
    icon: ShieldCheck,
    category: 'Safety Stop 6',
    questionId: 'Sarung tangan besi yang digunakan dalam kondisi yang baik',
    questionEn: '(Chainmail gloves are in a good condition)',
    defaultPriority: 'High',
    suggestedFinding: ''
  }
];

// 11 Point Checksheet Framework 6S Khusus Area Distribusi - PPA Auto & Manual (Sort, Set in order, Shine, Standardize, Sustain)
export const DISTRIBUSI_PPA_6S_CHECKPOINTS: CheckpointItem[] = [
  // --- SORT ---
  {
    id: 'ppa-6s-1',
    code: '1',
    pillar: 'Sort',
    title: 'Pemisahan Area OK dan Reject Tervisualisasi Jelas',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Area jelas tervisualisasi untuk OK dan Reject terpisah',
    questionEn: '(Clearly visualized areas for OK and Reject are separated)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'ppa-6s-2',
    code: '2',
    pillar: 'Sort',
    title: '1 Operator Sewing 1 Gunting Beridentitas & Terikat di Mesin',
    icon: Scissors,
    category: '5R',
    questionId: 'Setiap operator sewing hanya memiliki satu gunting, memiliki identitas dan terikat di mesin.',
    questionEn: '(Every operator have only 1 scissor, have an identity on scissor and tied on machine)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'ppa-6s-3',
    code: '3',
    pillar: 'Sort',
    title: 'Bebas Cekris / Gunting di Area QC EndLine PPA',
    icon: ShieldAlert,
    category: '5R',
    questionId: 'Tidak ditemukan cekris/ gunting di area QC EndLine PPA',
    questionEn: '(No scissors were found in QC EndLine PPA area)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },

  // --- SET IN ORDER ---
  {
    id: 'ppa-6s-4',
    code: '4',
    pillar: 'Set in order',
    title: 'Peralatan Metal Line PPA dalam Tool Box & Sesuai Daftar',
    icon: Lock,
    category: '5R',
    questionId: 'Line PPA memiliki peralatan metal yang tersimpan didalam tool box, isi dan aktual tool digunakan sesuai dengan daftar.',
    questionEn: '(The PPA line has metal tools stored in the tool box, the contents and actual tools used are in accordance with the list.)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'ppa-6s-5',
    code: '5',
    pillar: 'Set in order',
    title: 'Penempatan Alat Kerja, Botol Minum & Alat Kebersihan',
    icon: Coffee,
    category: '5R',
    questionId: 'Semua peralatan bantu kerja, botol minum dan alat kebersihan diletakkan pada tempat yang disediakan setelah digunakan',
    questionEn: '(All working tools , drinking bottles and housekeeping tools are placed in the space provided after use)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- SHINE ---
  {
    id: 'ppa-6s-6',
    code: '6',
    pillar: 'Shine',
    title: 'Kebersihan Seluruh Area dari Sarang Laba-laba, Debu & Kotoran',
    icon: Sparkles,
    category: '5R',
    questionId: 'Seluruh area bersih dari sarang laba-laba, debu dan kotoran',
    questionEn: '(The entire area is clean from cobwebs, dust and dirt.)',
    defaultPriority: 'Low',
    suggestedFinding: ''
  },
  {
    id: 'ppa-6s-7',
    code: '7',
    pillar: 'Shine',
    title: 'Jalur Evakuasi Bebas Hambatan (Clear Path)',
    icon: DoorOpen,
    category: 'Safety Stop 6',
    questionId: 'Seluruh jalur evakuasi clear tidak terhalang material, palet, troli, box atau karton',
    questionEn: '(All evacuation routes are clear and not obstructed by materials, pallets, trolley, box or carton)',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },
  {
    id: 'ppa-6s-8',
    code: '8',
    pillar: 'Shine',
    title: 'Kebersihan & Identitas Mesin Jahit Prepare CO',
    icon: Shirt,
    category: '5R',
    questionId: 'Semua mesin jahit untuk prepare CO bersih dan terdapat identitas',
    questionEn: '(Unused sewing machines (preparing CO) are controlled well covered and there is identity on the machine)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- STANDARDIZE ---
  {
    id: 'ppa-6s-9',
    code: '9',
    pillar: 'Standardize',
    title: 'Ketersediaan Sample Sesuai Produk di Setiap Line PPA',
    icon: ClipboardCheck,
    category: 'Quality',
    questionId: 'Terdapat sample pada masing-masing Line PPA yang sesuai dengan produk yang sedang diproduksi',
    questionEn: '(There is samples in each Line PPA according to the product being produced)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'ppa-6s-10',
    code: '10',
    pillar: 'Standardize',
    title: 'Work Instruction (WI) untuk Semua Proses Kerja PPA',
    icon: FileText,
    category: '5R',
    questionId: 'Ada WI (Work Instruction) untuk semua proses kerja (penempatan tersentral/ atau per area). Terlihat jelas dan mudah dimengerti',
    questionEn: '(There are WI (Work Instruction) for all work processes (placed centralized / per area). Looks clear and easy to understand)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- SUSTAIN ---
  {
    id: 'ppa-6s-11',
    code: '11',
    pillar: 'Sustain',
    title: 'Perawatan Meja & Peralatan Kerja Tanpa Kerusakan',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Apakah seluruh meja / peralatan terawat dan tidak ditemukan kerusakan?',
    questionEn: '(Are all table/equipment maintained and are there no damages found?)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  }
];

// 8 Point Checksheet Framework 6S Khusus Area Distribusi - Supermarket Komponen (Sort, Set in order, Shine, Standardize, Sustain)
export const DISTRIBUSI_SUPERMARKET_6S_CHECKPOINTS: CheckpointItem[] = [
  // --- SORT ---
  {
    id: 'spm-6s-1',
    code: '1',
    pillar: 'Sort',
    title: 'Visualisasi Alokasi Line & Status Set/Unset',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Visualisasi yang Jelas untuk status alokasi line, set / unset tidak tercampur',
    questionEn: '(Clear Visualization for Production line allocation status and not mixed set / unset)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'spm-6s-2',
    code: '2',
    pillar: 'Sort',
    title: 'Cekris / Gunting Bundle di Area Spesifik & Terikat',
    icon: Scissors,
    category: '5R',
    questionId: 'Cekris/gunting untuk pengaturan bundle di area supermarket harus berada di daerah yang spesifik dan dalam kondisi terikat',
    questionEn: '(Cutting tools for bundling purposes is placed in specific area and are tied)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },

  // --- SET IN ORDER ---
  {
    id: 'spm-6s-3',
    code: '3',
    pillar: 'Set in order',
    title: 'Penempatan Alat Kerja, Botol Minum & Alat Kebersihan',
    icon: Coffee,
    category: '5R',
    questionId: 'Semua peralatan bantu, botol minum dan alat kebersihan diletakkan pada tempat yang disediakan setelah digunakan',
    questionEn: '(All working tools, drinking bottles and housekeeping tools are placed in the space provided after use)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- SHINE ---
  {
    id: 'spm-6s-4',
    code: '4',
    pillar: 'Shine',
    title: 'Kebersihan Seluruh Area dari Sarang Laba-laba, Debu & Kotoran',
    icon: Sparkles,
    category: '5R',
    questionId: 'Seluruh area bersih dari sarang laba-laba, debu dan kotoran',
    questionEn: '(The entire area is clean from cobwebs, dust and dirt.)',
    defaultPriority: 'Low',
    suggestedFinding: ''
  },
  {
    id: 'spm-6s-5',
    code: '5',
    pillar: 'Shine',
    title: 'Penutupan Box Panel Warna Putih / Terang',
    icon: Package,
    category: '5R',
    questionId: 'Box tertutup dengan baik untuk panel berwarna putih atau terang (tidak berpotesi kotor)',
    questionEn: '(Box is well closed for white or light colored panels (no potential for dirt))',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'spm-6s-6',
    code: '6',
    pillar: 'Shine',
    title: 'Jalur Evakuasi Bebas Rintangan (Clear Path)',
    icon: DoorOpen,
    category: 'Safety Stop 6',
    questionId: 'Seluruh jalur evakuasi clear tidak terhalang material, palet, troli, box atau karton',
    questionEn: '(All evacuation routes are clear and not obstructed by materials, pallets, trolley, box or carton)',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },

  // --- STANDARDIZE ---
  {
    id: 'spm-6s-7',
    code: '7',
    pillar: 'Standardize',
    title: 'Work Instruction (WI) untuk Semua Proses Kerja Supermarket',
    icon: FileText,
    category: '5R',
    questionId: 'Ada WI (Work Instruction) untuk semua proses kerja (penempatan tersentral/ atau per area). Terlihat jelas dan mudah dimengerti',
    questionEn: '(There are WI (Work Instruction) for all work processes (placed centralized / per area). Looks clear and easy to understand)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- SUSTAIN ---
  {
    id: 'spm-6s-8',
    code: '8',
    pillar: 'Sustain',
    title: 'Kondisi Rak, Box & Trolley Bebas Snagging',
    icon: Layers,
    category: '5R',
    questionId: 'Semua rak, box dan trolley dalam kondisi baik, tidak terkelupas sehingga tidak berpotensi snagging',
    questionEn: '(All racks, box and trolleys are in good condition, not peeled so there is no risk of snagging)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  }
];

// 10 Point Checksheet Framework 6S Khusus Area Distribusi - Heat Transfer (Sort, Set in order, Shine, Standardize, Sustain)
export const DISTRIBUSI_HEAT_TRANSFER_6S_CHECKPOINTS: CheckpointItem[] = [
  // --- SORT ---
  {
    id: 'ht-6s-1',
    code: '1',
    pillar: 'Sort',
    title: 'Pemisahan Area Material In & Out dengan Tanda Jelas',
    icon: ArrowRight,
    category: '5R',
    questionId: 'Area in penerimaan (sebelum proses) dan out (setelah proses) material terpisah dengan tanda area yang jelas',
    questionEn: '(Separate material receiving in and out areas are available with clearly marked areas)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'ht-6s-2',
    code: '2',
    pillar: 'Sort',
    title: 'Pemisahan & Dokumentasi Reject Material',
    icon: AlertTriangle,
    category: '5R',
    questionId: 'Reject material diletakkan terpisah, dan terdokumentasi',
    questionEn: '(Reject material is placed separately, and well doccumented)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },

  // --- SET IN ORDER ---
  {
    id: 'ht-6s-3',
    code: '3',
    pillar: 'Set in order',
    title: 'Penyimpanan Peralatan Metal di Toolbox/Shadows Box Terkunci & Log Book',
    icon: Lock,
    category: '5R',
    questionId: 'Peralatan bantu kerja berbahan metal di letakkan pada toolbox/ shadows box, terkunci, list alat sesuai, dokumentasi log book jelas.',
    questionEn: '(Metal work tools are placed in the toolbox/shadows box, locked, tool list is appropriate, log book documentation is clear)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'ht-6s-4',
    code: '4',
    pillar: 'Set in order',
    title: 'Penempatan Alat Kerja, Botol Minum & Alat Kebersihan',
    icon: Coffee,
    category: '5R',
    questionId: 'Semua peralatan kerja, botol minum dan alat kebersihan diletakkan pada tempat yang disediakan setelah digunakan',
    questionEn: '(All work equipment, drinking bottles and housekeepping tools are placed in the space provided for them after use)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- SHINE ---
  {
    id: 'ht-6s-5',
    code: '5',
    pillar: 'Shine',
    title: 'Kebersihan Seluruh Area dari Sarang Laba-laba, Debu & Kotoran',
    icon: Sparkles,
    category: '5R',
    questionId: 'Seluruh area bersih dari sarang laba-laba, debu dan kotoran',
    questionEn: '(The entire area is clean from cobwebs, dust and dirt.)',
    defaultPriority: 'Low',
    suggestedFinding: ''
  },
  {
    id: 'ht-6s-6',
    code: '6',
    pillar: 'Shine',
    title: 'Jalur Evakuasi Bebas Hambatan (Clear Path)',
    icon: DoorOpen,
    category: 'Safety Stop 6',
    questionId: 'Seluruh jalur evakuasi clear tidak terhalang material, palet, troli, box atau karton',
    questionEn: '(All evacuation routes are clear and not obstructed by materials, pallets, trolley, box or carton)',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },

  // --- STANDARDIZE ---
  {
    id: 'ht-6s-7',
    code: '7',
    pillar: 'Standardize',
    title: 'Work Instruction (WI) untuk Semua Proses Kerja Heat Transfer',
    icon: FileText,
    category: '5R',
    questionId: 'Ada WI (Work Instruction) untuk semua proses kerja (penempatan tersentral/ atau per area). Terlihat jelas dan mudah dimengerti',
    questionEn: '(There are WI (Work Instruction) for all work processes (placed centralized / per area). Looks clear and easy to understand)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'ht-6s-8',
    code: '8',
    pillar: 'Standardize',
    title: 'Sample Approval Produksi & Parameter Pengaturan (Suhu, Tekanan, Waktu)',
    icon: Flame,
    category: '5R',
    questionId: 'Terdapat sample approval produksi dan parameter pengaturan (suhu, tekanan, waktu) untuk style yang sedang berjalan',
    questionEn: 'There are production approval samples and setting parameters (temperature, pressure, time) for the running style.',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },

  // --- SUSTAIN ---
  {
    id: 'ht-6s-9',
    code: '9',
    pillar: 'Sustain',
    title: 'Kalibrasi Rutin Mesin Heat Transfer / Fuse / Bonding Terupdate',
    icon: Wrench,
    category: '5R',
    questionId: 'Mesin heat transfer/ fuse/ bonding dikalibrasi secara rutin sebelum produksi dengan mengikuti standard verifikasi yang telah ditentukan, dicatat dengan baik dan terupdate',
    questionEn: '(Heat transfer / fuse/ bonding machine is calibrated regularly before bulk production following the standard and well documented)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'ht-6s-10',
    code: '10',
    pillar: 'Sustain',
    title: 'Perawatan Meja & Peralatan Kerja Heat Transfer',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Meja serta peralatan kerja heat transfer dijaga dan dirawat dengan baik',
    questionEn: '(Tables and heat transfer working equipments are well kept and maintained)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  }
];

// 12 Point Checksheet Framework 6S Khusus Area Sewing (Sort, Set in order, Shine, Standardize, Sustain)
export const SEWING_6S_CHECKPOINTS: CheckpointItem[] = [
  // --- SORT ---
  {
    id: 'sew-6s-1',
    code: '1',
    pillar: 'Sort',
    title: 'Visualisasi Pemisahan Area OK & Reject (Regular & Hangerline)',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Area jelas tervisualisasi untuk OK dan Reject terpisah (Regular line, Hangerline : tidak ada garment reject yang kembali ke station tanpa menggunakan hanger).',
    questionEn: '(Clearly visualized areas for OK and Reject are separated (Regular line , Hangerline : return to station))',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'sew-6s-2',
    code: '2',
    pillar: 'Sort',
    title: 'Satu Gunting / Cekris per Operator Sewing Terikat di Mesin',
    icon: Scissors,
    category: '5R',
    questionId: 'Setiap operator sewing hanya memiliki satu gunting/ cekris, dan terikat di mesin.',
    questionEn: '(Every operator have only 1 scissor, and tied on machine)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'sew-6s-3',
    code: '3',
    pillar: 'Sort',
    title: 'Tidak Ditemukan Cekris / Gunting di Area QC EndLine',
    icon: Scissors,
    category: '5R',
    questionId: 'Tidak ditemukan cekris/ gunting di area QC EndLine PPA',
    questionEn: '(No scissors were found in QC EndLine PPA area)',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },

  // --- SET IN ORDER ---
  {
    id: 'sew-6s-4',
    code: '4',
    pillar: 'Set in order',
    title: 'Peralatan Tool Box Line Sesuai Daftar Aktual',
    icon: Lock,
    category: '5R',
    questionId: 'Line memiliki peralatan tool box, isi dan aktual tool digunakan sesuai dengan daftar.',
    questionEn: 'Line have toolbox equipment, contents and actual tools used according to the list',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'sew-6s-5',
    code: '5',
    pillar: 'Set in order',
    title: 'Penyimpanan Mesin Jahit Non-Aktif (Kertas, Lepas Jarum & Area Sesuai)',
    icon: Cpu,
    category: '5R',
    questionId: 'Mesin jahit yang tidak digunakan dilengkapi dengan kertas dibawah sepatu, jarum terlepas dan mesin jahit diletakkan pada area yang sesuai',
    questionEn: '(Sewing machines that are not in use is equipped with paper below presser foot, the needle is removed and sewing machines are placed in the appropriate area)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- SHINE ---
  {
    id: 'sew-6s-6',
    code: '6',
    pillar: 'Shine',
    title: 'Kebersihan & Kerapian Seluruh Area Line Sewing',
    icon: Sparkles,
    category: '5R',
    questionId: 'Seluruh area line bersih, terawat, teratur dan semua barang diletakkan pada tempatnya',
    questionEn: '(All of line area are clean, well-maintained and all equipment / tools organized on the right place)',
    defaultPriority: 'Low',
    suggestedFinding: ''
  },
  {
    id: 'sew-6s-7',
    code: '7',
    pillar: 'Shine',
    title: 'Mesin Jahit Prepare CO Bersih & Beridentitas Jelas',
    icon: Shirt,
    category: '5R',
    questionId: 'Semua mesin jahit untuk prepare CO bersih dan memiliki identitas',
    questionEn: '(Unused sewing machines (preparing CO) are controlled well covered and there is identity on machine)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'sew-6s-8',
    code: '8',
    pillar: 'Shine',
    title: 'Jalur Evakuasi Bebas Rintangan (Clear Path)',
    icon: DoorOpen,
    category: 'Safety Stop 6',
    questionId: 'Seluruh jalur evakuasi clear tidak terhalang material, palet, troli, box atau karton',
    questionEn: '(All evacuation routes are clear and not obstructed by materials, pallets, trolley, box or carton)',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },

  // --- STANDARDIZE ---
  {
    id: 'sew-6s-9',
    code: '9',
    pillar: 'Standardize',
    title: '3 Jenis Sample (QC Standard, Ironing, Folding) & Approved Production Sample',
    icon: ClipboardCheck,
    category: '5R',
    questionId: 'Terdapat 3 jenis sample pada masing-masing line yang sesuai dengan produk yang sedang diproduksi , yaitu sample QC standard, sample Ironing, dan sample folding (Spesifikasi L&P tersedia berdasarkan produk yang sedang berjalan). Approved Production Sample is available in each production line, with correct and valid information.',
    questionEn: '(There are 3 types of samples in each line according to the product being produced, namely standard QC samples, ironing samples, and folding samples (L&P specifications are available based on the product in progress))',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'sew-6s-10',
    code: '10',
    pillar: 'Standardize',
    title: 'Work Instruction (WI) untuk Semua Proses Kerja Sewing',
    icon: FileText,
    category: '5R',
    questionId: 'Ada WI (Work Instruction) untuk semua proses kerja (penempatan tersentral/ atau per area). Terlihat jelas dan mudah dimengerti',
    questionEn: '(There are WI (Work Instruction) for all work processes (placed centralized / per area). Looks clear and easy to understand',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- SUSTAIN ---
  {
    id: 'sew-6s-11',
    code: '11',
    pillar: 'Sustain',
    title: 'Perawatan Meja & Peralatan Line Sewing Bebas Kerusakan',
    icon: CheckCircle2,
    category: '5R',
    questionId: 'Apakah seluruh meja / peralatan terawat dan tidak ditemukan kerusakan?',
    questionEn: '(Are all table/equipment maintained and are there no damages found?)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'sew-6s-12',
    code: '12',
    pillar: 'Sustain',
    title: 'Kondisi Meja Ironing (Gosok), Vakum & Penggantian Alas Rutin',
    icon: Flame,
    category: '5R',
    questionId: 'Meja ironing (gosok) dalam keadaan baik, rata, dilengkapi dengan vakum dan alas gosok rutin diganti (checklist terupdate)',
    questionEn: '(Ironing table in good condition, flat, equipped with a vacuum and routinely replaced ironing table cloth (updated checklist))',
    defaultPriority: 'High',
    suggestedFinding: ''
  }
];

// 10 Point Checksheet Framework 6S Khusus Area Finish Good (Sort, Set in order, Shine, Standardize, Sustain)
export const FINISH_GOOD_6S_CHECKPOINTS: CheckpointItem[] = [
  // --- SORT ---
  {
    id: 'fg-6s-1',
    code: '1',
    pillar: 'Sort',
    title: 'Visualisasi Jelas Area Stuffing & Tidak Tercampur',
    icon: Eye,
    category: '5R',
    questionId: 'Visualisasi yang Jelas untuk area stuffing dan tidak tercampur',
    questionEn: '(Clear Visualization for stuffing area and not mixed)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'fg-6s-2',
    code: '2',
    pillar: 'Sort',
    title: 'Cekris / Gunting Area Packing di Area Spesifik & Terikat',
    icon: Scissors,
    category: '5R',
    questionId: 'Cekris/gunting di area packing harus berada di daerah yang spesifik dan dalam kondisi terikat',
    questionEn: 'Cutting tools purposes in packing area is placed in specific area and are tied',
    defaultPriority: 'High',
    suggestedFinding: ''
  },

  // --- SET IN ORDER ---
  {
    id: 'fg-6s-3',
    code: '3',
    pillar: 'Set in order',
    title: 'Penempatan Karton di Palet & Jarak 0,5m dari Dinding',
    icon: Package,
    category: '5R',
    questionId: 'Seluruh karton diletakkan pada palet dan 0,5m tidak langsung menempel dinding',
    questionEn: 'All carton placed on pallete and 0,5m from wall',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'fg-6s-4',
    code: '4',
    pillar: 'Set in order',
    title: 'Penempatan Peralatan Bantu, Botol Minum & Alat Kebersihan',
    icon: Coffee,
    category: '5R',
    questionId: 'Semua peralatan bantu , botol minum dan alat kebersihan diletakkan pada tempat yang disediakan setelah digunakan',
    questionEn: '(All working tools, drinking bottles and housekeeping tools are placed in the space provided after use)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'fg-6s-5',
    code: '5',
    pillar: 'Set in order',
    title: 'Peralatan Tool Box Packing Sesuai Daftar Aktual',
    icon: Lock,
    category: '5R',
    questionId: 'Packing memiliki peralatan tool box, isi dan aktual tool digunakan sesuai dengan daftar.',
    questionEn: 'Packing have toolbox equipment, contents and actual tools used according to the list',
    defaultPriority: 'High',
    suggestedFinding: ''
  },

  // --- SHINE ---
  {
    id: 'fg-6s-6',
    code: '6',
    pillar: 'Shine',
    title: 'Kebersihan Seluruh Area dari Sarang Laba-laba, Debu & Kotoran',
    icon: Sparkles,
    category: '5R',
    questionId: 'Seluruh area bersih dari sarang laba-laba, debu dan kotoran',
    questionEn: '(The entire area is clean from cobwebs, dust and dirt.)',
    defaultPriority: 'Low',
    suggestedFinding: ''
  },
  {
    id: 'fg-6s-7',
    code: '7',
    pillar: 'Shine',
    title: 'Jalur Evakuasi Bebas Rintangan (Clear Path)',
    icon: DoorOpen,
    category: 'Safety Stop 6',
    questionId: 'Seluruh jalur evakuasi clear tidak terhalang material, palet, troli, box atau karton',
    questionEn: '(All evacuation routes are clear and not obstructed by materials, pallets, trolley, box or carton)',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },

  // --- STANDARDIZE ---
  {
    id: 'fg-6s-8',
    code: '8',
    pillar: 'Standardize',
    title: 'Work Instruction (WI) untuk Semua Proses Kerja Finish Good',
    icon: FileText,
    category: '5R',
    questionId: 'Ada WI (Work Instruction) untuk semua proses kerja (penempatan tersentral/ atau per area). Terlihat jelas dan mudah dimengerti',
    questionEn: '(There are WI (Work Instruction) for all work processes (placed centralized / per area). Looks clear and easy to understand',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },
  {
    id: 'fg-6s-9',
    code: '9',
    pillar: 'Standardize',
    title: 'Penggunaan & Pembaruan Log Book Visitor',
    icon: ClipboardCheck,
    category: '5R',
    questionId: 'Log book visitor digunakan dan update',
    questionEn: 'The visitor log book is used and updated',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  },

  // --- SUSTAIN ---
  {
    id: 'fg-6s-10',
    code: '10',
    pillar: 'Sustain',
    title: 'Perawatan Palet, Trolley & Peralatan Bebas Kerusakan',
    icon: Truck,
    category: '5R',
    questionId: 'Apakah seluruh palet dan trolley / peralatan terawat dan tidak ditemukan kerusakan?',
    questionEn: '(Are all pallete and trolley/equipment maintained and are there no damages found?)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  }
];

export type ChecksheetCategoryTab = 'stop6' | '6s' | 'security-brand';

// Poin Checksheet Securit Brand Aspect (Security & Brand Protection) untuk Seluruh Area
export const SECURITY_BRAND_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'sec-brand-1',
    code: '1',
    title: 'Akses Area Terbatas & Kontrol Masuk/Keluar',
    icon: Lock,
    category: '5R',
    questionId: 'Apakah akses area {area} terbatas untuk personil yang berwenang dan pintu darurat/akses masuk terkontrol?',
    questionEn: '(Is access to the {area} restricted to authorized personnel and emergency exits/entrances properly controlled?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'sec-brand-2',
    code: '2',
    title: 'Penyimpanan & Pengendalian Trims / Label Brand',
    icon: ShieldCheck,
    category: 'Quality',
    questionId: 'Apakah label, barcode, hangtag, dan trims berlogo brand disimpan di lemari/ruangan terkunci dengan logbook mutasi?',
    questionEn: '(Are brand labels, barcodes, hangtags, and branded trims stored in locked storage with strict transaction logbook in the {area}?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'sec-brand-3',
    code: '3',
    title: 'Pemusnahan & Mutilasi Limbah Berlogo Brand',
    icon: ShieldAlert,
    category: 'Waste & Elimination',
    questionId: 'Apakah limbah perca, cacat cetak heat-transfer, dan reject produk berlogo brand dimutilasi/dipotong sebelum dibuang?',
    questionEn: '(Are textile scraps, defective heat-transfers, and rejected brand items mutilated/cut before disposal in the {area}?)',
    defaultPriority: 'Critical',
    suggestedFinding: ''
  },
  {
    id: 'sec-brand-4',
    code: '4',
    title: 'Pencegahan Penyelundupan & Integritas Produk',
    icon: Search,
    category: '5R',
    questionId: 'Apakah ada pengawasan terhadap potensi barang keluar tanpa izin (anti-pilferage) dan verifikasi identitas PO garmen?',
    questionEn: '(Is there strict anti-pilferage surveillance and garment PO identity verification maintained in the {area}?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'sec-brand-5',
    code: '5',
    title: 'CCTV & Pemantauan Keamanan Area Kritis',
    icon: Eye,
    category: 'Safety Stop 6',
    questionId: 'Apakah kamera pengawas CCTV di area {area} aktif, jangkauan visual jelas tanpa terhalang benda atau material?',
    questionEn: '(Are CCTV surveillance cameras in the {area} operational with clear line-of-sight unobstructed by materials?)',
    defaultPriority: 'Medium',
    suggestedFinding: ''
  }
];

// Poin Checksheet Security Brand Aspect khusus Area Warehouse Fabric (5 Point Pengecekan)
export const WAREHOUSE_FABRIC_SECURITY_BRAND_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'wh-fab-sec-1',
    code: '1',
    title: 'Warning Sign Brand Protection di Pintu Masuk',
    icon: AlertTriangle,
    category: '5R',
    questionId: 'Apakah pintu masuk area warehouse fabric telah dilengkapi dengan Warning Sign Brand Protection?',
    questionEn: '(Is the entrance door to the fabric warehouse area equipped with a Brand Protection warning sign?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-sec-2',
    code: '2',
    title: 'Buku Tamu & Visitor Card di Pintu Masuk',
    icon: FileText,
    category: '5R',
    questionId: 'Apakah di pintu masuk warehouse fabric tersedia buku tamu dan visitor card?',
    questionEn: '(Are a visitor logbook and visitor cards available at the fabric warehouse entrance?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-sec-3',
    code: '3',
    title: 'Alarm di Pintu Masuk Warehouse Fabric',
    icon: Bell,
    category: 'Safety Stop 6',
    questionId: 'Apakah pintu masuk warehouse fabric dilengkapi dengan alarm?',
    questionEn: '(Is the fabric warehouse entrance door equipped with an alarm?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-sec-4',
    code: '4',
    title: 'CCTV dan EAC (Electronic Access Control)',
    icon: Eye,
    category: 'Safety Stop 6',
    questionId: 'Apakah di area warehouse fabric dilengkapi dengan CCTV dan EAC?',
    questionEn: '(Is the fabric warehouse area equipped with CCTV and EAC (Electronic Access Control)?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'wh-fab-sec-5',
    code: '5',
    title: 'Penyimpanan Fabric Dipisahkan Berdasarkan Brand',
    icon: Layers,
    category: 'Material Flow',
    questionId: 'Apakah penyimpanan di area warehouse fabric telah dipisahkan berdasarkan masing-masing brand?',
    questionEn: '(Is storage in the fabric warehouse area segregated by brand?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  }
];

// 2 Point Checksheet Security Control Khusus Area Cutting (Paper Pattern Storage)
export const CUTTING_SECURITY_CONTROL_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'cut-sec-1',
    code: '1',
    pillar: 'Security Control',
    title: 'CCTV Tempat Penyimpanan Paper Pattern',
    icon: Eye,
    category: 'Safety Stop 6',
    questionId: 'Apakah tempat penyimpanan paper pattern di area cutting dilengkapi dengan CCTV?',
    questionEn: '(Is the paper pattern storage area in the cutting area equipped with CCTV?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'cut-sec-2',
    code: '2',
    pillar: 'Security Control',
    title: 'Kunci Penyimpanan Paper Pattern & Akses PIC',
    icon: Lock,
    category: '5R',
    questionId: 'Apakah kunci penyimpanan paper pattern disimpan dan hanya bisa diakses oleh PIC?',
    questionEn: '(Is the paper pattern storage key kept securely and accessible only by the PIC?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  }
];

// 2 Point Checksheet Security Brand Aspect Khusus Area Distribusi - PPA Auto & Manual (Label Ataca Storage)
export const DISTRIBUSI_PPA_SECURITY_BRAND_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'ppa-sec-1',
    code: '1',
    pillar: 'Security Brand Aspect',
    title: 'CCTV Tempat Penyimpanan Label Ataca PPA',
    icon: Eye,
    category: 'Safety Stop 6',
    questionId: 'Apakah tempat penyimpanan label ataca di area PPA dilengkapi dengan CCTV?',
    questionEn: '(Is the ataca label storage area in the PPA area equipped with CCTV?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'ppa-sec-2',
    code: '2',
    pillar: 'Security Brand Aspect',
    title: 'Kunci Penyimpanan Label Ataca & Akses PIC',
    icon: Lock,
    category: '5R',
    questionId: 'Apakah kunci penyimpanan label ataca disimpan dan hanya bisa diakses oleh PIC?',
    questionEn: '(Is the ataca label storage key kept securely and accessible only by the PIC?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  }
];

// 2 Point Checksheet Security Brand Aspect Khusus Area Distribusi - Heat Transfer (Paper Pattern Storage)
export const DISTRIBUSI_HEAT_TRANSFER_SECURITY_BRAND_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'ht-sec-1',
    code: '1',
    pillar: 'Security Brand Aspect',
    title: 'CCTV Tempat Penyimpanan Paper Pattern Heat Transfer',
    icon: Eye,
    category: 'Safety Stop 6',
    questionId: 'Apakah tempat penyimpanan paper pattern di area heat transfer dilengkapi dengan CCTV?',
    questionEn: '(Is the paper pattern storage area in the heat transfer area equipped with CCTV?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'ht-sec-2',
    code: '2',
    pillar: 'Security Brand Aspect',
    title: 'Kunci Penyimpanan Paper Pattern & Akses PIC',
    icon: Lock,
    category: '5R',
    questionId: 'Apakah kunci penyimpanan paper pattern disimpan dan hanya bisa diakses oleh PIC?',
    questionEn: '(Is the paper pattern storage key kept securely and accessible only by the PIC?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  }
];

// 2 Point Checksheet Security Brand Aspect Khusus Area Sewing (Label Ataca Storage)
export const SEWING_SECURITY_BRAND_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'sew-sec-1',
    code: '1',
    pillar: 'Security Brand Aspect',
    title: 'CCTV Tempat Penyimpanan Label Ataca Sewing',
    icon: Eye,
    category: 'Safety Stop 6',
    questionId: 'Apakah tempat penyimpanan label ataca di area sewing dilengkapi dengan CCTV?',
    questionEn: '(Is the ataca label storage area in the sewing area equipped with CCTV?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  },
  {
    id: 'sew-sec-2',
    code: '2',
    pillar: 'Security Brand Aspect',
    title: 'Kunci Penyimpanan Label Ataca & Akses PIC',
    icon: Lock,
    category: '5R',
    questionId: 'Apakah kunci penyimpanan label ataca disimpan dan hanya bisa diakses oleh PIC?',
    questionEn: '(Is the ataca label storage key kept securely and accessible only by the PIC?)',
    defaultPriority: 'High',
    suggestedFinding: ''
  }
];

// Helper untuk mendapatkan daftar checkpoint sesuai area dan kategori
export const getCheckpointsForArea = (
  areaId: ChecksheetAreaId, 
  cat: ChecksheetCategoryTab,
  warehouseSubArea?: WarehouseSubAreaId,
  distribusiSubArea?: DistribusiSubAreaId
): CheckpointItem[] => {
  if (cat === 'stop6') {
    return STOP6_CHECKPOINTS;
  }
  if (cat === 'security-brand') {
    if (areaId === 'distribusi') {
      if (distribusiSubArea === 'supermarket') {
        return [];
      }
      if (distribusiSubArea === 'ppa') {
        return DISTRIBUSI_PPA_SECURITY_BRAND_CHECKPOINTS;
      }
      if (distribusiSubArea === 'heat-transfer') {
        return DISTRIBUSI_HEAT_TRANSFER_SECURITY_BRAND_CHECKPOINTS;
      }
    }
    if (areaId === 'cutting') {
      return CUTTING_SECURITY_CONTROL_CHECKPOINTS;
    }
    if (areaId === 'warehouse' && warehouseSubArea === 'warehouse-fabric') {
      return WAREHOUSE_FABRIC_SECURITY_BRAND_CHECKPOINTS;
    }
    if (areaId === 'sewing') {
      return SEWING_SECURITY_BRAND_CHECKPOINTS;
    }
    return SECURITY_BRAND_CHECKPOINTS;
  }
  if (areaId === 'cutting') {
    return CUTTING_6S_CHECKPOINTS;
  }
  if (areaId === 'warehouse') {
    if (warehouseSubArea === 'warehouse-fabric') {
      return WAREHOUSE_FABRIC_6S_CHECKPOINTS;
    }
    return WAREHOUSE_6S_CHECKPOINTS;
  }
  if (areaId === 'distribusi') {
    if (distribusiSubArea === 'ppa') {
      return DISTRIBUSI_PPA_6S_CHECKPOINTS;
    }
    if (distribusiSubArea === 'supermarket') {
      return DISTRIBUSI_SUPERMARKET_6S_CHECKPOINTS;
    }
    if (distribusiSubArea === 'heat-transfer') {
      return DISTRIBUSI_HEAT_TRANSFER_6S_CHECKPOINTS;
    }
  }
  if (areaId === 'sewing') {
    return SEWING_6S_CHECKPOINTS;
  }
  if (areaId === 'finish-good') {
    return FINISH_GOOD_6S_CHECKPOINTS;
  }
  return SIX_S_CHECKPOINTS;
};

const CHECKSHEET_DRAFT_STORAGE_KEY = 'factory_genba_checksheet_draft_v1';

const getCurrentIsoWeek = (): number => {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

interface ChecksheetViewProps {
  findings: InspectionFinding[];
  currentUser: UserAccount;
  onSaveFinding: (finding: InspectionFinding) => Promise<void> | void;
  onSaveMultipleFindings?: (findings: InspectionFinding[]) => Promise<void> | void;
  onSelectPhotoProof?: (finding: InspectionFinding) => void;
  onGoToInspectionTable?: () => void;
  onNavigateToDashboard?: () => void;
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
  dirty?: boolean;
}

interface StoredChecksheetDraft {
  assessorName?: string;
  customPicName?: string;
  scores?: Record<string, 1 | 0>;
  draftFindings?: Record<string, ItemFindingDraft>;
}

const loadStoredDraft = (): StoredChecksheetDraft => {
  try {
    const raw = localStorage.getItem(CHECKSHEET_DRAFT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return {};
};

export const ChecksheetView: React.FC<ChecksheetViewProps> = ({
  findings,
  currentUser,
  onSaveFinding,
  onSaveMultipleFindings,
  onSelectPhotoProof,
  onGoToInspectionTable,
  onNavigateToDashboard,
  selectedFactory: controlledFactory,
  onSelectFactory,
  onNavigateToFactoryDashboard
}) => {
  const initialDraft = React.useMemo(() => loadStoredDraft(), []);

  // 1. Selected Main Area (Default to 'distribusi' so PPA is immediately ready as requested)
  const [selectedAreaId, setSelectedAreaId] = useState<ChecksheetAreaId>('distribusi');

  // 2. Selected Sub-Area when Distribusi is active: 'ppa' | 'supermarket' | 'heat-transfer'
  const [selectedDistribusiSubArea, setSelectedDistribusiSubArea] = useState<DistribusiSubAreaId>('ppa');
  
  // 2b. Selected Sub-Area when Warehouse is active: 'warehouse-accessories' | 'warehouse-fabric'
  const [selectedWarehouseSubArea, setSelectedWarehouseSubArea] = useState<WarehouseSubAreaId>('warehouse-accessories');

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

  // 3b. Assessor Name State
  const [assessorName, setAssessorName] = useState<string>(initialDraft.assessorName || '');

  // 3c. PIC Name State
  const [customPicName, setCustomPicName] = useState<string>(initialDraft.customPicName || '');

  // 4. Category tab: 'stop6' (Safety STOP-6) | '6s' (Framework 6S) | 'security-brand' (Security Brand Aspect)
  const [activeCategory, setActiveCategory] = useState<ChecksheetCategoryTab>('stop6');

  // Automatically switch away from 'security-brand' if supermarket sub-area is chosen (no security brand checksheet in supermarket)
  useEffect(() => {
    if (selectedAreaId === 'distribusi' && selectedDistribusiSubArea === 'supermarket' && activeCategory === 'security-brand') {
      setActiveCategory('6s');
    }
  }, [selectedAreaId, selectedDistribusiSubArea, activeCategory]);

  // 5. Scoring states: key = `${uniqueAreaKey}-${category}-${checkpointId}`, value = 1 (Aman) | 0 (Bahaya)
  const [scores, setScores] = useState<Record<string, 1 | 0>>(initialDraft.scores || {});

  // 6. In-place Draft Finding input for each checkpoint item
  const [draftFindings, setDraftFindings] = useState<Record<string, ItemFindingDraft>>(initialDraft.draftFindings || {});

  // Persist draft state safely so tab switches / mobile reloads keep filled inputs
  useEffect(() => {
    const payload: StoredChecksheetDraft = {
      assessorName,
      customPicName,
      scores,
      draftFindings
    };
    try {
      localStorage.setItem(CHECKSHEET_DRAFT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Fallback without oversized inline images if storage quota is tight
      try {
        const trimmedDrafts: Record<string, ItemFindingDraft> = {};
        for (const [k, v] of Object.entries(draftFindings)) {
          trimmedDrafts[k] = {
            ...v,
            photoUrl: v.photoUrl?.startsWith('data:image/') && v.photoUrl.length > 40000 ? '' : v.photoUrl
          };
        }
        localStorage.setItem(CHECKSHEET_DRAFT_STORAGE_KEY, JSON.stringify({
          assessorName,
          customPicName,
          scores,
          draftFindings: trimmedDrafts
        }));
      } catch {
        // ignore
      }
    }
  }, [assessorName, customPicName, scores, draftFindings]);

  // 7. Notification alert banner with factory context
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    findingId: string;
    factory: FactoryOption;
  } | null>(null);

  // 8. Photo compression & submission loading indicators
  const [compressingId, setCompressingId] = useState<string | null>(null);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [isBulkSaving, setIsBulkSaving] = useState<boolean>(false);

  const isWarehouse = selectedAreaId === 'warehouse';
  const isDistribusi = selectedAreaId === 'distribusi';

  const mainArea = CHECK_AREAS.find(a => a.id === selectedAreaId) || CHECK_AREAS[0];
  const activeSubArea = DISTRIBUSI_SUB_AREAS.find(s => s.id === selectedDistribusiSubArea) || DISTRIBUSI_SUB_AREAS[0];
  const activeWarehouseSubArea = WAREHOUSE_SUB_AREAS.find(s => s.id === selectedWarehouseSubArea) || WAREHOUSE_SUB_AREAS[0];

  // Resolve current active configuration depending on whether Warehouse or Distribusi is selected
  const currentKeyPrefix = isWarehouse
    ? `warehouse-${selectedWarehouseSubArea}`
    : isDistribusi
    ? `distribusi-${selectedDistribusiSubArea}`
    : selectedAreaId;
  const currentAreaDisplayName = isWarehouse
    ? activeWarehouseSubArea.name
    : isDistribusi
    ? `Distribusi (${activeSubArea.fullTitle})`
    : mainArea.name;
  const currentBoxTitle = isWarehouse
    ? activeWarehouseSubArea.boxTitle
    : isDistribusi
    ? activeSubArea.boxTitle
    : mainArea.boxTitle;
  const currentDepartment = mainArea.department;
  const currentDefaultPic = isWarehouse
    ? activeWarehouseSubArea.defaultPic
    : isDistribusi
    ? activeSubArea.defaultPic
    : mainArea.defaultPic;
  const currentCheckpoints = getCheckpointsForArea(
    selectedAreaId, 
    activeCategory, 
    selectedWarehouseSubArea,
    selectedDistribusiSubArea
  );

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

    // If score is 0 (Ada potensi bahaya / Tidak terpenuhi), initialize draft so it is tracked as unsaved until submitted
    if (score === 0) {
      const item = currentCheckpoints.find(c => c.id === checkpointId);
      const isItem5R = activeCategory === '6s' || activeCategory === 'security-brand' || item?.category === '5R';
      setDraftFindings(prev => {
        const existing = prev[key];
        return {
          ...prev,
          [key]: {
            photoUrl: existing?.photoUrl || '',
            description: existing?.description || '',
            pic: existing?.pic || (customPicName.trim() || ''),
            assessor: existing?.assessor || (assessorName.trim() || ''),
            priority: existing?.priority || item?.defaultPriority || 'High',
            savedFindingId: existing?.savedFindingId,
            savedTime: existing?.savedTime,
            dirty: existing?.savedFindingId ? existing.dirty : true
          }
        };
      });
      setAlertInfo({
        message: isItem5R
          ? `⚠️ Poin "${item?.title}" ditandai Tidak Terpenuhi. Lengkapi uraian/foto lalu tekan "Simpan ke Dashboard Temuan" atau tombol simpan di bawah layar.`
          : `⚠️ Potensi Bahaya pada "${item?.title}". Lengkapi uraian/foto lalu tekan "Simpan ke Dashboard Temuan" atau tombol simpan di bawah layar.`,
        findingId: '',
        factory: selectedFactory
      });
    }
  };

  // Handle Draft Finding Field Change
  const handleUpdateDraft = (checkpointId: string, field: keyof ItemFindingDraft, value: string) => {
    const key = getItemKey(checkpointId);
    setDraftFindings(prev => {
      const item = currentCheckpoints.find(c => c.id === checkpointId);
      const existing = prev[key] || {
        photoUrl: '',
        description: '',
        pic: customPicName.trim() || '',
        assessor: assessorName.trim() || '',
        priority: item?.defaultPriority || 'High'
      };
      return {
        ...prev,
        [key]: {
          ...existing,
          [field]: value,
          dirty: true
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
      e.target.value = '';
    }
  };

  // Build InspectionFinding object from a checkpoint item
  const buildFindingFromCheckpoint = (checkpoint: CheckpointItem, uniqueSuffix?: number): InspectionFinding => {
    const key = getItemKey(checkpoint.id);
    const draft = draftFindings[key];

    const description = draft?.description?.trim() || '';
    const photoUrl = draft?.photoUrl || '';
    const pic = draft?.pic?.trim() || customPicName.trim() || currentDefaultPic;
    const priority = draft?.priority || checkpoint.defaultPriority;
    const findingAssessor = draft?.assessor?.trim() || assessorName.trim() || currentUser.name || 'Assessor Genba';

    const existingId = draft?.savedFindingId;
    const uniqueNum = `${Date.now().toString().slice(-5)}${uniqueSuffix ?? Math.floor(10 + Math.random() * 90)}`;
    const findingId = existingId || `FND-2026-CHK-${uniqueNum}`;

    return {
      id: findingId,
      factory: selectedFactory,
      date: new Date().toISOString().split('T')[0],
      area: isWarehouse ? activeWarehouseSubArea.name : isDistribusi ? `Distribusi - ${activeSubArea.name}` : mainArea.name,
      finding: description ? `[Checksheet ${checkpoint.code} - ${checkpoint.title}] ${description}` : `[Checksheet ${checkpoint.code} - ${checkpoint.title}]`,
      category: checkpoint.category,
      pic,
      department: isDistribusi ? 'Distribusi' : mainArea.department,
      correctiveAction: 'Menunggu analisis tindakan korektif PIC & tim Genba',
      status: 'Open',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      attachmentUrl: photoUrl,
      priority,
      inspectorName: findingAssessor,
      recordedBy: findingAssessor,
      weekNumber: getCurrentIsoWeek(),
      hierarchyLevel: 'bi-monthly',
      createdAt: Date.now() + (uniqueSuffix || 0)
    };
  };

  // Save Single Finding directly into Shared Database & Dashboard
  const handleSaveDraftAsFinding = async (checkpoint: CheckpointItem) => {
    if (compressingId === checkpoint.id || savingItemId === checkpoint.id || isBulkSaving) return;

    const key = getItemKey(checkpoint.id);
    const newFinding = buildFindingFromCheckpoint(checkpoint);
    const savedTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setSavingItemId(checkpoint.id);
    try {
      await onSaveFinding(newFinding);
      onSelectFactory?.(selectedFactory);

      // Update draft to indicate saved state
      setDraftFindings(prev => ({
        ...prev,
        [key]: {
          ...(prev[key] || {
            photoUrl: newFinding.attachmentUrl,
            description: '',
            pic: newFinding.pic,
            priority: newFinding.priority
          }),
          photoUrl: newFinding.attachmentUrl,
          pic: newFinding.pic,
          assessor: newFinding.inspectorName,
          priority: newFinding.priority,
          savedFindingId: newFinding.id,
          savedTime,
          dirty: false
        }
      }));

      // Auto mark score to 0 (Ada potensi bahaya / Tidak terpenuhi)
      setScores(prev => ({
        ...prev,
        [key]: 0
      }));

      setAlertInfo({
        message: `✓ Temuan #${newFinding.id} berhasil masuk ke Dashboard (${selectedFactory})!`,
        findingId: newFinding.id,
        factory: selectedFactory
      });
    } finally {
      setSavingItemId(null);
    }
  };

  // Unsaved items in the current checksheet view (marked '0' or edited draft not yet synced to Dashboard)
  const unsavedCheckpoints = currentCheckpoints.filter((chk) => {
    const key = getItemKey(chk.id);
    const score = scores[key];
    const draft = draftFindings[key];
    const isMarkedZeroAndUnsaved = score === 0 && (!draft?.savedFindingId || draft?.dirty);
    const hasEditedContent = Boolean(draft?.dirty && (draft.description.trim() || draft.photoUrl));
    return isMarkedZeroAndUnsaved || hasEditedContent;
  });

  // Bulk save all unsaved items in current checksheet
  const handleSaveAllUnsavedFindings = async () => {
    if (unsavedCheckpoints.length === 0 || isBulkSaving || compressingId) return;

    setIsBulkSaving(true);
    try {
      const builtFindings = unsavedCheckpoints.map((chk, idx) => buildFindingFromCheckpoint(chk, idx + 10));
      const savedTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      if (onSaveMultipleFindings) {
        await onSaveMultipleFindings(builtFindings);
      } else {
        for (const f of builtFindings) {
          await onSaveFinding(f);
        }
      }
      onSelectFactory?.(selectedFactory);

      setDraftFindings(prev => {
        const next = { ...prev };
        unsavedCheckpoints.forEach((chk, idx) => {
          const key = getItemKey(chk.id);
          const built = builtFindings[idx];
          const existing = next[key];
          next[key] = {
            photoUrl: existing?.photoUrl || built.attachmentUrl,
            description: existing?.description || '',
            pic: existing?.pic || built.pic,
            assessor: existing?.assessor || built.inspectorName,
            priority: existing?.priority || built.priority,
            savedFindingId: built.id,
            savedTime,
            dirty: false
          };
        });
        return next;
      });

      setScores(prev => {
        const next = { ...prev };
        unsavedCheckpoints.forEach((chk) => {
          next[getItemKey(chk.id)] = 0;
        });
        return next;
      });

      const lastSavedId = builtFindings[builtFindings.length - 1]?.id || '';
      setAlertInfo({
        message: `✅ ${builtFindings.length} temuan checksheet berhasil tersimpan ke Dashboard (${selectedFactory})!`,
        findingId: lastSavedId,
        factory: selectedFactory
      });
    } finally {
      setIsBulkSaving(false);
    }
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
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-32">
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
                    Temuan otomatis tersimpan ke database pusat untuk unit <strong className="font-extrabold underline">{alertInfo.factory}</strong> &amp; tampil di Dashboard.
                  </span>
                ) : (
                  <span>
                    Unit audit aktif: <strong className="font-extrabold">{alertInfo.factory}</strong>.
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
            {alertInfo.findingId && onNavigateToDashboard && (
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Buka Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {alertInfo.findingId && onNavigateToFactoryDashboard && (
              <button
                type="button"
                onClick={() => onNavigateToFactoryDashboard(alertInfo.factory)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Factory Dashboard ({alertInfo.factory})</span>
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
            {evaluatedCount}/{totalCheckpointsInArea} Poin Terisi ({safeCount} {activeCategory === 'stop6' ? 'Aman' : 'Terpenuhi'} &bull; {hazardCount} {activeCategory === 'stop6' ? 'Bahaya' : 'Tidak Terpenuhi'})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CHECK_AREAS.map((area, idx) => {
            const isSelected = area.id === selectedAreaId;
            const AreaIcon = area.icon;

            const areaCheckpoints = getCheckpointsForArea(
              area.id, 
              activeCategory, 
              area.id === 'warehouse' ? selectedWarehouseSubArea : undefined,
              area.id === 'distribusi' ? selectedDistribusiSubArea : undefined
            );
            const areaTotalCount = areaCheckpoints.length;

            // count evaluations in this specific area
            let areaEval = 0;
            areaCheckpoints.forEach(chk => {
              const chkKey = area.id === 'warehouse'
                ? `warehouse-${selectedWarehouseSubArea}-${activeCategory}-${chk.id}`
                : area.id === 'distribusi'
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
                  <p className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border mt-1 inline-block ${
                    area.id === 'warehouse'
                      ? selectedWarehouseSubArea === 'warehouse-accessories'
                        ? 'text-blue-800 bg-blue-50 border-blue-200'
                        : 'text-amber-800 bg-amber-50 border-amber-200'
                      : selectedDistribusiSubArea === 'ppa'
                      ? 'text-teal-800 bg-teal-50 border-teal-200'
                      : selectedDistribusiSubArea === 'supermarket'
                      ? 'text-purple-800 bg-purple-50 border-purple-200'
                      : 'text-rose-800 bg-rose-50 border-rose-200'
                  }`}>
                    {area.id === 'warehouse' ? `2 Sub: ${activeWarehouseSubArea.name}` : `3 Sub: ${activeSubArea.name}`}
                  </p>
                )}

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Status Cek:</span>
                  <span className={`font-bold font-mono ${
                    areaEval === areaTotalCount ? 'text-emerald-600' : areaEval > 0 ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    {areaEval}/{areaTotalCount} Poin
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2 Sub-Area Buttons untuk Warehouse: "Warehouse Accessories" dan "Warehouse Fabric" */}
        {isWarehouse && (
          <div className={`p-4 rounded-2xl border-2 shadow-xs space-y-2 animate-in fade-in slide-in-from-top-1 transition-all ${
            selectedWarehouseSubArea === 'warehouse-accessories'
              ? 'bg-blue-50/90 border-blue-300'
              : 'bg-amber-50/90 border-amber-300'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center shadow-xs shrink-0 transition-colors ${
                  selectedWarehouseSubArea === 'warehouse-accessories' ? 'bg-blue-600' : 'bg-amber-600'
                }`}>
                  <Warehouse className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-wider ${
                    selectedWarehouseSubArea === 'warehouse-accessories' ? 'text-blue-950' : 'text-amber-950'
                  }`}>
                    Pilih Spesifik Area pada Warehouse:
                  </h4>
                  <p className={`text-[11px] font-medium ${
                    selectedWarehouseSubArea === 'warehouse-accessories' ? 'text-blue-800' : 'text-amber-800'
                  }`}>
                    Silakan pilih sub-area warehouse untuk memuat checksheet &amp; input foto temuan spesifik:
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border transition-colors ${
                selectedWarehouseSubArea === 'warehouse-accessories'
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : 'bg-amber-200 text-amber-900 border-amber-300'
              }`}>
                Aktif: {activeWarehouseSubArea.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {WAREHOUSE_SUB_AREAS.map((sub, sIdx) => {
                const isSubSelected = selectedWarehouseSubArea === sub.id;
                const isAccessories = sub.id === 'warehouse-accessories';
                const SubIcon = sub.icon;

                // Color styling: Distinct Blue for Warehouse Accessories, Amber for Warehouse Fabric
                const buttonClasses = isAccessories
                  ? isSubSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/30'
                    : 'bg-white hover:bg-blue-50/80 text-blue-950 border-blue-200 shadow-2xs'
                  : isSubSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-500/30'
                    : 'bg-white hover:bg-amber-100/60 text-amber-950 border-amber-200 shadow-2xs';

                const iconBoxClasses = isAccessories
                  ? isSubSelected ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700'
                  : isSubSelected ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-700';

                const subAreaTagClasses = isAccessories
                  ? isSubSelected ? 'text-blue-100' : 'text-blue-700'
                  : isSubSelected ? 'text-amber-100' : 'text-amber-700';

                const badgeClasses = isAccessories
                  ? 'bg-blue-700 text-white px-1.5 py-0.2 rounded border border-blue-400'
                  : 'bg-amber-700 text-white px-1.5 py-0.2 rounded border border-amber-400';

                const descClasses = isAccessories
                  ? isSubSelected ? 'text-blue-100' : 'text-slate-500'
                  : isSubSelected ? 'text-amber-100' : 'text-slate-500';

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedWarehouseSubArea(sub.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${buttonClasses}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBoxClasses}`}>
                      <SubIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase ${subAreaTagClasses}`}>
                          Sub-Area 0{sIdx + 1}
                        </span>
                        {isSubSelected && (
                          <span className={`text-[9px] font-bold ${badgeClasses}`}>
                            Dipilih
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-black truncate">
                        {sub.name}
                      </h5>
                      <p className={`text-[10px] truncate ${descClasses}`}>
                        {sub.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3 Sub-Area Buttons untuk Distribusi: "PPA" (Teal), "Supermarket" (Purple), dan "Heat Transfer" (Rose) */}
        {isDistribusi && (
          <div className={`p-4 rounded-2xl border-2 shadow-xs space-y-2 animate-in fade-in slide-in-from-top-1 transition-all ${
            selectedDistribusiSubArea === 'ppa'
              ? 'bg-teal-50/90 border-teal-300'
              : selectedDistribusiSubArea === 'supermarket'
              ? 'bg-purple-50/90 border-purple-300'
              : 'bg-rose-50/90 border-rose-300'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center shadow-xs shrink-0 transition-colors ${
                  selectedDistribusiSubArea === 'ppa'
                    ? 'bg-teal-600'
                    : selectedDistribusiSubArea === 'supermarket'
                    ? 'bg-purple-600'
                    : 'bg-rose-600'
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-wider ${
                    selectedDistribusiSubArea === 'ppa'
                      ? 'text-teal-950'
                      : selectedDistribusiSubArea === 'supermarket'
                      ? 'text-purple-950'
                      : 'text-rose-950'
                  }`}>
                    Pilih Spesifik Area pada Distribusi:
                  </h4>
                  <p className={`text-[11px] font-medium ${
                    selectedDistribusiSubArea === 'ppa'
                      ? 'text-teal-800'
                      : selectedDistribusiSubArea === 'supermarket'
                      ? 'text-purple-800'
                      : 'text-rose-800'
                  }`}>
                    Silakan pilih sub-area distribusi untuk memuat checksheet &amp; input foto temuan spesifik:
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border transition-colors ${
                selectedDistribusiSubArea === 'ppa'
                  ? 'bg-teal-100 text-teal-900 border-teal-300'
                  : selectedDistribusiSubArea === 'supermarket'
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}>
                Aktif: {activeSubArea.fullTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {DISTRIBUSI_SUB_AREAS.map((sub, sIdx) => {
                const isSubSelected = selectedDistribusiSubArea === sub.id;
                const SubIcon = sub.icon;

                // Distinct thematic color styling:
                // 1. PPA: Teal / Emerald
                // 2. Supermarket: Purple / Violet
                // 3. Heat Transfer: Rose / Flame Red
                let buttonClasses = '';
                let iconBoxClasses = '';
                let subAreaTagClasses = '';
                let badgeClasses = '';
                let descClasses = '';

                if (sub.id === 'ppa') {
                  buttonClasses = isSubSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm ring-2 ring-teal-500/30'
                    : 'bg-white hover:bg-teal-50/80 text-teal-950 border-teal-200 shadow-2xs';
                  iconBoxClasses = isSubSelected ? 'bg-white text-teal-700' : 'bg-teal-100 text-teal-700';
                  subAreaTagClasses = isSubSelected ? 'text-teal-100' : 'text-teal-700';
                  badgeClasses = 'bg-teal-700 text-white px-1.5 py-0.2 rounded border border-teal-400';
                  descClasses = isSubSelected ? 'text-teal-100' : 'text-slate-500';
                } else if (sub.id === 'supermarket') {
                  buttonClasses = isSubSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm ring-2 ring-purple-500/30'
                    : 'bg-white hover:bg-purple-50/80 text-purple-950 border-purple-200 shadow-2xs';
                  iconBoxClasses = isSubSelected ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-700';
                  subAreaTagClasses = isSubSelected ? 'text-purple-100' : 'text-purple-700';
                  badgeClasses = 'bg-purple-700 text-white px-1.5 py-0.2 rounded border border-purple-400';
                  descClasses = isSubSelected ? 'text-purple-100' : 'text-slate-500';
                } else {
                  // heat-transfer
                  buttonClasses = isSubSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-500/30'
                    : 'bg-white hover:bg-rose-50/80 text-rose-950 border-rose-200 shadow-2xs';
                  iconBoxClasses = isSubSelected ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-700';
                  subAreaTagClasses = isSubSelected ? 'text-rose-100' : 'text-rose-700';
                  badgeClasses = 'bg-rose-700 text-white px-1.5 py-0.2 rounded border border-rose-400';
                  descClasses = isSubSelected ? 'text-rose-100' : 'text-slate-500';
                }

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setSelectedDistribusiSubArea(sub.id);
                      if (sub.id === 'supermarket' && activeCategory === 'security-brand') {
                        setActiveCategory('6s');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${buttonClasses}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBoxClasses}`}>
                      <SubIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase ${subAreaTagClasses}`}>
                          Sub-Area 0{sIdx + 1}
                        </span>
                        {isSubSelected && (
                          <span className={`text-[9px] font-bold ${badgeClasses}`}>
                            Dipilih
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-black truncate">
                        {sub.name}
                      </h5>
                      <p className={`text-[10px] truncate ${descClasses}`}>
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
              <span className={`font-semibold px-2 py-0.5 rounded border text-[11px] ${
                selectedDistribusiSubArea === 'ppa'
                  ? 'text-teal-800 bg-teal-50 border-teal-200'
                  : selectedDistribusiSubArea === 'supermarket'
                  ? 'text-purple-800 bg-purple-50 border-purple-200'
                  : 'text-rose-800 bg-rose-50 border-rose-200'
              }`}>
                Sub: {activeSubArea.fullTitle}
              </span>
            )}
            {isWarehouse && (
              <span className={`font-semibold px-2 py-0.5 rounded border text-[11px] ${
                selectedWarehouseSubArea === 'warehouse-accessories'
                  ? 'text-blue-800 bg-blue-50 border-blue-200'
                  : 'text-amber-800 bg-amber-50 border-amber-200'
              }`}>
                Sub: {activeWarehouseSubArea.name}
              </span>
            )}
          </p>
        </div>

        {/* Section Heading & Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>
                {activeCategory === 'stop6' 
                  ? 'Safety (STOP-6)' 
                  : activeCategory === 'security-brand'
                  ? selectedAreaId === 'cutting'
                    ? 'Security Control (Paper Pattern Storage)'
                    : selectedAreaId === 'distribusi' && selectedDistribusiSubArea === 'ppa'
                    ? 'Security Brand Aspect (Label Ataca Storage)'
                    : selectedAreaId === 'distribusi' && selectedDistribusiSubArea === 'heat-transfer'
                    ? 'Security Brand Aspect (Paper Pattern Storage)'
                    : selectedAreaId === 'sewing'
                    ? 'Security Brand Aspect (Label Ataca Storage)'
                    : 'Security Brand Aspect (Security & Brand Protection)'
                  : 'Framework 6S (Housekeeping & K3)'}
              </span>
              {activeCategory === '6s' && selectedAreaId === 'warehouse' && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedWarehouseSubArea === 'warehouse-accessories'
                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  {selectedWarehouseSubArea === 'warehouse-fabric'
                    ? '12 Point Pengecekan Warehouse Fabric'
                    : '10 Point Pengecekan Warehouse Accessories'}
                </span>
              )}
              {activeCategory === '6s' && selectedAreaId === 'cutting' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                  13 Point Pengecekan Cutting (Framework 6S)
                </span>
              )}
              {activeCategory === '6s' && selectedAreaId === 'distribusi' && selectedDistribusiSubArea === 'ppa' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  11 Point Pengecekan PPA Auto &amp; Manual (Framework 6S)
                </span>
              )}
              {activeCategory === '6s' && selectedAreaId === 'distribusi' && selectedDistribusiSubArea === 'supermarket' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                  8 Point Pengecekan Supermarket (Framework 6S)
                </span>
              )}
              {activeCategory === '6s' && selectedAreaId === 'distribusi' && selectedDistribusiSubArea === 'heat-transfer' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                  10 Point Pengecekan Heat Transfer (Framework 6S)
                </span>
              )}
              {activeCategory === '6s' && selectedAreaId === 'sewing' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-900 border border-violet-300">
                  12 Point Pengecekan Sewing (Framework 6S)
                </span>
              )}
              {activeCategory === '6s' && selectedAreaId === 'finish-good' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300">
                  10 Point Pengecekan Finish Good (Framework 6S)
                </span>
              )}
              {activeCategory === 'security-brand' && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300">
                  {selectedAreaId === 'distribusi' && selectedDistribusiSubArea === 'ppa'
                    ? '2 Point Security Brand PPA (Label Ataca)'
                    : selectedAreaId === 'distribusi' && selectedDistribusiSubArea === 'heat-transfer'
                    ? '2 Point Security Brand Heat Transfer (Paper Pattern)'
                    : selectedAreaId === 'sewing'
                    ? '2 Point Security Brand Sewing (Label Ataca)'
                    : selectedAreaId === 'cutting'
                    ? '2 Point Security Control Cutting'
                    : selectedAreaId === 'warehouse' && selectedWarehouseSubArea === 'warehouse-fabric'
                    ? '5 Point Security Brand Warehouse Fabric'
                    : 'Brand Protection & Security Pillar'}
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveCategory('stop6')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'stop6'
                  ? selectedAreaId === 'warehouse' && selectedWarehouseSubArea === 'warehouse-accessories'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : selectedAreaId === 'distribusi'
                    ? selectedDistribusiSubArea === 'ppa'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : selectedDistribusiSubArea === 'supermarket'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-rose-600 text-white shadow-xs'
                    : 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Safety (STOP-6)
            </button>
            <button
              onClick={() => setActiveCategory('6s')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === '6s'
                  ? selectedAreaId === 'warehouse' && selectedWarehouseSubArea === 'warehouse-accessories'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : selectedAreaId === 'distribusi'
                    ? selectedDistribusiSubArea === 'ppa'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : selectedDistribusiSubArea === 'supermarket'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-rose-600 text-white shadow-xs'
                    : 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Framework 6S
            </button>
            {!(selectedAreaId === 'distribusi' && selectedDistribusiSubArea === 'supermarket') && (
              <button
                onClick={() => setActiveCategory('security-brand')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'security-brand'
                    ? selectedAreaId === 'warehouse' && selectedWarehouseSubArea === 'warehouse-accessories'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : selectedAreaId === 'distribusi'
                      ? selectedDistribusiSubArea === 'ppa'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-rose-600 text-white shadow-xs'
                      : 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {selectedAreaId === 'cutting' ? 'Security Control' : 'Security Brand Aspect'}
              </button>
            )}
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
            const is5R = activeCategory === '6s' || activeCategory === 'security-brand' || chk.category === '5R';

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
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                        {chk.code}
                      </span>
                      {chk.pillar && (
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          chk.pillar === 'Sort'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : chk.pillar === 'Set in order'
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : chk.pillar === 'Shine'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : chk.pillar === 'Standardize'
                            ? 'bg-purple-100 text-purple-900 border-purple-300'
                            : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}>
                          {chk.pillar}
                        </span>
                      )}
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
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-900 italic tracking-wide">
                        Item temuan
                      </span>
                      {draft?.savedFindingId && !draft?.dirty ? (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          ✓ Tersimpan di Dashboard ({draft.savedTime || 'Terkirim'})
                        </span>
                      ) : isHazard || draft?.dirty ? (
                        <span className="text-[10px] text-rose-800 font-extrabold bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                          ⚠️ Belum disimpan ke Dashboard
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          Opsional jika ada catatan
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
                          placeholder="Ketik temuan lapangan di sini..."
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
                          value={draft?.assessor !== undefined ? draft.assessor : assessorName}
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
                      <div className="pt-1 space-y-1.5">
                        <button
                          type="button"
                          disabled={compressingId === chk.id || savingItemId === chk.id || isBulkSaving}
                          onClick={() => handleSaveDraftAsFinding(chk)}
                          className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                            compressingId === chk.id || savingItemId === chk.id || isBulkSaving
                              ? 'bg-slate-400 text-white cursor-wait'
                              : draft?.savedFindingId && !draft?.dirty
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                              : draft?.savedFindingId && draft?.dirty
                              ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-400/40 cursor-pointer'
                              : isHazard
                              ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400/40 cursor-pointer'
                              : 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer'
                          }`}
                        >
                          {compressingId === chk.id || savingItemId === chk.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {compressingId === chk.id
                              ? 'Menunggu proses foto selesai...'
                              : savingItemId === chk.id
                              ? 'Menyimpan ke Dashboard...'
                              : draft?.savedFindingId && !draft?.dirty
                              ? `✓ Tersimpan di Dashboard (#${draft.savedFindingId})`
                              : draft?.savedFindingId && draft?.dirty
                              ? 'Simpan Perubahan ke Dashboard'
                              : 'Simpan ke Database Temuan'}
                          </span>
                        </button>

                        {draft?.savedFindingId && !draft?.dirty && onNavigateToDashboard && (
                          <button
                            type="button"
                            onClick={onNavigateToDashboard}
                            className="w-full py-1.5 px-3 rounded-lg text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Lihat temuan di Dashboard</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bulk Submit & Footer Summary */}
        {unsavedCheckpoints.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-xs sm:text-sm font-black text-rose-950">
                  Ada {unsavedCheckpoints.length} poin temuan belum tersimpan ke Dashboard
                </p>
                <p className="text-[11px] text-rose-800 font-medium">
                  Tekan tombol di sebelah kanan agar seluruh poin temuan (skor 0 / catatan) langsung tercatat ke Dashboard &amp; Tabel Inspeksi.
                </p>
              </div>
            </div>
            <button
              type="button"
              disabled={isBulkSaving || Boolean(compressingId)}
              onClick={handleSaveAllUnsavedFindings}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 text-white text-xs sm:text-sm font-black rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isBulkSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>
                {isBulkSaving
                  ? 'Menyimpan...'
                  : `Simpan Semua Temuan ke Dashboard (${unsavedCheckpoints.length})`}
              </span>
            </button>
          </div>
        )}

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
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {onNavigateToDashboard && (
                <button
                  type="button"
                  onClick={onNavigateToDashboard}
                  className="text-slate-900 hover:text-amber-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onGoToInspectionTable && (
                <button
                  type="button"
                  onClick={onGoToInspectionTable}
                  className="text-amber-700 hover:text-amber-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Tabel Inspeksi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Floating Mobile Bar for Unsaved Checksheet Findings */}
      {unsavedCheckpoints.length > 0 && (
        <div className="no-print fixed bottom-3 left-3 right-3 z-40 sm:left-auto sm:right-6 sm:w-auto sm:min-w-[380px]">
          <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-amber-500/50 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black text-amber-300 truncate">
                {unsavedCheckpoints.length} Temuan Belum Tersimpan
              </p>
              <p className="text-[10px] text-slate-300 truncate">
                Unit: {selectedFactory} &bull; {currentAreaDisplayName}
              </p>
            </div>
            <button
              type="button"
              disabled={isBulkSaving || Boolean(compressingId)}
              onClick={handleSaveAllUnsavedFindings}
              className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 disabled:bg-slate-600 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {isBulkSaving || compressingId ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>
                {compressingId
                  ? 'Proses Foto...'
                  : isBulkSaving
                  ? 'Menyimpan...'
                  : `Simpan ke Dashboard (${unsavedCheckpoints.length})`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
