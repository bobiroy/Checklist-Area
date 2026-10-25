import React, { useState, useMemo } from 'react';
import { 
  Warehouse, 
  Scissors, 
  Truck, 
  Shirt, 
  Package, 
  Building2, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Store, 
  Flame, 
  BarChart3, 
  LayoutGrid, 
  Table, 
  ChevronRight, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { InspectionFinding, FactoryOption } from '../types';

export interface AreaPerformanceDashboardProps {
  findings: InspectionFinding[];
  initialFactory?: 'ALL' | FactoryOption;
  onNavigateToTable?: (areaFilter?: string, factoryFilter?: FactoryOption) => void;
}

export type MainAreaType = 'Warehouse' | 'Cutting' | 'Distribusi' | 'Sewing' | 'Finish Good';

export interface AreaMetricData {
  id: MainAreaType;
  name: string;
  department: string;
  icon: React.ElementType;
  badgeStyle: string;
  color: string;
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  closureRate: number;
  percentageOfTotal: number;
  subAreas?: {
    id: 'PPA' | 'Supermarket' | 'Heat Transfer';
    name: string;
    icon: React.ElementType;
    total: number;
    open: number;
    closed: number;
    closureRate: number;
  }[];
}

export const AreaPerformanceDashboard: React.FC<AreaPerformanceDashboardProps> = ({
  findings,
  initialFactory = 'ALL',
  onNavigateToTable
}) => {
  // Factory Filter: 'ALL' or specific factory ('AOI 1' | 'AOI 2' | 'AOI 3')
  const [selectedFactory, setSelectedFactory] = useState<'ALL' | FactoryOption>(initialFactory);

  // Sync with initialFactory changes if passed from parent
  React.useEffect(() => {
    if (initialFactory) {
      setSelectedFactory(initialFactory);
    }
  }, [initialFactory]);

  // View Display Mode: 'cards' | 'chart' | 'table'
  const [viewMode, setViewMode] = useState<'cards' | 'chart' | 'table'>('cards');

  // Filter findings based on selected factory
  const filteredFindings = useMemo(() => {
    if (selectedFactory === 'ALL') return findings;
    return findings.filter((f) => (f.factory || 'AOI 1') === selectedFactory);
  }, [findings, selectedFactory]);

  // Total findings in current factory filter
  const totalFindingsInScope = filteredFindings.length;

  // Helper classifier for any finding into one of the 5 canonical areas
  const classifyFinding = (f: InspectionFinding): {
    mainArea: MainAreaType;
    distribusiSub?: 'PPA' | 'Supermarket' | 'Heat Transfer';
  } => {
    const areaLower = (f.area || '').toLowerCase();
    const deptLower = (f.department || '').toLowerCase();
    const textLower = (f.finding || '').toLowerCase();

    // 1. Distribusi & Sub-areas: PPA, Supermarket, Heat Transfer
    if (
      areaLower.includes('distribusi') ||
      deptLower.includes('distribusi') ||
      areaLower.includes('ppa') ||
      deptLower.includes('ppa') ||
      textLower.includes('ppa') ||
      areaLower.includes('supermarket') ||
      areaLower.includes('heat transfer') ||
      areaLower.includes('transfer bundle')
    ) {
      if (areaLower.includes('ppa') || textLower.includes('ppa') || deptLower.includes('ppa')) {
        return { mainArea: 'Distribusi', distribusiSub: 'PPA' };
      }
      if (areaLower.includes('heat') || textLower.includes('heat transfer')) {
        return { mainArea: 'Distribusi', distribusiSub: 'Heat Transfer' };
      }
      return { mainArea: 'Distribusi', distribusiSub: 'Supermarket' };
    }

    // 2. Warehouse
    if (
      areaLower.includes('warehouse') ||
      deptLower.includes('warehouse') ||
      areaLower.includes('gudang') ||
      areaLower.includes('fabric roll') ||
      areaLower.includes('storage')
    ) {
      return { mainArea: 'Warehouse' };
    }

    // 3. Cutting
    if (
      areaLower.includes('cutting') ||
      deptLower.includes('cutting') ||
      areaLower.includes('potong') ||
      areaLower.includes('spreading') ||
      areaLower.includes('knife')
    ) {
      return { mainArea: 'Cutting' };
    }

    // 4. Sewing
    if (
      areaLower.includes('sewing') ||
      deptLower.includes('sewing') ||
      areaLower.includes('jahit') ||
      areaLower.includes('needle')
    ) {
      return { mainArea: 'Sewing' };
    }

    // 5. Finish Good / Finishing Packing
    if (
      areaLower.includes('finish') ||
      deptLower.includes('finish') ||
      areaLower.includes('fg') ||
      areaLower.includes('pack') ||
      deptLower.includes('pack') ||
      areaLower.includes('steam press') ||
      areaLower.includes('metal detector')
    ) {
      return { mainArea: 'Finish Good' };
    }

    return { mainArea: 'Warehouse' };
  };

  // Compute metrics for each of the 5 areas
  const areaMetrics = useMemo<AreaMetricData[]>(() => {
    const mainAreasOrder: {
      id: MainAreaType;
      name: string;
      department: string;
      icon: React.ElementType;
      badgeStyle: string;
      color: string;
    }[] = [
      {
        id: 'Warehouse',
        name: 'Warehouse',
        department: 'Warehouse',
        icon: Warehouse,
        badgeStyle: 'bg-amber-50 text-amber-700 border-amber-300',
        color: '#f59e0b'
      },
      {
        id: 'Cutting',
        name: 'Cutting',
        department: 'Cutting',
        icon: Scissors,
        badgeStyle: 'bg-blue-50 text-blue-700 border-blue-300',
        color: '#3b82f6'
      },
      {
        id: 'Distribusi',
        name: 'Distribusi',
        department: 'Distribusi',
        icon: Truck,
        badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-300',
        color: '#10b981'
      },
      {
        id: 'Sewing',
        name: 'Sewing',
        department: 'Sewing',
        icon: Shirt,
        badgeStyle: 'bg-purple-50 text-purple-700 border-purple-300',
        color: '#a855f7'
      },
      {
        id: 'Finish Good',
        name: 'Finish Good',
        department: 'Finish Good',
        icon: Package,
        badgeStyle: 'bg-rose-50 text-rose-700 border-rose-300',
        color: '#f43f5e'
      }
    ];

    return mainAreasOrder.map((areaDef) => {
      const areaFindings = filteredFindings.filter((f) => classifyFinding(f).mainArea === areaDef.id);
      const total = areaFindings.length;
      const open = areaFindings.filter((f) => f.status === 'Open').length;
      const inProgress = areaFindings.filter((f) => f.status === 'In Progress' || f.status === 'Pending Verification').length;
      const closed = areaFindings.filter((f) => f.status === 'Closed').length;
      const closureRate = total > 0 ? Math.round((closed / total) * 100) : 100;
      const percentageOfTotal = totalFindingsInScope > 0 ? Math.round((total / totalFindingsInScope) * 100) : 0;

      // Sub-area metrics for Distribusi (PPA, Supermarket, Heat Transfer)
      let subAreas: AreaMetricData['subAreas'] = undefined;
      if (areaDef.id === 'Distribusi') {
        const subDefs: { id: 'PPA' | 'Supermarket' | 'Heat Transfer'; name: string; icon: React.ElementType }[] = [
          { id: 'PPA', name: 'PPA (Auto & Manual)', icon: Cpu },
          { id: 'Supermarket', name: 'Supermarket Komponen', icon: Store },
          { id: 'Heat Transfer', name: 'Heat Transfer Press', icon: Flame }
        ];

        subAreas = subDefs.map((subDef) => {
          const subFindings = areaFindings.filter((f) => classifyFinding(f).distribusiSub === subDef.id);
          const sTotal = subFindings.length;
          const sOpen = subFindings.filter((f) => f.status === 'Open').length;
          const sClosed = subFindings.filter((f) => f.status === 'Closed').length;
          const sRate = sTotal > 0 ? Math.round((sClosed / sTotal) * 100) : 100;

          return {
            id: subDef.id,
            name: subDef.name,
            icon: subDef.icon,
            total: sTotal,
            open: sOpen,
            closed: sClosed,
            closureRate: sRate
          };
        });
      }

      return {
        id: areaDef.id,
        name: areaDef.name,
        department: areaDef.department,
        icon: areaDef.icon,
        badgeStyle: areaDef.badgeStyle,
        color: areaDef.color,
        total,
        open,
        inProgress,
        closed,
        closureRate,
        percentageOfTotal,
        subAreas
      };
    });
  }, [filteredFindings, totalFindingsInScope]);

  // Overall totals in the selected scope
  const totalClosed = filteredFindings.filter((f) => f.status === 'Closed').length;
  const totalOpen = filteredFindings.filter((f) => f.status === 'Open').length;
  const totalInProgress = filteredFindings.filter((f) => f.status === 'In Progress' || f.status === 'Pending Verification').length;
  const overallRate = totalFindingsInScope > 0 ? Math.round((totalClosed / totalFindingsInScope) * 100) : 0;

  // Chart data for Recharts
  const chartData = useMemo(() => {
    return areaMetrics.map((m) => ({
      name: m.name,
      total: m.total,
      open: m.open,
      inProgress: m.inProgress,
      closed: m.closed,
      rate: m.closureRate,
      color: m.color
    }));
  }, [areaMetrics]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header Bar: Title & Factory Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>Pemantauan Temuan Tiap Area per Factory</span>
            </h3>
            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              Live Monitoring
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pantau total temuan, rasio status perbaikan, dan persentase kepatuhan (Closure Rate) untuk tiap area produksi.
          </p>
        </div>

        {/* Factory Selector Pills & View Mode Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Factory Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedFactory('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFactory === 'ALL'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua (AOI 1-3)
            </button>
            {(['AOI 1', 'AOI 2', 'AOI 3'] as FactoryOption[]).map((fac) => {
              const facCount = findings.filter((f) => (f.factory || 'AOI 1') === fac).length;
              return (
                <button
                  key={fac}
                  onClick={() => setSelectedFactory(fac)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedFactory === fac
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{fac}</span>
                  <span className={`text-[10px] font-mono px-1 py-0.2 rounded-full ${
                    selectedFactory === fac ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {facCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Toggle View: Cards vs Chart vs Table */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tampilan Kartu Area"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'chart' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grafik Batang Performa"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tabel Matriks Lengkap"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Scope Performance Bar */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Filter Aktif:</span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
            {selectedFactory === 'ALL' ? 'Seluruh Fasilitas (AOI 1 - AOI 3)' : `Unit Pabrik ${selectedFactory}`}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">
            Total Terdata: <strong className="text-slate-900">{totalFindingsInScope} Temuan</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {totalOpen} Open
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            {totalInProgress} In Progress
          </span>
          <span className="flex items-center gap-1 font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {totalClosed} Closed
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-blue-700">
            Rata-rata Selesai: {overallRate}%
          </span>
        </div>
      </div>

      {/* 1. CARDS VIEW: 5 Main Areas Cards with Sub-Areas for Distribusi */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {areaMetrics.map((area, idx) => {
            const AreaIcon = area.icon;
            const isHighPerformance = area.closureRate >= 80;
            const isMedium = area.closureRate >= 60 && area.closureRate < 80;

            return (
              <div
                key={area.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 p-4 shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top: Icon & Area Index */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-800 flex items-center justify-center transition-colors">
                      <AreaIcon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                      Area 0{idx + 1}
                    </span>
                  </div>

                  {/* Title & Dept Badge */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {area.name}
                    </h4>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${area.badgeStyle}`}>
                      {area.department}
                    </span>
                  </div>

                  {/* Total Findings & Proportion */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Total Temuan</span>
                      <div className="text-2xl font-black text-slate-900 leading-tight">
                        {area.total}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-medium">Proporsi</span>
                      <div className="text-xs font-bold text-amber-800 font-mono">
                        {area.percentageOfTotal}% pabrik
                      </div>
                    </div>
                  </div>

                  {/* Status Breakdown Pills */}
                  <div className="grid grid-cols-3 gap-1.5 my-3 text-center text-[10px]">
                    <div className="p-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/60 font-bold">
                      <div>{area.open}</div>
                      <div className="text-[9px] text-rose-600 font-normal">Open</div>
                    </div>
                    <div className="p-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60 font-bold">
                      <div>{area.inProgress}</div>
                      <div className="text-[9px] text-amber-600 font-normal">Progress</div>
                    </div>
                    <div className="p-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-bold">
                      <div>{area.closed}</div>
                      <div className="text-[9px] text-emerald-600 font-normal">Closed</div>
                    </div>
                  </div>

                  {/* Closure Rate % Bar */}
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-semibold">Tingkat Selesai:</span>
                      <span className={`font-black font-mono ${
                        isHighPerformance ? 'text-emerald-600' : isMedium ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {area.closureRate}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHighPerformance ? 'bg-emerald-500' : isMedium ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, area.closureRate)}%` }}
                      />
                    </div>
                  </div>

                  {/* Specific Sub-Areas for Distribusi (PPA, Supermarket, Heat Transfer) */}
                  {area.subAreas && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-900 tracking-wider">
                        Rincian Sub-Area:
                      </span>
                      <div className="space-y-1">
                        {area.subAreas.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <div 
                              key={sub.id}
                              className="px-2 py-1 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-[10px]"
                            >
                              <span className="flex items-center gap-1 font-semibold text-emerald-950">
                                <SubIcon className="w-3 h-3 text-emerald-700" />
                                {sub.id}
                              </span>
                              <div className="flex items-center gap-1.5 font-mono">
                                <span className="font-bold text-slate-800">{sub.total} temuan</span>
                                <span className="text-[9px] text-emerald-700">({sub.closureRate}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                {onNavigateToTable && (
                  <button
                    onClick={() => onNavigateToTable(area.name, selectedFactory === 'ALL' ? undefined : selectedFactory)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-[11px] font-bold border border-slate-200 hover:border-amber-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Rincian</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. CHART VIEW: Recharts Grouped Comparison */}
      {viewMode === 'chart' && (
        <div className="space-y-4">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 20, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs">
                          <p className="font-bold text-amber-400 mb-1">{d.name}</p>
                          <p>Total Temuan: <strong className="font-mono text-white">{d.total}</strong></p>
                          <p className="text-rose-400">Open: {d.open}</p>
                          <p className="text-amber-400">In Progress: {d.inProgress}</p>
                          <p className="text-emerald-400">Closed: {d.closed}</p>
                          <p className="text-blue-300 mt-1 font-semibold border-t border-slate-700 pt-1">
                            Tingkat Selesai: {d.rate}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  wrapperStyle={{ fontSize: '11px', fontWeight: 600 }}
                />
                <Bar dataKey="open" name="Open" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inProgress" name="In Progress" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" name="Closed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Perbandingan status temuan terbuka vs selesai di setiap area produksi untuk unit pabrik terpilih.
          </p>
        </div>
      )}

      {/* 3. TABLE VIEW: Full Detailed Matrix */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Area Produksi</th>
                <th className="py-2.5 px-3">Departemen</th>
                <th className="py-2.5 px-3 text-center">Total Temuan</th>
                <th className="py-2.5 px-3 text-center">% dari Pabrik</th>
                <th className="py-2.5 px-3 text-center text-rose-700">Open</th>
                <th className="py-2.5 px-3 text-center text-amber-700">Progress</th>
                <th className="py-2.5 px-3 text-center text-emerald-700">Closed</th>
                <th className="py-2.5 px-3 text-center">Closure Rate</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {areaMetrics.map((area) => (
                <React.Fragment key={area.id}>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-extrabold text-slate-900 flex items-center gap-2">
                      <area.icon className="w-4 h-4 text-slate-500" />
                      <span>{area.name}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${area.badgeStyle}`}>
                        {area.department}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-black font-mono text-sm text-slate-900">
                      {area.total}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-800 font-mono">
                      {area.percentageOfTotal}%
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-600 font-mono">
                      {area.open}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-600 font-mono">
                      {area.inProgress}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-600 font-mono">
                      {area.closed}
                    </td>
                    <td className="py-2.5 px-3 text-center font-black font-mono text-sm">
                      <span className={area.closureRate >= 80 ? 'text-emerald-600' : area.closureRate >= 60 ? 'text-amber-600' : 'text-rose-600'}>
                        {area.closureRate}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        area.closureRate >= 80 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : area.closureRate >= 60 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {area.closureRate >= 80 ? 'Optimal' : area.closureRate >= 60 ? 'Waspada' : 'Kritis'}
                      </span>
                    </td>
                  </tr>

                  {/* Render Distribusi Sub-Areas in Table */}
                  {area.subAreas && area.subAreas.map((sub) => (
                    <tr key={sub.id} className="bg-emerald-50/20 text-[11px] text-slate-600">
                      <td className="py-1.5 px-3 pl-8 flex items-center gap-1.5">
                        <span className="text-emerald-500 font-bold">&bull;</span>
                        <sub.icon className="w-3 h-3 text-emerald-700" />
                        <span>Sub: {sub.name}</span>
                      </td>
                      <td className="py-1.5 px-3 text-emerald-700 text-[10px]">Distribusi ({sub.id})</td>
                      <td className="py-1.5 px-3 text-center font-mono font-bold text-slate-800">{sub.total}</td>
                      <td className="py-1.5 px-3 text-center text-slate-400 font-mono">-</td>
                      <td className="py-1.5 px-3 text-center text-rose-600 font-mono">{sub.open}</td>
                      <td className="py-1.5 px-3 text-center text-slate-400 font-mono">-</td>
                      <td className="py-1.5 px-3 text-center text-emerald-600 font-mono">{sub.closed}</td>
                      <td className="py-1.5 px-3 text-center font-mono font-bold text-emerald-700">{sub.closureRate}%</td>
                      <td className="py-1.5 px-3 text-center">
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800">Sub-Area</span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
