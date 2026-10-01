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
  Filter, 
  BarChart2, 
  SlidersHorizontal,
  Target,
  Sparkles
} from 'lucide-react';
import { InspectionFinding } from '../types';
import { DEPARTMENTS } from '../data/mockData';

interface DepartmentAchievementChartProps {
  findings: InspectionFinding[];
}

export const DepartmentAchievementChart: React.FC<DepartmentAchievementChartProps> = ({ findings }) => {
  const [chartMode, setChartMode] = useState<'percentage' | 'stacked'>('percentage');
  const [sortBy, setSortBy] = useState<'rate' | 'name' | 'total'>('rate');

  // Compute stats per department
  const rawData = DEPARTMENTS.map((dept) => {
    const deptFindings = findings.filter(
      (f) =>
        f.department.toLowerCase().includes(dept.name.toLowerCase()) ||
        f.department.toLowerCase().includes(dept.code.toLowerCase())
    );
    const total = deptFindings.length;
    const closed = deptFindings.filter((f) => f.status === 'Closed').length;
    const open = deptFindings.filter((f) => f.status === 'Open').length;
    const inProgress = deptFindings.filter(
      (f) => f.status === 'In Progress' || f.status === 'Pending Verification'
    ).length;
    const rate = total > 0 ? Math.round((closed / total) * 100) : 100;

    return {
      id: dept.id,
      name: dept.name,
      code: dept.code,
      displayName: `${dept.code} - ${dept.name}`,
      headName: dept.headName,
      total,
      closed,
      open,
      inProgress,
      rate,
      target: 85
    };
  });

  // Sort data
  const data = [...rawData].sort((a, b) => {
    if (sortBy === 'rate') return b.rate - a.rate;
    if (sortBy === 'total') return b.total - a.total;
    return a.name.localeCompare(b.name);
  });

  // Calculate overall metrics
  const totalFindings = findings.length;
  const totalClosed = findings.filter((f) => f.status === 'Closed').length;
  const averageRate = totalFindings > 0 ? Math.round((totalClosed / totalFindings) * 100) : 0;
  
  // Best and needs attention
  const bestDept = [...rawData].sort((a, b) => b.rate - a.rate)[0];
  const lowestDept = [...rawData].sort((a, b) => a.rate - b.rate)[0];

  // Helper color for percentage bar
  const getBarColor = (rate: number) => {
    if (rate >= 85) return '#10b981'; // Emerald 500
    if (rate >= 65) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  // Custom tooltip for Percentage Bar Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
            <span className="font-bold text-amber-400">{item.code} - {item.name}</span>
            <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
              PIC: {item.headName.split(',')[0]}
            </span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Pencapaian Selesai:</span>
              <span className={`font-black text-sm ${item.rate >= 85 ? 'text-emerald-400' : item.rate >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                {item.rate}%
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Target Benchmark:</span>
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
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              Diagram Batang Pencapaian Perbaikan
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">&bull; Realtime Department Performance</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Dashboard Pencapaian Perbaikan per Departemen
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualisasi tingkat penyelesaian temuan (Closure Rate %) dan perbandingannya terhadap target SLA pabrik (85%)
          </p>
        </div>

        {/* View and Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setChartMode('percentage')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                chartMode === 'percentage'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
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
              <option value="rate">Urut: % Tertinggi</option>
              <option value="total">Urut: Total Temuan</option>
              <option value="name">Urut: Nama Dept</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Summary Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Rata-Rata Pabrik
            </span>
            <span className="text-xl font-black text-slate-900">
              {averageRate}%
            </span>
            <span className="text-[11px] text-slate-500 ml-1.5">
              ({totalClosed}/{totalFindings} Selesai)
            </span>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
            averageRate >= 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              Pencapaian Tertinggi
            </span>
            <span className="text-sm font-bold text-slate-900 block truncate max-w-[150px]">
              {bestDept?.name}
            </span>
            <span className="text-xs font-black text-emerald-700">
              {bestDept?.rate}% ({bestDept?.closed}/{bestDept?.total} Selesai)
            </span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Top
          </span>
        </div>

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
              Benchmark Target Audit
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <Target className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="w-full h-80 sm:h-96 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'percentage' ? (
            /* Bar Chart: Percentage (%) Closure Rate */
            <BarChart
              data={data}
              margin={{ top: 25, right: 20, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="code" 
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
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
              
              {/* Reference line for 85% Target */}
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
                {/* Dynamically color bars based on percentage */}
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.rate)} />
                ))}

                {/* Direct percentage labels above every bar */}
                <LabelList 
                  dataKey="rate" 
                  position="top" 
                  formatter={(val: any) => `${val ?? 0}%`}
                  style={{ fill: '#0f172a', fontSize: 12, fontWeight: 800 }}
                />
              </Bar>
            </BarChart>
          ) : (
            /* Stacked Bar Chart: Volume of Closed, In Progress, Open with % in tooltip */
            <BarChart
              data={data}
              margin={{ top: 25, right: 20, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="code" 
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
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

      {/* Legend & Department Indicators Grid */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="font-bold text-slate-700">Indikator Kepatuhan:</span>
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

        {/* Small Data Cards per Department */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
          {data.map((dept) => {
            const isTargetMet = dept.rate >= 85;
            return (
              <div 
                key={dept.id}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {dept.code}
                  </span>
                  <span className={`text-xs font-black ${
                    dept.rate >= 85 ? 'text-emerald-600' : dept.rate >= 65 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {dept.rate}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate" title={dept.name}>
                  {dept.name}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>{dept.closed}/{dept.total} Closed</span>
                  {isTargetMet ? (
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
