import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Boxes, 
  Search, 
  Filter, 
  Plus, 
  Camera, 
  Edit3, 
  Factory,
  BarChart3,
  Calendar,
  Layers,
  CheckCircle,
  AlertCircle,
  MapPin,
  Check,
  ArrowUpDown,
  Flame,
  XCircle,
  Compass,
  Lock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { 
  InspectionFinding, 
  FactoryOption, 
  FindingStatus, 
  FindingCategory,
  UserAccount 
} from '../types';
import { FactoryAchievementChart } from './FactoryAchievementChart';
import { AreaPerformanceDashboard } from './AreaPerformanceDashboard';

interface FactoryDashboardViewProps {
  findings: InspectionFinding[];
  onOpenFindingModal: (defaultFactory?: FactoryOption) => void;
  onSelectPhotoProof: (finding: InspectionFinding) => void;
  onEditFinding: (finding: InspectionFinding) => void;
  onQuickUpdateStatus: (id: string, newStatus: FindingStatus) => void;
  currentUser?: UserAccount | null;
  onOpenLoginModal?: (reason?: string) => void;
}

const FACTORIES: FactoryOption[] = ['AOI 1', 'AOI 2', 'AOI 3', 'DC'];

const FACTORY_INFO: Record<FactoryOption, {
  name: string;
  fullName: string;
  subtitle: string;
  location: string;
  description: string;
  leadCoordinator: string;
  accentBg: string;
  accentText: string;
  borderActive: string;
  badgeBg: string;
  barColor: string;
  gradient: string;
  tagline: string;
}> = {
  'AOI 1': {
    name: 'AOI 1',
    fullName: 'Apparel One Indonesia 1',
    subtitle: 'Main Production & Apparel Hub',
    location: 'Kawasan Berikat Blok A-1, Semarang',
    description: 'Genba System for All Production area using 6S and STOP 6 in Apparel One Indonesia for continuous Improvement',
    leadCoordinator: 'Bpk. Ir. Hendra Gunawan (Plant GM - AOI 1)',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-800',
    borderActive: 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    barColor: 'bg-amber-500',
    gradient: 'from-amber-600 via-amber-700 to-amber-900',
    tagline: 'Lini Sewing & Gudang Kain Terpadu'
  },
  'AOI 2': {
    name: 'AOI 2',
    fullName: 'Apparel One Indonesia 2',
    subtitle: 'Cutting & Automated Sewing Center',
    location: 'Kawasan Industri Wijayakusuma Blok B-3, Semarang',
    description: 'Genba System for All Production area using 6S and STOP 6 in Apparel One Indonesia for continuous Improvement',
    leadCoordinator: 'Bpk. Ir. Rahmat Hidayat (Operations Head - AOI 2)',
    accentBg: 'bg-blue-600',
    accentText: 'text-blue-800',
    borderActive: 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
    barColor: 'bg-blue-600',
    gradient: 'from-blue-600 via-indigo-700 to-slate-900',
    tagline: 'Presisi Pemotongan Kain & Sub-Assembly Otomatis'
  },
  'AOI 3': {
    name: 'AOI 3',
    fullName: 'Apparel One Indonesia 3',
    subtitle: 'Finishing, QA & Logistics Fulfillment',
    location: 'Kawasan Industri Terboyo Mega Megah Blok C-5, Semarang',
    description: 'Genba System for All Production area using 6S and STOP 6 in Apparel One Indonesia for continuous Improvement',
    leadCoordinator: 'Ibu Anita Wijaya, S.E. (Logistics & QA Lead - AOI 3)',
    accentBg: 'bg-emerald-600',
    accentText: 'text-emerald-800',
    borderActive: 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    barColor: 'bg-emerald-600',
    gradient: 'from-emerald-600 via-teal-700 to-slate-900',
    tagline: 'Audit Kualitas Ekspor, Steam Press & Kartonasi'
  },
  'DC': {
    name: 'DC',
    fullName: 'Apparel One Indonesia DC',
    subtitle: 'Central Logistics & Distribution Hub',
    location: 'Kawasan Industri Candi Blok D, Semarang',
    description: 'Genba System for All Production area using 6S and STOP 6 in Apparel One Indonesia for continuous Improvement',
    leadCoordinator: 'Bpk. Dedi Kurniawan, S.T. (DC & Logistics Lead)',
    accentBg: 'bg-teal-600',
    accentText: 'text-teal-800',
    borderActive: 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
    barColor: 'bg-teal-600',
    gradient: 'from-teal-700 via-cyan-800 to-slate-900',
    tagline: 'Pusat Distribusi, Logistik & Pergudangan Terpadu'
  }
};

