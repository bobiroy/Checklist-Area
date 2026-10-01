import React, { useState } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Printer, 
  Download, 
  Award, 
  Building2, 
  ArrowRight,
  Eye,
  Camera,
  Edit3
} from 'lucide-react';
import { InspectionFinding } from '../types';
import { DEPARTMENTS, GENBA_VISUAL_ACTIVITIES } from '../data/mockData';

interface WeeklyLogsViewProps {
  findings: InspectionFinding[];
  onSelectPhotoProof: (finding: InspectionFinding) => void;
  onEditFinding?: (finding: InspectionFinding) => void;
}

export const WeeklyLogsView: React.FC<WeeklyLogsViewProps> = ({
  findings,
  onSelectPhotoProof,
  onEditFinding
}) => {
  // Available weeks
  const availableWeeks = [
    { weekNumber: 38, label: 'Minggu ke-38 (21 - 27 September 2026) - Berjalan' },
    { weekNumber: 37, label: 'Minggu ke-37 (14 - 20 September 2026)' },
    { weekNumber: 36, label: 'Minggu ke-36 (07 - 13 September 2026)' },
    { weekNumber: 0, label: 'Semua Minggu (Kumulatif Bulan September)' }
  ];

  const [selectedWeek, setSelectedWeek] = useState<number>(38);

  // Filter findings for this week
  const weekFindings = selectedWeek === 0 
    ? findings 
    : findings.filter(f => f.weekNumber === selectedWeek);

  // Weekly metrics
  const totalFindings = weekFindings.length;
  const closedFindings = weekFindings.filter(f => f.status === 'Closed').length;
  const inProgressFindings = weekFindings.filter(f => f.status === 'In Progress' || f.status === 'Pending Verification').length;
  const openFindings = weekFindings.filter(f => f.status === 'Open').length;
  const closureRate = totalFindings > 0 ? Math.round((closedFindings / totalFindings) * 100) : 0;

  // Department recap table computation
  const departmentRecap = DEPARTMENTS.map(dept => {
    const deptItems = weekFindings.filter(f => 
      f.department.toLowerCase().includes(dept.name.toLowerCase()) || 
      f.department.toLowerCase().includes(dept.code.toLowerCase())
    );
    const closed = deptItems.filter(f => f.status === 'Closed').length;
    const inProgress = deptItems.filter(f => f.status === 'In Progress' || f.status === 'Pending Verification').length;
    const open = deptItems.filter(f => f.status === 'Open').length;
    const rate = deptItems.length > 0 ? Math.round((closed / deptItems.length) * 100) : 100;
    const targetMet = rate >= 80;

    return {
      dept,
      total: deptItems.length,
      closed,
      inProgress,
      open,
      rate,
      targetMet
    };
  });

  // Highlight of the week
  const weeklyHighlight = GENBA_VISUAL_ACTIVITIES[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Rekapitulasi Data Mingguan
            </span>
            <span className="text-xs text-slate-500">Evaluasi Progress &amp; Akuntabilitas Seluruh Departemen</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Weekly Finding Logs &amp; Department Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rangkuman berkala perbaikan temuan Genba Walk lintas departemen untuk rapat koordinasi operasional mingguan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Week Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              className="px-3.5 py-2 pr-8 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {availableWeeks.map((w) => (
                <option key={w.weekNumber} value={w.weekNumber}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="no-print px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan Mingguan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for Selected Week */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Temuan Minggu Ini</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalFindings}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Semua kategori audit</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase">Berhasil Ditutup</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{closedFindings}</div>
          <p className="text-[11px] text-emerald-700/80 mt-0.5 font-medium">Verifikasi foto OK</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-xs font-semibold text-amber-700 uppercase">Dalam Proses</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{inProgressFindings}</div>
          <p className="text-[11px] text-amber-700/80 mt-0.5 font-medium">Sedang dieksekusi</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <span className="text-xs font-semibold text-rose-700 uppercase">Masih Open</span>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{openFindings}</div>
          <p className="text-[11px] text-rose-700/80 mt-0.5 font-medium">Perlu penugasan</p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase">Weekly Closure</span>
            <span className="text-[10px] font-bold text-slate-500">Target: 85%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">{closureRate}%</div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${closureRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, closureRate)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Department Progress Recapitulation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              Rekapitulasi Progress Perbaikan Lintas Departemen
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi target ketercapaian tindakan korektif tiap penanggung jawab divisi
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            Total {DEPARTMENTS.length} Departemen Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Departemen Pabrik</th>
                <th className="py-3.5 px-4">Kepala Dept (PIC Lead)</th>
                <th className="py-3.5 px-4 text-center">Total Temuan</th>
                <th className="py-3.5 px-4 text-center">Closed</th>
                <th className="py-3.5 px-4 text-center">In Progress</th>
                <th className="py-3.5 px-4 text-center">Open</th>
                <th className="py-3.5 px-4 min-w-[150px]">Progress Penyelesaian</th>
                <th className="py-3.5 px-4 text-center">Status KPI</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {departmentRecap.map(({ dept, total, closed, inProgress, open, rate, targetMet }) => (
                <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                  {/* Departemen */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>{dept.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono pl-4.5">
                      Kode: {dept.code} &bull; Tim: {dept.teamSize} Personel
                    </span>
                  </td>

                  {/* Head */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800 text-xs">{dept.headName}</p>
                    <p className="text-[10px] text-slate-500">{dept.headTitle}</p>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 text-sm">
                    {total}
                  </td>

                  {/* Closed */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600 text-sm">
                    {closed}
                  </td>

                  {/* In Progress */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-600 text-sm">
                    {inProgress}
                  </td>

                  {/* Open */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600 text-sm">
                    {open}
                  </td>

                  {/* Progress Bar & Rate */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            rate >= 80 ? 'bg-emerald-500' : rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, rate)}%` }}
                        ></div>
                      </div>
                      <span className="font-bold font-mono text-xs w-9 text-right text-slate-800">
                        {rate}%
                      </span>
                    </div>
                  </td>

                  {/* Status KPI */}
                  <td className="py-3.5 px-4 text-center">
                    {total === 0 ? (
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        Zero Issue
                      </span>
                    ) : targetMet ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Target Tercapai
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        Perlu Akselerasi
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Showcase: Highlight Kaizen Minggu Ini */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl border border-amber-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200 text-amber-900 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            Kaizen of the Week
          </span>
          <span className="text-xs text-amber-900/70 font-semibold">
            Penghargaan Hasil Perbaikan Terbaik Minggu Ini
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Visual Before vs After */}
          <div className="md:col-span-1 rounded-xl overflow-hidden border border-amber-300 shadow-sm bg-slate-900 aspect-4/3 relative group">
            <img
              src={weeklyHighlight.afterPhoto}
              alt="Highlight perbaikan"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              HASIL IMPROVEMENT (AFTER)
            </div>
            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white p-2 rounded text-[11px]">
              <p className="font-bold truncate">{weeklyHighlight.area}</p>
              <p className="text-slate-300 text-[10px]">PIC: {weeklyHighlight.pic}</p>
            </div>
          </div>

          {/* Explanation */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-lg font-bold text-slate-900">
              {weeklyHighlight.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong>Solusi: </strong> {weeklyHighlight.solutionDescription}
            </p>
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 text-xs text-amber-900">
              <span className="font-bold">Dampak Nyata bagi Pabrik: </span>
              <span>{weeklyHighlight.impactSummary}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
              <span>Departemen: <strong>{weeklyHighlight.department}</strong></span>
              <span>Inspektor: <strong>{weeklyHighlight.leaderName}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* List of findings for the selected week */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Temuan Minggu Terpilih ({weekFindings.length} Temuan)
            </h3>
            <p className="text-xs text-slate-500">
              Rincian komprehensif tindakan korektif dan tanggal close date
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {weekFindings.map((f) => (
            <div
              key={f.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => onSelectPhotoProof(f)}
                  className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-900 cursor-pointer group"
                  title="Lihat foto bukti"
                >
                  <img
                    src={f.attachmentUrl}
                    alt={f.finding}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      {f.id}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {f.date} &bull; {f.area}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200/60 px-1.5 py-0.2 rounded">
                      {f.category}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 leading-snug truncate sm:max-w-xl">
                    {f.finding}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                    <strong>Aksi: </strong>{f.correctiveAction}
                  </p>
                </div>
              </div>

              {/* Status and close date info */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right text-xs">
                  <span className={`inline-block font-bold text-[11px] px-2 py-0.5 rounded-full border ${
                    f.status === 'Closed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : f.status === 'In Progress'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {f.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {f.closeDate ? `Closed: ${f.closeDate}` : `PIC: ${f.pic.split('(')[0]}`}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {onEditFinding && (
                    <button
                      onClick={() => onEditFinding(f)}
                      className="p-2 text-slate-500 hover:text-amber-700 hover:bg-white rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      title="Edit temuan dan update progress / foto after"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onSelectPhotoProof(f)}
                    className="p-2 text-slate-500 hover:text-amber-700 hover:bg-white rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    title="Buka bukti foto"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
