import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine, 
  Cell,
  LabelList
} from 'recharts';
import { 
  Award, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  BarChart2, 
  SlidersHorizontal,
  Target,
  Sparkles,
  MapPin,
  Layers,
  Building2,
  Check,
  XCircle
} from 'lucide-react';
import { InspectionFinding, FactoryOption } from '../types';
import { DEPARTMENTS } from '../data/mockData';

interface FactoryAchievementChartProps {
  factory: FactoryOption;
  findings: InspectionFinding[];
  selectedAreaFilter?: string | null;
  onSelectAreaFilter?: (area: string | null) => void;
}

export const FactoryAchievementChart: React.FC<FactoryAchievementChartProps> = ({ 
  factory,
  findings,
  selectedAreaFilter,
  onSelectAreaFilter
}) => {
  // Mode chart: persentase (%) atau volume bertumpuk (stacked) menyerupai Genba Dashboard
  const [chartMode, setChartMode] = useState<'percentage' | 'stacked'>('percentage');
  // Dimensi data: per Area kerja atau per Departemen di factory tersebut
  const [dataDimension, setDataDimension] = useState<'area' | 'department'>('area');
  // Opsi pengurutan
  const [sortBy, setSortBy] = useState<'rate' | 'name' | 'total'>('total');

  // Filter temuan khusus factory yang dipilih
  const factoryFindings = findings.filter(
    (f) => (f.factory || 'AOI 1') === factory
  );

  // 1. Data per Area Khusus Factory
  const areaMap: Record<string, {
    total: number;
    closed: number;
    open: number;
    inProgress: number;
    department?: string;
  }> = {};

  factoryFindings.forEach((f) => {
    const areaKey = f.area.trim();
    if (!areaMap[areaKey]) {
      areaMap[areaKey] = {
        total: 0,
        closed: 0,
        open: 0,
        inProgress: 0,
        department: f.department
      };
    }
    areaMap[areaKey].total++;
    if (f.status === 'Closed') {
      areaMap[areaKey].closed++;
    } else if (f.status === 'Open') {
      areaMap[areaKey].open++;
    } else {
      areaMap[areaKey].inProgress++;
    }
  });

  const areaDataRaw = Object.entries(areaMap).map(([areaName, stats], index) => {
    const rate = stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0;
    // Format nama ringkas untuk sumbu X
    const words = areaName.split(' - ');
    const shortLabel = words.length > 1 ? words[words.length - 1] : areaName;
    const truncatedLabel = shortLabel.length > 18 ? `${shortLabel.slice(0, 16)}...` : shortLabel;

    return {
      id: `area-${index}`,
      fullName: areaName,
      name: truncatedLabel,
      code: `A${index + 1}`,
      department: stats.department || 'Warehouse',
      total: stats.total,
      closed: stats.closed,
      open: stats.open,
      inProgress: stats.inProgress,
      rate,
      target: 85
    };
  });

  // 2. Data per Departemen di Factory Terpilih
  const deptDataRaw = DEPARTMENTS.map((dept) => {
    const deptFindings = factoryFindings.filter((f) => {
      const fDept = (f.department || '').toLowerCase();
      const fArea = (f.area || '').toLowerCase();
      const dName = dept.name.toLowerCase();
      const dCode = dept.code.toLowerCase();

      if (fDept.includes(dName) || fDept.includes(dCode)) return true;

      if (dept.id === 'fp' || dName.includes('finishing')) {
        return fDept.includes('finish') || fArea.includes('finish') || fDept.includes('pack');
      }
      if (dept.id === 'ppa' || dName === 'ppa') {
        return fDept.includes('ppa') || fArea.includes('ppa');
      }
      if (dept.id === 'dist' || dName.includes('distribusi')) {
        return fDept.includes('distribusi') || fArea.includes('distribusi') || fArea.includes('supermarket') || fArea.includes('heat transfer');
      }
      if (dept.id === 'wh' || dName.includes('warehouse')) {
        return fDept.includes('warehouse') || fArea.includes('warehouse') || fArea.includes('gudang');
      }
      if (dept.id === 'cut' || dName.includes('cutting')) {
        return fDept.includes('cutting') || fArea.includes('cutting') || fArea.includes('potong');
      }
      if (dept.id === 'sew' || dName.includes('sewing')) {
        return fDept.includes('sewing') || fArea.includes('sewing') || fArea.includes('jahit');
      }
      return false;
    });
    const total = deptFindings.length;
    const closed = deptFindings.filter((f) => f.status === 'Closed').length;
    const open = deptFindings.filter((f) => f.status === 'Open').length;
    const inProgress = deptFindings.filter(
      (f) => f.status === 'In Progress' || f.status === 'Pending Verification'
    ).length;
    const rate = total > 0 ? Math.round((closed / total) * 100) : (total === 0 ? 100 : 0);

    return {
      id: dept.id,
      fullName: `${dept.code} - ${dept.name}`,
      name: dept.name,
      code: dept.code,
      headName: dept.headName,
      department: dept.name,
      total,
      closed,
      open,
      inProgress,
      rate,
      target: 85
    };
  });

  // Pilih dataset aktif berdasarkan dimensi (Area vs Departemen)
  const activeDataset = dataDimension === 'area' ? areaDataRaw : deptDataRaw;

  // Sorting
  const sortedData = [...activeDataset].sort((a, b) => {
    if (sortBy === 'rate') return b.rate - a.rate;
    if (sortBy === 'total') return b.total - a.total;
    return a.fullName.localeCompare(b.fullName);
  });

  // Perhitungan metrik ringkasan pabrik ini
  const totalFindingsCount = factoryFindings.length;
  const totalClosedCount = factoryFindings.filter((f) => f.status === 'Closed').length;
  const averageRate = totalFindingsCount > 0 ? Math.round((totalClosedCount / totalFindingsCount) * 100) : 0;

  // Unit / Area pencapaian tertinggi & terendah
  const bestItem = [...sortedData].filter(i => i.total > 0).sort((a, b) => b.rate - a.rate)[0];

  // Helper warna bar berdasarkan persentase
  const getBarColor = (rate: number, total: number) => {
    if (total === 0) return '#94a3b8'; // Slate 400
    if (rate >= 85) return '#10b981'; // Emerald 500
    if (rate >= 65) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  // Custom tooltip gelap bergaya elegan persis Genba Dashboard
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 text-xs min-w-[220px]">
          <div className="border-b border-slate-700 pb-2 mb-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-amber-400 text-xs truncate max-w-[160px]">
                {item.fullName}
              </span>
              <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 shrink-0">
                {factory}
              </span>
            </div>
            {item.department && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dept: {item.department}
              </p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Pencapaian Selesai:</span>
              <span className={`font-black text-sm ${item.rate >= 85 ? 'text-emerald-400' : item.rate >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                {item.rate}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Target Benchmark SLA:</span>
              <span className="text-slate-200 font-semibold">{item.target}%</span>
            </div>
            <div className="border-t border-slate-800 pt-1.5 mt-1 space-y-1 text-[11px]">
              <div className="flex justify-between text-emerald-400">
                <span>&bull; Selesai (Closed):</span>
                <span className="font-bold">{item.closed}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>&bull; In Progress:</span>
                <span className="font-bold">{item.inProgress}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>&bull; Open:</span>
                <span className="font-bold">{item.open}</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800 font-bold">
                <span>Total Temuan:</span>
                <span>{item.total}</span>
              </div>
            </div>
          </div>
          {onSelectAreaFilter && dataDimension === 'area' && (
            <p className="text-[10px] text-amber-300 mt-2 pt-1 border-t border-slate-800 italic text-center">
              *Klik batang/kartu untuk memfilter tabel
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header and Controls (Menyerupai Genba Dashboard) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              Diagram Batang Pencapaian &bull; {factory}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">&bull; Realtime Factory Analysis</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Dashboard Diagram Batang Temuan {factory}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualisasi tingkat penyelesaian temuan (Closure Rate %) dan volume temuan per {dataDimension === 'area' ? 'area kerja' : 'departemen'} di unit pabrik {factory} terhadap target SLA (85%)
          </p>
        </div>

        {/* View and Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Dimension Switcher (Area vs Dept) */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
            <button
              onClick={() => setDataDimension('area')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                dataDimension === 'area'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilkan diagram batang per area kerja di pabrik ini"
            >
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>Per Area</span>
            </button>
            <button
              onClick={() => setDataDimension('department')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                dataDimension === 'department'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilkan diagram batang per departemen di pabrik ini"
            >
              <Layers className="w-3 h-3 text-blue-600" />
              <span>Per Dept</span>
            </button>
          </div>

          {/* Mode Switcher: Persentase vs Volume Temuan */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
            <button
              onClick={() => setChartMode('percentage')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartMode === 'percentage'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilkan rasio persentase penyelesaian (%)"
            >
              Persentase (%)
            </button>
            <button
              onClick={() => setChartMode('stacked')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartMode === 'stacked'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilkan volume temuan bertumpuk (Stacked: Closed, In Progress, Open)"
            >
              Volume Temuan
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="total">Urut: Total Temuan</option>
              <option value="rate">Urut: % Tertinggi</option>
              <option value="name">Urut: Nama</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Summary Highlights Strip (Persis Genba Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Rata-Rata Pabrik */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Rata-Rata {factory}
            </span>
            <span className="text-xl font-black text-slate-900">
              {averageRate}%
            </span>
            <span className="text-[11px] text-slate-500 ml-1.5">
              ({totalClosedCount}/{totalFindingsCount} Selesai)
            </span>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
            averageRate >= 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Pencapaian Tertinggi */}
        <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              Pencapaian Tertinggi
            </span>
            <span className="text-sm font-bold text-slate-900 block truncate max-w-[160px]">
              {bestItem?.fullName || 'Belum ada data'}
            </span>
            <span className="text-xs font-black text-emerald-700">
              {bestItem ? `${bestItem.rate}% (${bestItem.closed}/${bestItem.total} Selesai)` : '-'}
            </span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Top
          </span>
        </div>

        {/* Target SLA Standar */}
        <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-600" />
              Target SLA Standar
            </span>
            <span className="text-xl font-black text-amber-800">
              85%
            </span>
            <span className="text-[11px] text-slate-500 ml-1.5">
              Benchmark SLA {factory}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <Target className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Chart Area (Recharts Component persis Genba Dashboard) */}
      {sortedData.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Belum ada temuan di unit pabrik {factory}</p>
          <p className="text-xs text-slate-400 mt-1">
            Gunakan tombol "Catat Temuan Baru" untuk menambahkan temuan inspeksi pada unit ini.
          </p>
        </div>
      ) : (
        <div className="w-full h-80 sm:h-96 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'percentage' ? (
              /* Bar Chart: Percentage (%) Closure Rate */
              <BarChart
                data={sortedData}
                margin={{ top: 25, right: 20, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  interval={0}
                  angle={sortedData.length > 5 ? -25 : 0}
                  textAnchor={sortedData.length > 5 ? 'end' : 'middle'}
                  height={sortedData.length > 5 ? 60 : 30}
                />
                <YAxis 
                  domain={[0, 100]} 
                  ticks={[0, 20, 40, 60, 80, 85, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                
                {/* Reference line for 85% Target SLA */}
                <ReferenceLine 
                  y={85} 
                  stroke="#f59e0b" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  label={{ 
                    value: 'Target SLA: 85%', 
                    position: 'top', 
                    fill: '#d97706', 
                    fontSize: 11, 
                    fontWeight: 700 
                  }} 
                />

                <Bar 
                  dataKey="rate" 
                  name="Pencapaian (%)" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={56}
                >
                  {/* Dynamic Color Bars based on Percentage */}
                  {sortedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getBarColor(entry.rate, entry.total)} 
                      cursor="pointer"
                      onClick={() => {
                        if (onSelectAreaFilter && dataDimension === 'area') {
                          onSelectAreaFilter(selectedAreaFilter === entry.fullName ? null : entry.fullName);
                        }
                      }}
                    />
                  ))}

                  {/* Direct percentage labels above every bar */}
                  <LabelList 
                    dataKey="rate" 
                    position="top" 
                    formatter={(val: any) => `${val ?? 0}%`}
                    style={{ fill: '#0f172a', fontSize: 11, fontWeight: 800 }}
                  />
                </Bar>
              </BarChart>
            ) : (
              /* Stacked Bar Chart: Volume of Closed, In Progress, Open */
              <BarChart
                data={sortedData}
                margin={{ top: 25, right: 20, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  interval={0}
                  angle={sortedData.length > 5 ? -25 : 0}
                  textAnchor={sortedData.length > 5 ? 'end' : 'middle'}
                  height={sortedData.length > 5 ? 60 : 30}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="closed" 
                  name="Selesai (Closed)" 
                  stackId="a" 
                  fill="#10b981" 
                  maxBarSize={56}
                />
                <Bar 
                  dataKey="inProgress" 
                  name="In Progress" 
                  stackId="a" 
                  fill="#f59e0b" 
                  maxBarSize={56}
                />
                <Bar 
                  dataKey="open" 
                  name="Open" 
                  stackId="a" 
                  fill="#ef4444" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={56}
                >
                  {/* Show rate percentage on top of the bar */}
                  <LabelList 
                    dataKey="rate" 
                    position="top" 
                    formatter={(val: any) => `${val ?? 0}%`}
                    style={{ fill: '#0f172a', fontSize: 11, fontWeight: 800 }}
                  />
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend & Indicator Grid di Bawah Diagram (Persis Genba Dashboard) */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="font-bold text-slate-700">Indikator Kepatuhan {factory}:</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span>&ge; 85% (Memenuhi Target SLA)</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span>65% - 84% (Menuju Target)</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span>&lt; 65% (Perlu Akselerasi)</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <span className="w-2.5 h-0.5 bg-amber-500 border border-amber-600"></span>
            <span>Garis Kuning Putus-putus: Target SLA 85%</span>
          </div>
        </div>

        {/* Selected Filter Alert */}
        {selectedAreaFilter && dataDimension === 'area' && (
          <div className="mb-3 p-2.5 bg-amber-50 rounded-xl border border-amber-300 flex items-center justify-between text-xs text-amber-900">
            <span className="font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              Menyaring tabel temuan khusus area: <strong>"{selectedAreaFilter}"</strong>
            </span>
            <button
              onClick={() => onSelectAreaFilter && onSelectAreaFilter(null)}
              className="px-2 py-0.5 bg-white rounded-md text-amber-800 font-bold hover:bg-amber-100 flex items-center gap-1 cursor-pointer"
            >
              <XCircle className="w-3 h-3" />
              <span>Hapus Filter</span>
            </button>
          </div>
        )}

        {/* Small Data Cards per Area / Dept */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {sortedData.map((item) => {
            const isTargetMet = item.rate >= 85;
            const isSelected = selectedAreaFilter === item.fullName && dataDimension === 'area';

            return (
              <div 
                key={item.id}
                onClick={() => {
                  if (onSelectAreaFilter && dataDimension === 'area') {
                    onSelectAreaFilter(isSelected ? null : item.fullName);
                  }
                }}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400 shadow-sm'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300'
                }`}
                title="Klik untuk filter tabel"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {item.code}
                  </span>
                  <span className={`text-xs font-black ${
                    item.total === 0 ? 'text-slate-400' : item.rate >= 85 ? 'text-emerald-600' : item.rate >= 65 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {item.total === 0 ? '-' : `${item.rate}%`}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate" title={item.fullName}>
                  {item.fullName}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>{item.closed}/{item.total} Closed</span>
                  {item.total === 0 ? (
                    <span className="text-[10px] text-slate-400">0 temuan</span>
                  ) : isTargetMet ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