const CATEGORIES: FindingCategory[] = [
  '5R',
  'Safety Stop 6',
  'Waste & Elimination',
  'Quality',
  'Material Flow'
];

const DEPARTMENTS_LIST = [
  'Warehouse',
  'Cutting',
  'Distribusi',
  'Sewing',
  'Finish Good'
];

export const FactoryDashboardView: React.FC<FactoryDashboardViewProps> = ({
  findings,
  onOpenFindingModal,
  onSelectPhotoProof,
  onEditFinding,
  onQuickUpdateStatus,
  currentUser,
  onOpenLoginModal
}) => {
  // STRICT 1 PER PILIHAN: Only 1 Factory can be selected at any time ('AOI 1' | 'AOI 2' | 'AOI 3')
  const [selectedFactory, setSelectedFactory] = useState<FactoryOption>('AOI 1');
  
  // Filters for the table and bar chart interactive selection
  const [statusFilter, setStatusFilter] = useState<'ALL' | FindingStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | FindingCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Specific Area Filter (can be triggered by clicking an area bar in the bar chart)
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string | null>(null);

  // Helper to normalize factory attribute
  const getFindingFactory = (item: InspectionFinding): FactoryOption => {
    return item.factory || 'AOI 1';
  };

  // Factory Summary info for the selector cards (Strictly showing each single option)
  const factorySelectorMetrics = useMemo(() => {
    return FACTORIES.map((fac) => {
      const facFindings = findings.filter((f) => getFindingFactory(f) === fac);
      const total = facFindings.length;
      const open = facFindings.filter((f) => f.status === 'Open').length;
      const inProgress = facFindings.filter(
        (f) => f.status === 'In Progress' || f.status === 'Pending Verification'
      ).length;
      const closed = facFindings.filter((f) => f.status === 'Closed').length;
      const resolutionRate = total > 0 ? Math.round((closed / total) * 100) : 0;
      const criticalCount = facFindings.filter(
        (f) => f.priority === 'Critical' || f.priority === 'High'
      ).length;

      return {
        factory: fac,
        info: FACTORY_INFO[fac],
        total,
        open,
        inProgress,
        closed,
        resolutionRate,
        criticalCount
      };
    });
  }, [findings]);

  // Data ONLY for the currently selected Factory (Strict single choice)
  const activeFactoryData = useMemo(() => {
    const facFindings = findings.filter((f) => getFindingFactory(f) === selectedFactory);
    const total = facFindings.length;
    const open = facFindings.filter((f) => f.status === 'Open').length;
    const inProgress = facFindings.filter(
      (f) => f.status === 'In Progress' || f.status === 'Pending Verification'
    ).length;
    const closed = facFindings.filter((f) => f.status === 'Closed').length;
    const resolutionRate = total > 0 ? Math.round((closed / total) * 100) : 0;
    const criticalCount = facFindings.filter(
      (f) => f.priority === 'Critical' || f.priority === 'High'
    ).length;

    // Category distribution
    const categoryCounts: Record<FindingCategory, number> = {
      '5R': 0,
      'Safety Stop 6': 0,
      'Waste & Elimination': 0,
      'Quality': 0,
      'Material Flow': 0
    };
    facFindings.forEach((f) => {
      if (categoryCounts[f.category] !== undefined) {
        categoryCounts[f.category]++;
      }
    });

    // Department distribution
    const departmentCounts: Record<string, { total: number; closed: number }> = {};
    DEPARTMENTS_LIST.forEach((d) => {
      departmentCounts[d] = { total: 0, closed: 0 };
    });
    facFindings.forEach((f) => {
      let dept = f.department || 'Warehouse';
      if (dept === 'Finishing Packing' || dept === 'Finishing' || dept === 'Packing') {
        dept = 'Finish Good';
      } else if (dept.startsWith('Distribusi')) {
        dept = 'Distribusi';
      }
      if (!departmentCounts[dept]) {
        departmentCounts[dept] = { total: 0, closed: 0 };
      }
      departmentCounts[dept].total++;
      if (f.status === 'Closed') {
        departmentCounts[dept].closed++;
      }
    });

    // Detailed Area Distribution for the Bar Chart
    const areaStatsMap: Record<string, {
      areaName: string;
      total: number;
      open: number;
      inProgress: number;
      closed: number;
      critical: number;
      department?: string;
    }> = {};

    facFindings.forEach((f) => {
      const areaKey = f.area.trim();
      if (!areaStatsMap[areaKey]) {
        areaStatsMap[areaKey] = {
          areaName: areaKey,
          total: 0,
          open: 0,
          inProgress: 0,
          closed: 0,
          critical: 0,
          department: f.department
        };
      }
      areaStatsMap[areaKey].total++;
      if (f.status === 'Open') {
        areaStatsMap[areaKey].open++;
      } else if (f.status === 'Closed') {
        areaStatsMap[areaKey].closed++;
      } else {
        areaStatsMap[areaKey].inProgress++;
      }
      if (f.priority === 'Critical' || f.priority === 'High') {
        areaStatsMap[areaKey].critical++;
      }
    });

    const areaList = Object.values(areaStatsMap);

    return {
      total,
      open,
      inProgress,
      closed,
      resolutionRate,
      criticalCount,
      categoryCounts,
      departmentCounts,
      areaList,
      findings: facFindings
    };
  }, [findings, selectedFactory]);

  // Filtered findings list for table display
  const tableFindings = useMemo(() => {
    return activeFactoryData.findings.filter((f) => {
      // Area specific filter (from bar chart click)
      if (selectedAreaFilter && f.area.trim() !== selectedAreaFilter.trim()) {
        return false;
      }
      if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && f.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesArea = f.area.toLowerCase().includes(q);
        const matchesText = f.finding.toLowerCase().includes(q);
        const matchesPic = f.pic.toLowerCase().includes(q);
        const matchesId = f.id.toLowerCase().includes(q);
        const matchesDept = (f.department || '').toLowerCase().includes(q);
        return matchesArea || matchesText || matchesPic || matchesId || matchesDept;
      }
      return true;
    });
  }, [activeFactoryData.findings, selectedAreaFilter, statusFilter, categoryFilter, searchQuery]);

  const selectedFactoryInfo = FACTORY_INFO[selectedFactory];

  // Handler to switch single factory
  const handleSelectSingleFactory = (factory: FactoryOption) => {
    setSelectedFactory(factory);
    setSelectedAreaFilter(null); // Reset area filter when changing factory
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* ============================================================== */}
      {/* 1. FACTORY SELECTOR: STRICTLY 1 PER PILIHAN (SINGLE-SELECTION) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-5 border-2 border-amber-300/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs">
                <Building2 className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Factory Selector &bull; Pilih 1 Factory
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Mode: 1 Pilihan Tunggal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih satu pabrik untuk menampilkan seluruh metrik performa dan grafik batang temuan area khusus unit tersebut:
            </p>
          </div>

          {/* Quick Segmented Switcher for 1 per choice */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
            {FACTORIES.map((fac) => {
              const isCurrent = selectedFactory === fac;
              return (
                <button
                  key={`pill-${fac}`}
                  onClick={() => handleSelectSingleFactory(fac)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <Factory className="w-3.5 h-3.5" />
                  <span>{fac}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Interactive Factory Cards: Exactly 1 is selected */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {factorySelectorMetrics.map((stat) => {
            const isSelected = selectedFactory === stat.factory;

            return (
              <button
                key={stat.factory}
                type="button"
                onClick={() => handleSelectSingleFactory(stat.factory)}
                className={`relative text-left p-4 rounded-xl border-2 transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? `${stat.info.borderActive} shadow-lg ring-3 ring-amber-500/30 scale-[1.01]`
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white opacity-85 hover:opacity-100'
                }`}
              >
                {/* Single Choice Indicator Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* Radio Button Visual */}
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-amber-600 bg-amber-600'
                        : 'border-slate-400 bg-white group-hover:border-slate-500'
                    }`}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-black border ${stat.info.badgeBg}`}>
                      {stat.factory}
                    </span>
                  </div>

                  {isSelected ? (
                    <span className="flex items-center gap-1 bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>TERPILIH</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-600">
                      Klik untuk pilih
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    {stat.info.fullName}
                  </h3>
                </div>

                {/* Card summary stats */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900 leading-none">
                      {stat.total}
                    </span>
                    <span className="text-xs text-slate-500 ml-1 font-medium">Temuan</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      {stat.open} Open
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {stat.resolutionRate}% Closed
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. DASHBOARD DATA HEADER UNTUK FACTORY YANG DIPILIH           */}
      {/* ============================================================== */}
      <div className={`rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-700/60 bg-gradient-to-r ${selectedFactoryInfo.gradient}`}>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-white/20 text-white backdrop-blur-xs border border-white/30">
                <Building2 className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono tracking-widest uppercase font-bold bg-black/40 text-amber-300 px-2.5 py-0.5 rounded border border-white/20">
                DASHBOARD AKTIF: {selectedFactory}
              </span>
              <span className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
                {selectedFactoryInfo.tagline}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {selectedFactoryInfo.fullName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {selectedFactoryInfo.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenFindingModal(selectedFactory)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-600" />
              <span>Catat Temuan Baru</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white text-[11px]">
                di {selectedFactory}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. KPI CARDS RINGKASAN DATA KHUSUS FACTORY YANG DIPILIH        */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Temuan */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Temuan ({selectedFactory})</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {activeFactoryData.total}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Unit terdaftar</p>
          </div>
          <span className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <Boxes className="w-5 h-5" />
          </span>
        </div>

        {/* Open Findings */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Belum Selesai (Open)</p>
            <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
              {activeFactoryData.open}
            </p>
            <p className="text-[11px] text-rose-600/80 font-medium mt-0.5">Memerlukan aksi korektif</p>
          </div>
          <span className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
            <AlertCircle className="w-5 h-5" />
          </span>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Sedang Dikerjakan</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {activeFactoryData.inProgress}
            </p>
            <p className="text-[11px] text-amber-600/80 font-medium mt-0.5">Dalam perbaikan / verifikasi</p>
          </div>
          <span className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
            <Clock className="w-5 h-5" />
          </span>
        </div>

        {/* Closed */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Tuntas (Closed)</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {activeFactoryData.closed}
            </p>
            <p className="text-[11px] text-emerald-600/80 font-medium mt-0.5">Terselesaikan 100%</p>
          </div>
          <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </span>
        </div>

        {/* Resolution Rate */}
        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Tingkat Penutupan</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              {activeFactoryData.resolutionRate}%
            </p>
            <p className="text-[11px] text-blue-600/80 font-medium mt-0.5">
              {activeFactoryData.criticalCount} temuan high/kritis
            </p>
          </div>
          <span className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
            <TrendingUp className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. BREAKDOWN KATEGORI & DEPARTEMEN KHUSUS FACTORY TERPILIH      */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pilar Kaizen Kategori */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Distribusi Kategori Kaizen &amp; K3 ({selectedFactory})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pola temuan berdasarkan 5 Pilar Standar Mutu Lapangan
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {activeFactoryData.total} Total
            </span>
          </div>

          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const count = activeFactoryData.categoryCounts[cat] || 0;
              const pct = activeFactoryData.total > 0
                ? Math.round((count / activeFactoryData.total) * 100)
                : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat}</span>
                    <span className="font-mono text-slate-800 font-bold">
                      {count} temuan <span className="text-slate-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        cat === 'Safety Stop 6'
                          ? 'bg-rose-500'
                          : cat === '5R'
                          ? 'bg-emerald-500'
                          : cat === 'Quality'
                          ? 'bg-blue-500'
                          : cat === 'Waste & Elimination'
                          ? 'bg-amber-500'
                          : 'bg-purple-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Departemen di Factory Terpilih */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Distribusi Departemen di {selectedFactory}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Konsentrasi temuan per lini bagian kerja unit {selectedFactory}
                </p>
              </div>
            </div>

            {/* Department stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {DEPARTMENTS_LIST.map((dept) => {
                const stat = activeFactoryData.departmentCounts[dept] || { total: 0, closed: 0 };
                return (
                  <div key={dept} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="text-[11px] font-bold text-slate-700 truncate">{dept}</p>
                    <p className="text-lg font-black text-slate-900 mt-0.5">
                      {stat.total} <span className="text-[10px] font-normal text-slate-500">temuan</span>
                    </p>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/60 text-[10px]">
                      <span className="text-emerald-700 font-semibold">{stat.closed} Closed</span>
                      <span className="text-slate-400">
                        {stat.total > 0 ? Math.round((stat.closed / stat.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Lokasi unit: {selectedFactoryInfo.location}</span>
            </span>
            <span className="font-semibold text-slate-700">
              {activeFactoryData.areaList.length} Area Aktif
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. PEMANTAUAN HASIL TEMUAN PER AREA & FACTORY                  */}
      {/* ============================================================== */}
      <AreaPerformanceDashboard 
        findings={findings}
        initialFactory={selectedFactory}
        onNavigateToTable={(area) => {
          if (area) {
            setSelectedAreaFilter(area);
          }
        }}
      />

      {/* ============================================================== */}
      {/* 6. DIAGRAM BATANG FACTORY DASHBOARD (MENYERUPAI GENBA DASHBOARD) */}
      {/* ============================================================== */}
      <FactoryAchievementChart
        factory={selectedFactory}
        findings={findings}
        selectedAreaFilter={selectedAreaFilter}
        onSelectAreaFilter={setSelectedAreaFilter}
      />

      {/* ============================================================== */}
      {/* 6. DAFTAR TEMUAN LAPANGAN KHUSUS FACTORY TERPILIH             */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table & Filter Header */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-extrabold text-slate-900">
                  Daftar Temuan Lapangan &bull; {selectedFactory}
                </h2>
                {selectedAreaFilter && (
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                    Area: {selectedAreaFilter}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Menampilkan <strong>{tableFindings.length}</strong> temuan dari total {activeFactoryData.total} temuan di unit pabrik {selectedFactory}
              </p>
            </div>

            {/* Filter Status Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Status
              </button>
              <button
                onClick={() => setStatusFilter('Open')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'Open'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Open ({activeFactoryData.open})
              </button>
              <button
                onClick={() => setStatusFilter('In Progress')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'In Progress'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Progress ({activeFactoryData.inProgress})
              </button>
              <button
                onClick={() => setStatusFilter('Closed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === 'Closed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Closed ({activeFactoryData.closed})
              </button>
            </div>
          </div>

          {/* Search, Area Pill reset, & Secondary Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Cari area, temuan, PIC di ${selectedFactory}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as 'ALL' | FindingCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 font-medium"
              >
                <option value="ALL">Semua Kategori (5R, Safety Stop 6, etc.)</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Area Filter Reset if selected from Bar Chart */}
            <div className="flex items-center gap-2">
              {selectedAreaFilter ? (
                <button
                  onClick={() => setSelectedAreaFilter(null)}
                  className="w-full px-3 py-2 text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="truncate">Area: {selectedAreaFilter}</span>
                  <XCircle className="w-3.5 h-3.5 shrink-0 ml-1" />
                </button>
              ) : (
                <div className="w-full px-3 py-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Semua area di {selectedFactory}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Findings Table */}
        {tableFindings.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Tidak ada temuan yang cocok dengan filter di {selectedFactory}</p>
            <p className="text-xs text-slate-400">
              Coba reset filter area, status, atau ubah kata kunci pencarian.
            </p>
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
                setSelectedAreaFilter(null);
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-700 font-bold border-b border-slate-200 select-none">
                <tr>
                  <th className="py-3 px-3.5">Factory &amp; ID</th>
                  <th className="py-3 px-3.5">Tanggal &amp; Area</th>
                  <th className="py-3 px-3.5">Deskripsi Temuan</th>
                  <th className="py-3 px-3.5">Kategori &amp; Prioritas</th>
                  <th className="py-3 px-3.5">PIC &amp; Dept</th>
                  <th className="py-3 px-3.5">Foto Bukti</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableFindings.map((finding) => {
                  const itemFactory = getFindingFactory(finding);
                  const factoryStyle = FACTORY_INFO[itemFactory];

                  return (
                    <tr 
                      key={finding.id}
                      className="hover:bg-amber-50/30 transition-colors"
                    >
                      {/* Factory Badge & ID */}
                      <td className="py-3 px-3.5 align-top whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-black border ${factoryStyle.badgeBg}`}>
                            {itemFactory}
                          </span>
                          <p className="font-mono text-[10px] text-slate-500 font-semibold">
                            {finding.id}
                          </p>
                        </div>
                      </td>

                      {/* Date & Area */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="space-y-0.5 max-w-[200px]">
                          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            {finding.date}
                          </span>
                          <p className="font-bold text-slate-900 leading-tight">
                            {finding.area}
                          </p>
                        </div>
                      </td>

                      {/* Finding Description & Assessor */}
                      <td className="py-3 px-3.5 align-top max-w-xs">
                        <p className="text-slate-800 text-xs line-clamp-2 leading-relaxed font-medium">
                          {finding.finding}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                            <UserCheck className="w-2.5 h-2.5 text-amber-600" />
                            Assessor: {finding.inspectorName || finding.recordedBy || 'Assessor Genba'}
                          </span>
                        </div>
                        {finding.correctiveAction && (
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                            <strong className="not-italic text-slate-700">Tindakan:</strong> {finding.correctiveAction}
                          </p>
                        )}
                      </td>

                      {/* Category & Priority */}
                      <td className="py-3 px-3.5 align-top whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {finding.category}
                          </span>
                          <div>
                            <span className={`inline-block text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                              finding.priority === 'Critical' 
                                ? 'bg-red-100 text-red-800'
                                : finding.priority === 'High'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {finding.priority}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* PIC & Dept */}
                      <td className="py-3 px-3.5 align-top whitespace-nowrap">
                        <p className="font-semibold text-slate-800">{finding.pic}</p>
                        <p className="text-[10px] text-slate-500">{finding.department || 'Warehouse'}</p>
                      </td>

                      {/* Photo Proof */}
                      <td className="py-3 px-3.5 align-top">
                        <button
                          onClick={() => onSelectPhotoProof(finding)}
                          className="flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer group"
                          title="Lihat foto bukti temuan"
                        >
                          {finding.attachmentUrl ? (
                            <img
                              src={finding.attachmentUrl}
                              alt="Bukti"
                              className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center">
                              <Camera className="w-4 h-4 text-slate-500" />
                            </div>
                          )}
                          <span className="text-[10px] text-amber-700 font-bold group-hover:underline">
                            Bukti Foto
                          </span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 align-top whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          finding.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : finding.status === 'In Progress' || finding.status === 'Pending Verification'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {finding.status === 'Closed' && <CheckCircle className="w-3 h-3" />}
                          {finding.status === 'In Progress' && <Clock className="w-3 h-3" />}
                          {finding.status === 'Open' && <AlertCircle className="w-3 h-3" />}
                          {finding.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditFinding(finding)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50 text-slate-700 hover:text-amber-800 transition-colors cursor-pointer"
                            title="Edit / Tindak Lanjuti Temuan"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {finding.status !== 'Closed' && (
                            <button
                              onClick={() => {
                                if (currentUser && currentUser.role !== 'admin') {
                                  if (onOpenLoginModal) {
                                    onOpenLoginModal('Hanya Admin yang berwenang menutup temuan (Closed).');
                                  }
                                  return;
                                }
                                onQuickUpdateStatus(finding.id, 'Closed');
                              }}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                                currentUser && currentUser.role !== 'admin'
                                  ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300 cursor-pointer'
                              }`}
                              title={
                                currentUser && currentUser.role !== 'admin'
                                  ? 'Hanya Admin yang dapat menutup temuan (Closed)'
                                  : 'Tandai Selesai (Closed)'
                              }
                            >
                              {currentUser && currentUser.role !== 'admin' && (
                                <Lock className="w-2.5 h-2.5 text-rose-500" />
                              )}
                              <span>{currentUser && currentUser.role !== 'admin' ? 'Tutup (Admin)' : 'Tutup'}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
