import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  BarChart3, 
  Calendar, 
  Camera, 
  ChevronRight,
  Trash2,
  Award,
  Boxes,
  Edit3
} from 'lucide-react';
import { InspectionFinding, ActiveTab, FindingCategory } from '../types';
import { DepartmentAchievementChart } from './DepartmentAchievementChart';
import { FINDING_CATEGORIES } from '../data/mockData';

const CATEGORY_META: Record<FindingCategory, {
  number: number;
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  barColor: string;
  lightBg: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  '5R': {
    number: 1,
    label: '5R',
    badgeBg: 'bg-emerald-50 text-emerald-700',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    barColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50/60',
    icon: Sparkles
  },
  'Safety Stop 6': {
    number: 2,
    label: 'Safety Stop 6',
    badgeBg: 'bg-rose-50 text-rose-700',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-200',
    barColor: 'bg-rose-500',
    lightBg: 'bg-rose-50/60',
    icon: ShieldAlert
  },
  'Waste & Elimination': {
    number: 3,
    label: 'Waste & Elimination',
    badgeBg: 'bg-amber-50 text-amber-700',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-200',
    barColor: 'bg-amber-500',
    lightBg: 'bg-amber-50/60',
    icon: Trash2
  },
  'Quality': {
    number: 4,
    label: 'Quality',
    badgeBg: 'bg-blue-50 text-blue-700',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-200',
    barColor: 'bg-blue-500',
    lightBg: 'bg-blue-50/60',
    icon: Award
  },
  'Material Flow': {
    number: 5,
    label: 'Material Flow',
    badgeBg: 'bg-purple-50 text-purple-700',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-200',
    barColor: 'bg-purple-500',
    lightBg: 'bg-purple-50/60',
    icon: Boxes
  }
};

