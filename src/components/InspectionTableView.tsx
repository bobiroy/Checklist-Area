import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  RotateCcw,
  Calendar,
  MapPin,
  Camera,
  Printer,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { InspectionFinding, FindingCategory, FindingStatus } from '../types';
import { FACTORY_AREAS, FINDING_CATEGORIES, DEPARTMENTS } from '../data/mockData';

interface InspectionTableViewProps {
  findings: InspectionFinding[];
  onOpenNewFindingModal: () => void;
  onEditFinding: (finding: InspectionFinding) => void;
  onDeleteFinding?: (id: string) => void;
  onSelectPhotoProof: (finding: InspectionFinding) => void;
  onQuickUpdateStatus: (id: string, newStatus: FindingStatus) => void;
}

export const InspectionTableView: React.FC<InspectionTableViewProps> = ({
  findings,
  onOpenNewFindingModal,
  onEditFinding,
  onSelectPhotoProof,
  onQuickUpdateStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Filtered dataset
  const filteredFindings = useMemo(() => {
    return findings.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = 
          item.id.toLowerCase().includes(q) ||
          item.finding.toLowerCase().includes(q) ||
          item.area.toLowerCase().includes(q) ||
          item.pic.toLowerCase().includes(q) ||
          item.correctiveAction.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.recordedBy && item.recordedBy.toLowerCase().includes(q)) ||
          item.inspectorName.toLowerCase().includes(q);
        if (!matchText) return false;
      }

      // Filter Area
      if (selectedArea !== 'ALL' && item.area !== selectedArea) {
        return false;
      }

      // Filter Category
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // Filter Status
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }

      // Filter Department
      if (selectedDept !== 'ALL' && !item.department.toLowerCase().includes(selectedDept.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [findings, searchQuery, selectedArea, selectedCategory, selectedStatus, selectedDept]);

  // Export CSV function
  const handleExportCSV = () => {
    const headers = [
      'ID',
      '1. Date',
      '2. Area',
      '3. Assessor (Penginput)',
      '4. Finding',
      '5. Category',
      '6. PIC',
      '7. Corrective Action',
      '8. Status',
      '9. Close Date',
      '10. Attachment URL',
      'Department',
      'Priority',
      'Inspector (Pimpinan)'
    ];

    const rows = filteredFindings.map((f) => [
      f.id,
      `"${f.date}"`,
      `"${f.area}"`,
      `"${(f.recordedBy || f.inspectorName).replace(/"/g, '""')}"`,
      `"${f.finding.replace(/"/g, '""')}"`,
      `"${f.category}"`,
      `"${f.pic.replace(/"/g, '""')}"`,
      `"${f.correctiveAction.replace(/"/g, '""')}"`,
      `"${f.status}"`,
      `"${f.closeDate || ''}"`,
      `"${f.attachmentUrl}"`,
      `"${f.department}"`,
      `"${f.priority}"`,
      `"${f.inspectorName}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `genba_leadership_inspection_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedArea('ALL');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedDept('ALL');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Audit & Action Items Registry
            </span>
            <span className="text-xs text-slate-500">Standar 9 Kolom Utama Sesuai Format Inspeksi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Leadership Walkthrough & Inspection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar tabel temuan lapangan, tindakan perbaikan, bukti foto before-after, serta status penutupan tiap PIC departemen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Audit Protection Notice: Temuan bersifat permanen dan tidak dapat dihapus */}
          <div 
            className="no-print px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            title="Sesuai standar audit ISO 9001 / SMK3, seluruh catatan temuan bersifat permanen dan tidak dapat dihapus."
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Proteksi Audit: Temuan Tidak Dapat Dihapus</span>
            <span className="sm:hidden">Audit Terproteksi</span>
          </div>

          <button
            onClick={() => window.print()}
            className="no-print px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Cetak Lembar Inspeksi"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak / Print</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="no-print px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ekspor ke format file CSV"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>

          <button
            id="table-add-new-btn"
            onClick={onOpenNewFindingModal}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Temuan Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kata kunci, ID temuan, area, PIC, deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50/50"
            />
          </div>

          {/* Quick status summary info */}
          <div className="text-xs text-slate-500 flex items-center gap-2 self-start md:self-auto">
            <span>Menampilkan <strong>{filteredFindings.length}</strong> dari <strong>{findings.length}</strong> total temuan</span>
            {(searchQuery || selectedArea !== 'ALL' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedDept !== 'ALL') && (
              <button
                onClick={resetFilters}
                className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 ml-2 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Filter 1: Area */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">Filter Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs"
            >
              <option value="ALL">Semua Area ({findings.length})</option>
              {FACTORY_AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Filter 2: Kategori */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">Filter Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs"
            >
              <option value="ALL">Semua Kategori</option>
              {FINDING_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Filter 3: Status */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">Filter Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
            >
              <option value="ALL">Semua Status</option>
              <option value="Open">🔴 Open</option>
              <option value="In Progress">🟡 In Progress</option>
              <option value="Pending Verification">🔵 Pending Verification</option>
              <option value="Closed">🟢 Closed</option>
            </select>
          </div>

          {/* Filter 4: Departemen */}
          <div>
            <label className="block font-bold text-slate-600 mb-1">Filter Departemen</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs"
            >
              <option value="ALL">Semua Departemen</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Improvement Table: Columns 1 to 10 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            {/* Table Header: Sequentially numbered columns 1 to 10 */}
            <thead className="bg-slate-900 text-slate-200 uppercase text-[11px] font-bold tracking-wider select-none">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 min-w-[105px]">1. Date</th>
                <th className="py-3.5 px-4 min-w-[140px]">2. Area</th>
                <th className="py-3.5 px-4 min-w-[155px]">3. Assessor (Penginput)</th>
                <th className="py-3.5 px-4 min-w-[260px]">4. Finding &amp; Photo</th>
                <th className="py-3.5 px-4 min-w-[130px]">5. Category</th>
                <th className="py-3.5 px-4 min-w-[150px]">6. PIC</th>
                <th className="py-3.5 px-4 min-w-[240px]">7. Corrective Action</th>
                <th className="py-3.5 px-4 min-w-[130px]">8. Status</th>
                <th className="py-3.5 px-4 min-w-[110px]">9. Close Date</th>
                <th className="py-3.5 px-4 min-w-[125px] text-center">10. Attachment</th>
                <th className="no-print py-3.5 px-4 min-w-[85px] text-center">Aksi</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {filteredFindings.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto text-center space-y-2">
                      <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                      <p className="font-bold text-slate-700 text-sm">Tidak ada temuan yang sesuai</p>
                      <p className="text-xs text-slate-500">Coba ubah kata kunci atau bersihkan filter pencarian Anda.</p>
                      <button
                        onClick={resetFilters}
                        className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFindings.map((item, index) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    {/* Index & ID */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-400 text-[11px]">
                      {index + 1}
                    </td>

                    {/* 1. Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.date}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.id}
                      </span>
                    </td>

                    {/* 2. Area */}
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-1 font-semibold text-slate-900">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item.area}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {item.department.split('&')[0]}
                      </span>
                    </td>

                    {/* Assessor / Penginput Temuan (Sebelah Kiri Finding & Photo) */}
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 border border-amber-300">
                          <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-xs leading-snug">
                            {item.recordedBy || 'Assessor Genba'}
                          </p>
                          <span className="text-[9px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                            Assessor Input
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Finding (with thumbnail proof) */}
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-3">
                        {/* Thumbnail image with click to inspect */}
                        <div 
                          className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-900 cursor-pointer shadow-xs group/img"
                          onClick={() => onSelectPhotoProof(item)}
                          title="Klik untuk memperbesar bukti foto temuan"
                        >
                          <img
                            src={item.attachmentUrl}
                            alt="Bukti temuan"
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                          <span className="absolute bottom-0 right-0 bg-rose-600 text-white text-[8px] font-bold px-1 rounded-tl">
                            BEFORE
                          </span>
                        </div>

                        {/* Finding text */}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 leading-snug">
                            {item.finding}
                          </p>
                          {item.priority === 'Critical' && (
                            <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                              ⚠️ Kritis / Bahaya
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 mt-1">
                            Pimpinan Walk: {item.inspectorName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 4. Category */}
                    <td className="py-3 px-4">
                      <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        item.category === '5R'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.category === 'Safety Stop 6'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item.category === 'Waste & Elimination'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : item.category === 'Quality'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : item.category === 'Material Flow'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {item.category}
                      </span>
                    </td>

                    {/* 5. PIC */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800 leading-tight">
                        {item.pic}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {item.department}
                      </p>
                    </td>

                    {/* 6. Corrective Action */}
                    <td className="py-3 px-4">
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {item.correctiveAction}
                      </p>
                      {item.impactScore && (
                        <p className="text-[10px] text-amber-800 font-semibold mt-1 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200/60 inline-block">
                          🎯 {item.impactScore}
                        </p>
                      )}
                    </td>

                    {/* 7. Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => onQuickUpdateStatus(item.id, e.target.value as FindingStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          item.status === 'Closed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : item.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : item.status === 'Pending Verification'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-rose-50 text-rose-700 border-rose-300'
                        }`}
                      >
                        <option value="Open">🔴 Open</option>
                        <option value="In Progress">🟡 In Progress</option>
                        <option value="Pending Verification">🔵 Pending Verification</option>
                        <option value="Closed">🟢 Closed</option>
                      </select>
                    </td>

                    {/* 8. Close Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.closeDate ? (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {item.closeDate}
                        </span>
                      ) : item.targetDate ? (
                        <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-amber-500" />
                          Target: {item.targetDate}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Belum Ditutup</span>
                      )}
                    </td>

                    {/* 10. Attachment for photo proof */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {item.attachmentAfterUrl ? (
                        <button
                          onClick={() => onSelectPhotoProof(item)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 cursor-pointer shadow-2xs"
                          title="Lihat foto bukti Before & After"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Before &amp; After</span>
                        </button>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => onSelectPhotoProof(item)}
                            className="px-2 py-1 rounded-lg text-[11px] font-bold border bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 inline-flex items-center gap-1 cursor-pointer"
                            title="Lihat foto bukti temuan awal (Before)"
                          >
                            <Camera className="w-3 h-3 text-amber-700" />
                            <span>Foto Proof</span>
                          </button>
                          <button
                            onClick={() => onEditFinding(item)}
                            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                            title="Tambah foto perbaikan (After) dan update progress"
                          >
                            <span>+ Foto After</span>
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Action button: Edit and update progress (temuan permanen tidak dapat dihapus) */}
                    <td className="no-print py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => onEditFinding(item)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          title="Edit temuan, unggah foto perbaikan (After), dan update progress"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-4">
            <span>Standar Genba Walk ISO 9001 / IATF 16949 / SMK3</span>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-700">Total: {filteredFindings.length} Catatan</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Integritas Audit: Temuan Terproteksi (Tidak Dapat Dihapus)</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Closed = Sudah Terverifikasi Foto After</span>
          </div>
        </div>
      </div>
    </div>
  );
};
