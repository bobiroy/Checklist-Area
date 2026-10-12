import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  Plus, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Building, 
  ShieldCheck, 
  ClipboardCheck, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar,
  X,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { BiMonthlyAssessor, AssessorRoleGroup } from '../types';
import { BI_MONTHLY_ASSESSORS } from '../data/mockData';

interface BiMonthlyAssessorTableProps {
  onScheduleSession?: () => void;
  compactMode?: boolean;
}

export const BiMonthlyAssessorTable: React.FC<BiMonthlyAssessorTableProps> = ({ 
  onScheduleSession,
  compactMode = false
}) => {
  // LocalStorage persistence for assessors
  const [assessors, setAssessors] = useState<BiMonthlyAssessor[]>(() => {
    const saved = localStorage.getItem('genba_bi_monthly_assessors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing genba_bi_monthly_assessors', e);
      }
    }
    return BI_MONTHLY_ASSESSORS;
  });

  useEffect(() => {
    localStorage.setItem('genba_bi_monthly_assessors', JSON.stringify(assessors));
  }, [assessors]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessor, setEditingAssessor] = useState<BiMonthlyAssessor | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<BiMonthlyAssessor>>({
    group: 'Assessors',
    name: '',
    title: '',
    area: '',
    department: '',
    mandatoryStatus: 'Wajib Hadir (Mandatory)',
    attendanceConfirmed: true,
    notes: '',
    email: '',
    phone: ''
  });

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan daftar assessor BI Monthly ke data standar pabrik?')) {
      setAssessors(BI_MONTHLY_ASSESSORS);
      localStorage.setItem('genba_bi_monthly_assessors', JSON.stringify(BI_MONTHLY_ASSESSORS));
    }
  };

  // Toggle Attendance
  const handleToggleAttendance = (id: string) => {
    setAssessors(prev => prev.map(item => 
      item.id === id ? { ...item, attendanceConfirmed: !item.attendanceConfirmed } : item
    ));
  };

  // Mark all attended / unattended
  const handleMarkAllAttendance = (confirmed: boolean) => {
    setAssessors(prev => prev.map(item => ({ ...item, attendanceConfirmed: confirmed })));
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingAssessor(null);
    setFormData({
      group: 'Assessors',
      name: '',
      title: '',
      area: '',
      department: '',
      mandatoryStatus: 'Wajib Hadir (Mandatory)',
      attendanceConfirmed: true,
      notes: '',
      email: '',
      phone: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (assessor: BiMonthlyAssessor) => {
    setEditingAssessor(assessor);
    setFormData({ ...assessor });
    setIsModalOpen(true);
  };

  // Delete Assessor
  const handleDeleteAssessor = (id: string, name: string) => {
    if (window.confirm(`Hapus "${name}" dari daftar peserta wajib BI Monthly Genba?`)) {
      setAssessors(prev => prev.filter(a => a.id !== id));
    }
  };

  // Save (Create or Update)
  const handleSaveAssessor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.title?.trim() || !formData.area?.trim()) {
      alert('Nama, Jabatan, dan Area Tanggung Jawab wajib diisi.');
      return;
    }

    if (editingAssessor) {
      setAssessors(prev => prev.map(a => 
        a.id === editingAssessor.id ? { ...a, ...(formData as BiMonthlyAssessor) } : a
      ));
    } else {
      const newId = `ASR-${Date.now().toString().slice(-4)}`;
      const newItem: BiMonthlyAssessor = {
        id: newId,
        group: (formData.group as AssessorRoleGroup) || 'Assessors',
        name: formData.name.trim(),
        title: formData.title.trim(),
        area: formData.area.trim(),
        department: formData.department?.trim() || 'General Production',
        mandatoryStatus: formData.mandatoryStatus || 'Wajib Hadir (Mandatory)',
        attendanceConfirmed: formData.attendanceConfirmed ?? true,
        notes: formData.notes?.trim() || '',
        email: formData.email?.trim() || '',
        phone: formData.phone?.trim() || ''
      };
      setAssessors(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  // Filtered list
  const filteredAssessors = useMemo(() => {
    return assessors.filter(item => {
      // Group filter
      if (selectedGroup !== 'all' && item.group !== selectedGroup) return false;
      // Status filter
      if (selectedStatusFilter === 'confirmed' && !item.attendanceConfirmed) return false;
      if (selectedStatusFilter === 'pending' && item.attendanceConfirmed) return false;
      if (selectedStatusFilter === 'mandatory' && item.mandatoryStatus !== 'Wajib Hadir (Mandatory)') return false;
      if (selectedStatusFilter === 'lead' && item.mandatoryStatus !== 'Lead Facilitator') return false;
      if (selectedStatusFilter === 'standby' && item.mandatoryStatus !== 'Standby di Area') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchArea = item.area.toLowerCase().includes(q);
        const matchDept = item.department.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q) || false;
        if (!matchName && !matchTitle && !matchArea && !matchDept && !matchNotes) return false;
      }
      return true;
    });
  }, [assessors, selectedGroup, selectedStatusFilter, searchQuery]);

  // Statistics
  const facilitatorCount = useMemo(() => assessors.filter(a => a.group === 'Facilitator').length, [assessors]);
  const picAreaCount = useMemo(() => assessors.filter(a => a.group === 'PIC Area').length, [assessors]);
  const assessorCount = useMemo(() => assessors.filter(a => a.group === 'Assessors').length, [assessors]);
  const confirmedCount = useMemo(() => assessors.filter(a => a.attendanceConfirmed).length, [assessors]);
  const attendanceRate = Math.round((confirmedCount / (assessors.length || 1)) * 100);

  // Group helpers
  const getGroupBadge = (group: AssessorRoleGroup) => {
    switch (group) {
      case 'Facilitator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Facilitator
          </span>
        );
      case 'PIC Area':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Building className="w-3 h-3 text-blue-600" />
            PIC Area
          </span>
        );
      case 'Assessors':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
            <ShieldCheck className="w-3 h-3 text-purple-600" />
            Assessor
          </span>
        );
    }
  };

  const getStatusBadge = (status: BiMonthlyAssessor['mandatoryStatus']) => {
    switch (status) {
      case 'Lead Facilitator':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-800 border border-amber-300">
            Lead Facilitator
          </span>
        );
      case 'Standby di Area':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-500/15 text-blue-800 border border-blue-300">
            Standby di Area
          </span>
        );
      case 'Wajib Hadir (Mandatory)':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-800 border border-emerald-300">
            Wajib Hadir 100%
          </span>
        );
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['No', 'Grup Peran', 'Nama Lengkap', 'Jabatan / Title', 'Departemen', 'Area Cakupan', 'Status Kehadiran', 'Konfirmasi Hadir', 'Catatan / Fokus Audit'];
    const rows = filteredAssessors.map((a, i) => [
      i + 1,
      `"${a.group}"`,
      `"${a.name}"`,
      `"${a.title}"`,
      `"${a.department}"`,
      `"${a.area}"`,
      `"${a.mandatoryStatus}"`,
      a.attendanceConfirmed ? '"Hadir / Siap"' : '"Belum Konfirmasi"',
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_Assessor_BI_Monthly_Genba_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Banner & Context Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                BI MONTHLY GENBA ROSTER
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Tier 1 Apex &bull; Genba with Adidas
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                SOP Kepatuhan Kunjungan Dua Bulanan
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Tabel Assessor &amp; Peserta Wajib BI Monthly Genba
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Daftar pejabat dan auditor tersertifikasi yang wajib hadir serta mendampingi audit dua bulanan bersama perwakilan &amp; auditor brand Adidas. Terbagi atas 3 kelompok peran kunci: <strong>Facilitator</strong>, <strong>PIC Area</strong>, dan <strong>Assessors</strong>.
            </p>
          </div>

          {/* Quick Stat Highlights */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="px-3.5 py-2.5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                {assessors.length}
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Personel</span>
                <span className="text-xs font-black text-slate-900">{confirmedCount} Siap / Hadir</span>
              </div>
            </div>

            <div className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                attendanceRate >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {attendanceRate}%
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kesiapan Kuorum</span>
                <span className="text-xs font-extrabold text-emerald-700">Wajib 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Group Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-amber-200/60">
          {/* Card 1: Facilitator */}
          <div 
            onClick={() => setSelectedGroup(selectedGroup === 'Facilitator' ? 'all' : 'Facilitator')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedGroup === 'Facilitator' 
                ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300' 
                : 'bg-white hover:bg-amber-50/50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">1. Facilitator</h4>
                <p className="text-[11px] text-slate-500">Adidas Lead, Plant GM &amp; Tim OE</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-amber-900">{facilitatorCount}</span>
              <span className="block text-[10px] font-bold text-slate-400">Personel</span>
            </div>
          </div>

          {/* Card 2: PIC Area */}
          <div 
            onClick={() => setSelectedGroup(selectedGroup === 'PIC Area' ? 'all' : 'PIC Area')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedGroup === 'PIC Area' 
                ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300' 
                : 'bg-white hover:bg-blue-50/50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">2. PIC Area</h4>
                <p className="text-[11px] text-slate-500">Tuan Rumah Gudang, Lini &amp; K3</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-blue-900">{picAreaCount}</span>
              <span className="block text-[10px] font-bold text-slate-400">Personel</span>
            </div>
          </div>

          {/* Card 3: Assessors */}
          <div 
            onClick={() => setSelectedGroup(selectedGroup === 'Assessors' ? 'all' : 'Assessors')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              selectedGroup === 'Assessors' 
                ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-300' 
                : 'bg-white hover:bg-purple-50/50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">3. Assessors</h4>
                <p className="text-[11px] text-slate-500">Auditor Kualitas A-01, K3 &amp; 5S</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-purple-900">{assessorCount}</span>
              <span className="block text-[10px] font-bold text-slate-400">Personel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Actions */}
      <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari assessor, jabatan, departemen, area..."
              className="w-full pl-9 pr-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Group Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Grup:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">Semua Grup ({assessors.length})</option>
              <option value="Facilitator">1. Facilitator ({facilitatorCount})</option>
              <option value="PIC Area">2. PIC Area ({picAreaCount})</option>
              <option value="Assessors">3. Assessors ({assessorCount})</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="confirmed">Sudah Konfirmasi Hadir ({confirmedCount})</option>
              <option value="pending">Belum Konfirmasi ({assessors.length - confirmedCount})</option>
              <option value="lead">Lead Facilitator</option>
              <option value="standby">Standby di Area</option>
              <option value="mandatory">Wajib Hadir 100%</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => handleMarkAllAttendance(true)}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Tandai seluruh assessor hadir"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Check-in Semua</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Unduh format CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Tambah Assessor</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-3.5 w-12 text-center">No</th>
              <th className="py-3 px-3.5 w-32">Grup / Peran</th>
              <th className="py-3 px-3.5 min-w-[200px]">Nama Assessor &amp; Jabatan</th>
              <th className="py-3 px-3.5 min-w-[170px]">Departemen &amp; Kontak</th>
              <th className="py-3 px-3.5 min-w-[220px]">Area Tanggung Jawab (Genba Scope)</th>
              <th className="py-3 px-3.5 w-36">Ketentuan Kehadiran</th>
              <th className="py-3 px-3.5 w-28 text-center">Check-in Sesi</th>
              <th className="py-3 px-3.5 min-w-[200px]">Fokus Audit / SOP Temuan</th>
              <th className="py-3 px-3.5 w-20 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssessors.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Tidak ada assessor yang sesuai dengan filter atau pencarian.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedGroup('all'); setSelectedStatusFilter('all'); }}
                    className="mt-2 text-xs font-bold text-amber-700 hover:underline"
                  >
                    Reset Filter
                  </button>
                </td>
              </tr>
            ) : (
              filteredAssessors.map((item, idx) => {
                const isConfirmed = item.attendanceConfirmed ?? false;

                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-amber-50/30 transition-colors ${
                      !isConfirmed ? 'bg-slate-50/40 text-slate-400' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3.5 px-3.5 text-center font-mono font-bold text-slate-500">
                      {idx + 1}
                    </td>

                    {/* Group Badge */}
                    <td className="py-3.5 px-3.5">
                      {getGroupBadge(item.group)}
                    </td>

                    {/* Name & Title */}
                    <td className="py-3.5 px-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                          item.group === 'Facilitator' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          item.group === 'PIC Area' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                          'bg-purple-100 text-purple-900 border border-purple-300'
                        }`}>
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-snug">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {item.title}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Contact */}
                    <td className="py-3.5 px-3.5">
                      <div className="font-semibold text-slate-800">
                        {item.department}
                      </div>
                      <div className="text-[10px] text-slate-500 flex flex-col gap-0.5 mt-0.5 font-mono">
                        {item.phone && <span>📞 {item.phone}</span>}
                        {item.email && <span className="truncate max-w-[150px]">✉️ {item.email}</span>}
                      </div>
                    </td>

                    {/* Area Scope */}
                    <td className="py-3.5 px-3.5">
                      <div className="text-xs font-semibold text-slate-800 leading-relaxed flex items-start gap-1.5">
                        <span className="text-amber-600 mt-0.5">📍</span>
                        <span>{item.area}</span>
                      </div>
                    </td>

                    {/* Mandatory Status */}
                    <td className="py-3.5 px-3.5">
                      {getStatusBadge(item.mandatoryStatus)}
                    </td>

                    {/* Check-in Toggle */}
                    <td className="py-3.5 px-3.5 text-center">
                      <button
                        onClick={() => handleToggleAttendance(item.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isConfirmed 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200' 
                            : 'bg-slate-200 text-slate-600 border border-slate-300 hover:bg-slate-300'
                        }`}
                        title="Klik untuk ubah status konfirmasi kehadiran"
                      >
                        {isConfirmed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Hadir</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Audit Focus / Notes */}
                    <td className="py-3.5 px-3.5">
                      <p className="text-[11px] text-slate-600 leading-relaxed italic bg-slate-50/70 p-2 rounded-lg border border-slate-200/80">
                        "{item.notes || 'Pemeriksaan standar kepatuhan Bi-Monthly Genba.'}"
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit data assessor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssessor(item.id, item.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus dari daftar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Table Metadata */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span>Menampilkan <strong>{filteredAssessors.length}</strong> dari <strong>{assessors.length}</strong> assessor terdaftar.</span>
          <button
            onClick={handleResetToDefault}
            className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset ke Roster Awal</span>
          </button>
        </div>

        {onScheduleSession && (
          <button
            onClick={onScheduleSession}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Jadwalkan Sesi BI Monthly dengan Roster Ini</span>
          </button>
        )}
      </div>

      {/* Modal: Tambah / Edit Assessor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingAssessor ? 'Edit Data Assessor BI Monthly' : 'Tambah Assessor / Peserta BI Monthly'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Konfigurasi daftar kehadiran inspeksi dua bulanan bersama Adidas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssessor} className="p-6 space-y-4">
              {/* Grup Peran */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kelompok Peran (Role Group) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Facilitator', 'PIC Area', 'Assessors'] as AssessorRoleGroup[]).map((grp) => (
                    <button
                      type="button"
                      key={grp}
                      onClick={() => setFormData({ ...formData, group: grp })}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        formData.group === grp
                          ? grp === 'Facilitator' ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-300' :
                            grp === 'PIC Area' ? 'bg-blue-100 text-blue-900 border-blue-400 ring-2 ring-blue-300' :
                            'bg-purple-100 text-purple-900 border-purple-400 ring-2 ring-purple-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama Lengkap & Gelar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap &amp; Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Irwan Prasetya, S.T."
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-medium"
                />
              </div>

              {/* Jabatan & Departemen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jabatan / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: QA Senior Specialist"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Departemen
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Quality Assurance"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Area Tanggung Jawab */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area Cakupan Inspeksi (Scope) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dedicated Sewing Line 1-8 & In-line QC"
                  value={formData.area || ''}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Ketentuan Kehadiran */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ketentuan Wajib Hadir
                  </label>
                  <select
                    value={formData.mandatoryStatus || 'Wajib Hadir (Mandatory)'}
                    onChange={(e) => setFormData({ ...formData, mandatoryStatus: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white font-semibold"
                  >
                    <option value="Wajib Hadir (Mandatory)">Wajib Hadir 100%</option>
                    <option value="Standby di Area">Standby di Area</option>
                    <option value="Lead Facilitator">Lead Facilitator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Konfirmasi Awal
                  </label>
                  <div className="flex items-center gap-2 pt-1.5">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.attendanceConfirmed ?? true}
                        onChange={(e) => setFormData({ ...formData, attendanceConfirmed: e.target.checked })}
                        className="rounded border-slate-300 text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                      />
                      <span>Tandai Hadir / Siap Sedia</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Kontak: Telepon & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Ext. / Telepon
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ext. 2701"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    placeholder="nama@factory-genba.co.id"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Catatan / Fokus Audit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Fokus Audit / Poin Perhatian
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Pemeriksaan standar jarum patah 9-point dan kebersihan area 5S."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-xs cursor-pointer transition-all shadow-xs"
                >
                  {editingAssessor ? 'Simpan Perubahan' : 'Tambah Assessor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