interface DashboardViewProps {
  findings: InspectionFinding[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenFindingModal: () => void;
  onSelectPhotoProof: (finding: InspectionFinding) => void;
  onEditFinding?: (finding: InspectionFinding) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  findings,
  onNavigateTab,
  onOpenFindingModal,
  onSelectPhotoProof,
  onEditFinding
}) => {
  // Metrics computation
  const total = findings.length;
  const openCount = findings.filter(f => f.status === 'Open').length;
  const inProgressCount = findings.filter(f => f.status === 'In Progress' || f.status === 'Pending Verification').length;
  const closedCount = findings.filter(f => f.status === 'Closed').length;
  const closureRate = total > 0 ? Math.round((closedCount / total) * 100) : 0;
  const criticalCount = findings.filter(f => f.priority === 'Critical' && f.status !== 'Closed').length;

  // Category counts
  const categoryCounts = findings.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  // Urgent findings (open or high priority)
  const urgentFindings = findings
    .filter(f => f.status !== 'Closed')
    .sort((a, b) => {
      const pOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return pOrder[b.priority] - pOrder[a.priority];
    })
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Hero Welcome & Quick Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Manajemen Continuous Improvement & Kaizen
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">&bull; Terintegrasi Standar K3 & 5S</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Genba Dashboard & Factory Improvement Hub
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Pusat kendali inspeksi langsung lapangan (Genba Walk) manajemen pabrik. Pantau penyelesaian masalah, verifikasi bukti foto Before-After perbaikan, dan evaluasi kepatuhan standar setiap departemen secara real-time.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="hero-new-walkthrough-btn"
              onClick={onOpenFindingModal}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Input Hasil Walkthrough</span>
            </button>
            <button
              id="hero-view-inspection-table-btn"
              onClick={() => onNavigateTab('leadership-walkthrough')}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs sm:text-sm border border-slate-600 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Lihat Tabel Inspeksi ({total} Temuan)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-view-weekly-logs-btn"
              onClick={() => onNavigateTab('weekly-logs')}
              className="px-4 py-2.5 bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium rounded-xl text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Rekap Mingguan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Management KPI Metrics Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              Status Temuan Real-Time Manajemen
            </h2>
            <p className="text-xs text-slate-500">
              Ringkasan pemantauan seluruh tindak lanjut perbaikan pabrik saat ini
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Updated: Realtime Local
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Findings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Temuan</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">{total}</div>
            <p className="text-[11px] text-slate-500">Tercatat sepanjang audit Genba</p>
          </div>

          {/* Card 2: Open Findings */}
          <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-xs bg-rose-50/20 hover:border-rose-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Status Open</span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 mb-1">{openCount}</div>
            <p className="text-[11px] text-rose-700/80 font-medium">Perlu tindakan korektif segera</p>
          </div>

          {/* Card 3: In Progress */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs bg-amber-50/20 hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">In Progress</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mb-1">{inProgressCount}</div>
            <p className="text-[11px] text-amber-700/80 font-medium">Sedang dikerjakan PIC terkait</p>
          </div>

          {/* Card 4: Closed */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs bg-emerald-50/20 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Closed & Verified</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mb-1">{closedCount}</div>
            <p className="text-[11px] text-emerald-700/80 font-medium">Selesai terverifikasi dengan foto</p>
          </div>

          {/* Card 5: Closure Rate % */}
          <div className="col-span-2 sm:col-span-1 bg-white p-5 rounded-2xl border border-blue-200/80 shadow-xs bg-blue-50/20 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Closure Rate</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl sm:text-3xl font-black text-blue-700">{closureRate}%</span>
              <span className="text-xs text-slate-500">Target: 85%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  closureRate >= 80 ? 'bg-emerald-500' : closureRate >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, closureRate)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Department Improvement Achievement Bar Chart */}
      <DepartmentAchievementChart findings={findings} />

      {/* Grid: Distribusi Kategori & Prioritas Mendesak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi Kategori Temuan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Komposisi 5 Kategori Temuan
                </h3>
                <p className="text-xs text-slate-500">
                  Distribusi fokus perbaikan terstandardisasi pabrik
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                5 Kategori Standar
              </span>
            </div>

            {/* Stacked 100% Horizontal Proportion Bar */}
            <div className="mb-4">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                {FINDING_CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  if (pct === 0) return null;
                  const meta = CATEGORY_META[cat];
                  return (
                    <div
                      key={cat}
                      style={{ width: `${pct}%` }}
                      className={`${meta.barColor} transition-all duration-300 relative`}
                      title={`${meta.number}. ${cat}: ${count} (${Math.round(pct)}%)`}
                    />
                  );
                })}
              </div>
            </div>

            {/* 5 Categories List */}
            <div className="space-y-2 mb-6">
              {FINDING_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const meta = CATEGORY_META[cat];
                const Icon = meta.icon;

                return (
                  <div
                    key={cat}
                    onClick={() => onNavigateTab('leadership-walkthrough')}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/60 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center shrink-0 shadow-xs">
                        {meta.number}
                      </span>
                      <div className={`p-1.5 rounded-lg ${meta.badgeBg} shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-amber-800 transition-colors">
                          {cat}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Mini bar */}
                      <div className="hidden sm:block w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${meta.barColor} rounded-full`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-800">
                          {count}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold ml-1">
                          ({pct}%)
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgent Items Alert Box */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Perhatian Khusus Manajemen ({criticalCount} Isu Kritis)
              </span>
              <span className="text-[11px] text-rose-600 font-semibold">Prioritas Tindakan</span>
            </div>

            <div className="space-y-2">
              {urgentFindings.slice(0, 2).map((item) => (
                <div 
                  key={item.id}
                  className="p-2.5 bg-white rounded-xl border border-rose-100 flex items-center justify-between text-xs hover:border-rose-300 transition-colors shadow-2xs group"
                >
                  <div 
                    onClick={() => onSelectPhotoProof(item)}
                    className="min-w-0 pr-2 cursor-pointer flex-1"
                    title="Klik untuk melihat bukti foto"
                  >
                    <p className="font-bold text-slate-900 truncate group-hover:text-amber-700 transition-colors">{item.finding}</p>
                    <p className="text-[11px] text-slate-500 truncate">{item.area} &bull; PIC: {item.pic}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {item.priority}
                    </span>
                    {onEditFinding && (
                      <button
                        onClick={() => onEditFinding(item)}
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors cursor-pointer border border-amber-200"
                        title="Edit dan update progress perbaikan"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

