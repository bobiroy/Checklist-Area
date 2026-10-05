import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Layers, 
  UserCheck, 
  MapPin, 
  User, 
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { 
  InspectionFinding, 
  FindingCategory, 
  FindingStatus, 
  PriorityLevel, 
  GenbaHierarchyLevel 
} from '../types';
import { 
  FINDING_CATEGORIES, 
  SAMPLE_PHOTO_PRESETS, 
  DEPARTMENTS
} from '../data/mockData';

interface FindingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (finding: InspectionFinding) => void;
  initialData?: InspectionFinding | null;
}

export const FindingFormModal: React.FC<FindingFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const isEditing = !!initialData;

  // Active sub-tab when editing: 'progress' (focus on photo after & progress) or 'details' (full finding info)
  const [activeSubTab, setActiveSubTab] = useState<'progress' | 'details'>('progress');

  // Form states
  const [date, setDate] = useState('');
  const [area, setArea] = useState('');
  const [findingText, setFindingText] = useState('');
  const [category, setCategory] = useState<FindingCategory>('5R');
  const [recordedBy, setRecordedBy] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [pic, setPic] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0].name);
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [status, setStatus] = useState<FindingStatus>('Open');
  const [closeDate, setCloseDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentAfterUrl, setAttachmentAfterUrl] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [hierarchyLevel, setHierarchyLevel] = useState<GenbaHierarchyLevel>('bi-monthly');
  const [impactScore, setImpactScore] = useState('');
  const [progressNotes, setProgressNotes] = useState('');

  const [showPresetsBefore, setShowPresetsBefore] = useState(false);
  const [showPresetsAfter, setShowPresetsAfter] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Synchronize state whenever initialData or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDate(initialData.date || new Date().toISOString().split('T')[0]);
        setArea(initialData.area || '');
        setFindingText(initialData.finding || '');
        setCategory(initialData.category || '5R');
        setRecordedBy(initialData.recordedBy || '');
        setInspectorName(initialData.inspectorName || 'Bpk. Ir. Hendra Gunawan (Plant GM)');
        setPic(initialData.pic || '');
        setDepartment(initialData.department || DEPARTMENTS[0].name);
        setCorrectiveAction(initialData.correctiveAction || '');
        setStatus(initialData.status || 'Open');
        setCloseDate(initialData.closeDate || '');
        setTargetDate(initialData.targetDate || '');
        setAttachmentUrl(initialData.attachmentUrl || SAMPLE_PHOTO_PRESETS[1].url);
        setAttachmentAfterUrl(initialData.attachmentAfterUrl || '');
        setPriority(initialData.priority || 'Medium');
        setHierarchyLevel(initialData.hierarchyLevel === 'bi-weekly' ? 'bi-monthly' : (initialData.hierarchyLevel || 'bi-monthly'));
        setImpactScore(initialData.impactScore || '');
        setProgressNotes(initialData.progressNotes || initialData.notes || '');
        setActiveSubTab('progress'); // Default to progress & after photo when editing
      } else {
        // Reset for new finding (Seluruh temuan otomatis masuk ke BI Genba)
        const todayStr = new Date().toISOString().split('T')[0];
        setDate(todayStr);
        setArea('');
        setFindingText('');
        setCategory('5R');
        setRecordedBy('');
        setInspectorName('Bpk. Ir. Hendra Gunawan (Plant GM)');
        setPic('');
        setDepartment(DEPARTMENTS[0].name);
        setCorrectiveAction('');
        setStatus('Open');
        setCloseDate('');
        setTargetDate('');
        setAttachmentUrl(SAMPLE_PHOTO_PRESETS[1].url);
        setAttachmentAfterUrl('');
        setPriority('Medium');
        setHierarchyLevel('bi-monthly');
        setImpactScore('');
        setProgressNotes('');
        setActiveSubTab('details');
      }
      setErrorMsg('');
      setInfoMsg('');
      setShowPresetsBefore(false);
      setShowPresetsAfter(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isAfter: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran file foto maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (isAfter) {
            setAttachmentAfterUrl(event.target.result as string);
            setInfoMsg('Foto bukti perbaikan (After) berhasil diunggah!');
            setTimeout(() => setInfoMsg(''), 3000);
          } else {
            setAttachmentUrl(event.target.result as string);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick handler when changing status
  const handleStatusChange = (newStatus: FindingStatus) => {
    setStatus(newStatus);
    if (newStatus === 'Closed') {
      if (!closeDate) {
        const today = new Date().toISOString().split('T')[0];
        setCloseDate(today);
      }
      if (!attachmentAfterUrl) {
        setInfoMsg('Tips: Jangan lupa unggah Foto Bukti Perbaikan (After) untuk status Closed.');
        setTimeout(() => setInfoMsg(''), 4000);
      }
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!area.trim()) {
      setErrorMsg('Area (Lokasi / Lini Kerja) wajib diisi.');
      return;
    }
    if (!findingText.trim()) {
      setErrorMsg('Uraian temuan (Finding) wajib diisi.');
      return;
    }
    if (!recordedBy.trim()) {
      setErrorMsg('Nama Assessor / user penginput temuan wajib diisi.');
      return;
    }
    if (!pic.trim()) {
      setErrorMsg('Person In Charge (PIC) wajib diisi.');
      return;
    }
    if (!correctiveAction.trim()) {
      setErrorMsg('Tindakan korektif / rencana perbaikan wajib diisi.');
      return;
    }
    if (!attachmentUrl) {
      setErrorMsg('Foto bukti temuan awal (Before) wajib disertakan.');
      return;
    }

    const payload: InspectionFinding = {
      id: initialData?.id || `FND-2026-${Math.floor(100 + Math.random() * 900)}`,
      date,
      area: area.trim(),
      finding: findingText.trim(),
      category,
      pic: pic.trim(),
      department,
      correctiveAction: correctiveAction.trim(),
      status,
      closeDate: status === 'Closed' && !closeDate ? new Date().toISOString().split('T')[0] : closeDate,
      targetDate: targetDate || undefined,
      attachmentUrl,
      attachmentAfterUrl: attachmentAfterUrl.trim() || undefined,
      priority,
      hierarchyLevel,
      inspectorName: inspectorName.trim() || 'Tim Genba Walk',
      recordedBy: recordedBy.trim(),
      weekNumber: initialData?.weekNumber || 38,
      notes: progressNotes.trim() || initialData?.notes || undefined,
      progressNotes: progressNotes.trim() || undefined,
      impactScore: impactScore.trim() || undefined
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div 
      id="finding-form-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="finding-form-modal-card"
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 max-h-[94vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                {isEditing ? `Edit & Pembaruan Temuan: ${initialData?.id} / (Edit Finding)` : 'Pencatatan Temuan Baru / (New Finding Record)'}
              </span>
              {isEditing && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  status === 'Closed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : status === 'In Progress'
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : status === 'Pending Verification'
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}>
                  Status: {status}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {isEditing ? 'Pembaruan Kemajuan & Foto Bukti Perbaikan / (Update Progress & Photo Proof)' : 'Formulir Pencatatan Temuan Genba Walk / (Genba Walk Finding Form)'}
            </h3>
          </div>
          <button
            id="close-form-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            title="Tutup Form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tab navigation (Especially useful when editing) */}
        {isEditing && (
          <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 pt-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('progress')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'progress'
                  ? 'border-amber-600 text-amber-800 bg-white rounded-t-lg shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>1. Kemajuan &amp; Foto Perbaikan / (Improvement Progress &amp; After Photo)</span>
              {attachmentAfterUrl && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('details')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeSubTab === 'details'
                  ? 'border-amber-600 text-amber-800 bg-white rounded-t-lg shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-600" />
              <span>2. Detail Temuan Lapangan / (On-site Finding Details &amp; Info)</span>
            </button>
          </div>
        )}

        {/* Alert Notifications */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {infoMsg && (
          <div className="mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* SECTION A: PROGRESS & FOTO AFTER (Shown when editing on 'progress' tab OR shown cleanly in full form) */}
          {(isEditing && activeSubTab === 'progress') && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Highlight summary card of current finding */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-slate-800">{area}</span>
                    <span>&bull;</span>
                    <span className="text-amber-700 font-medium">{category}</span>
                    <span>&bull;</span>
                    <span>PIC: <strong>{pic}</strong></span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                    {findingText}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('details')}
                  className="shrink-0 text-xs text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
                >
                  Ubah data temuan &rarr;
                </button>
              </div>

              {/* Status Update Card */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span>Pembaruan Status Kemajuan Perbaikan / (Update Improvement Progress Status) <span className="text-rose-500">*</span></span>
                  </label>
                  <span className="text-[11px] text-slate-500">Pilih status terkini / (Select current status)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('Open')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      status === 'Open'
                        ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/30 text-rose-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">🔴 Open / (Belum Dikerjakan)</span>
                      {status === 'Open' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal">Belum ada aksi / (No action)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange('In Progress')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      status === 'In Progress'
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30 text-amber-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">🟡 In Progress / (Proses)</span>
                      {status === 'In Progress' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal">Tahap perbaikan / (In progress)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange('Pending Verification')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      status === 'Pending Verification'
                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/30 text-blue-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">🔵 Pending Verifikasi / (Pending)</span>
                      {status === 'Pending Verification' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal">Menunggu verif / (Verification)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange('Closed')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      status === 'Closed'
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-800">🟢 Closed / (Selesai)</span>
                      {status === 'Closed' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 font-normal">Selesai 100% / (Resolved)</p>
                  </button>
                </div>
              </div>

              {/* Foto Bukti Sesudah Perbaikan (After) - High Priority */}
              <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Lampiran Foto Bukti Sesudah Perbaikan (After) / (Photo Proof After / Countermeasure)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Unggah foto fisik kondisi sesudah perbaikan lapangan selesai / (Upload photo of completed countermeasure).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPresetsAfter(!showPresetsAfter)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 bg-emerald-100/80 hover:bg-emerald-200/80 px-2.5 py-1.5 rounded-lg border border-emerald-300 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{showPresetsAfter ? 'Tutup Contoh Foto / (Close Presets)' : 'Pilih Contoh Foto Selesai / (Select Sample After Photo)'}</span>
                  </button>
                </div>

                {/* Presets for After Photos */}
                {showPresetsAfter && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 bg-white rounded-lg border border-emerald-200 animate-in fade-in">
                    {SAMPLE_PHOTO_PRESETS.filter(p => p.label.includes('(After)')).map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setAttachmentAfterUrl(preset.url);
                          setShowPresetsAfter(false);
                          setInfoMsg('Foto perbaikan berhasil dipilih dari contoh!');
                          setTimeout(() => setInfoMsg(''), 3000);
                        }}
                        className={`text-left p-1.5 rounded-lg border text-xs transition-all overflow-hidden cursor-pointer ${
                          attachmentAfterUrl === preset.url
                            ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-16 object-cover rounded mb-1"
                          referrerPolicy="no-referrer"
                        />
                        <p className="font-semibold text-slate-800 text-[11px] truncate">{preset.label}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Side-by-Side: Foto Before vs Foto After */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  {/* Before thumbnail reference */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span>1. Foto Temuan (Before)</span>
                      <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                        Kondisi Awal
                      </span>
                    </div>
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      {attachmentUrl ? (
                        <img
                          src={attachmentUrl}
                          alt="Foto Before"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          Tidak ada foto before
                        </div>
                      )}
                      <span className="absolute top-2 left-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        BEFORE
                      </span>
                    </div>
                    <div className="p-2.5 text-[11px] text-slate-600 bg-slate-50/50">
                      <p className="line-clamp-2"><strong>Temuan:</strong> {findingText}</p>
                    </div>
                  </div>

                  {/* After upload & preview */}
                  <div className="border border-emerald-300 rounded-xl overflow-hidden bg-white shadow-xs">
                    <div className="px-3 py-1.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between text-[11px] font-bold text-emerald-900">
                      <span>2. Foto Bukti Perbaikan (After)</span>
                      {attachmentAfterUrl ? (
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.2 rounded">
                          ✓ Foto Terpasang
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          Belum Ada Foto
                        </span>
                      )}
                    </div>

                    <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                      {attachmentAfterUrl ? (
                        <>
                          <img
                            src={attachmentAfterUrl}
                            alt="Foto After"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                            AFTER
                          </span>
                          <button
                            type="button"
                            onClick={() => setAttachmentAfterUrl('')}
                            className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-lg transition-colors cursor-pointer"
                            title="Hapus Foto After"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-slate-900 transition-colors group">
                          <Upload className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform mb-1.5" />
                          <p className="text-xs font-bold text-white">Unggah Foto Perbaikan (After)</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Klik untuk ambil kamera HP atau file gambar</p>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleFileUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <div className="p-2.5 bg-white space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300 transition-colors flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{attachmentAfterUrl ? 'Ganti Foto' : 'Unggah Foto'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleFileUpload(e, true)}
                            className="hidden"
                          />
                        </label>

                        <div className="flex-1">
                          <input
                            type="url"
                            placeholder="Atau tempel link URL foto after..."
                            value={attachmentAfterUrl}
                            onChange={(e) => setAttachmentAfterUrl(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tindakan Korektif & Progress Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Tindakan Korektif yang Dilakukan / (Corrective Action Performed) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    placeholder="Uraikan aksi nyata yang telah dikerjakan (contoh: kabel sensor telah diganti baru, dilindungi conduit fleksibel baja, dan diikat rapi)..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>Catatan Kemajuan &amp; Verifikasi / (Progress &amp; Verification Notes)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Opsional / (Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={progressNotes}
                    onChange={(e) => setProgressNotes(e.target.value)}
                    placeholder="Catatan update progress lapangan, nama teknisi yang mengerjakan, atau catatan verifikasi supervisor..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  />
                </div>
              </div>

              {/* Tanggal Selesai & Dampak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>Tanggal Penyelesaian Aktual / (Actual Close Date)</span>
                    <button
                      type="button"
                      onClick={() => setCloseDate(new Date().toISOString().split('T')[0])}
                      className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold hover:bg-emerald-100 cursor-pointer"
                    >
                      Set Hari Ini / (Today)
                    </button>
                  </label>
                  <input
                    type="date"
                    value={closeDate}
                    onChange={(e) => setCloseDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                    <span>Estimasi Dampak &amp; Manfaat Kaizen / (Estimated Impact &amp; Kaizen Benefit)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Opsional / (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={impactScore}
                    onChange={(e) => setImpactScore(e.target.value)}
                    placeholder="Contoh: Eliminasi risiko sengatan listrik, 100% aman"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION B: DETAIL TEMUAN LAPANGAN (Always shown if !isEditing, or when activeSubTab === 'details') */}
          {(!isEditing || activeSubTab === 'details') && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Row 1: 1. Date & 2. Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    1. Tanggal Temuan / (Date Findings) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-finding-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>2. Area (Lokasi / Lini Kerja) / (Area / Workstation Location) <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    id="input-finding-area"
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Ketik lokasi / lini kerja (contoh: Sewing Line 3, Cutting Zone B)..."
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Row 2: 3. Assessor & Pimpinan Inspektur */}
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>3. Penilai / Assessor (User Penginput) / (Assessor / User Input) <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      id="input-finding-recorded-by"
                      type="text"
                      value={recordedBy}
                      onChange={(e) => setRecordedBy(e.target.value)}
                      placeholder="Ketik nama Anda (contoh: Budi Santoso - CI Staff / Notulen Genba)..."
                      required
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white placeholder:text-slate-400"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Nama personel yang mencatat temuan ini saat inspeksi lapangan / (Person who records finding).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-600 shrink-0" />
                      <span>Inspektur &amp; Pimpinan Genba Walk / (Inspector &amp; Genba Walk Leader)</span>
                    </label>
                    <input
                      id="input-finding-inspector"
                      type="text"
                      value={inspectorName}
                      onChange={(e) => setInspectorName(e.target.value)}
                      placeholder="Contoh: Bpk. Ir. Hendra Gunawan (Plant GM)..."
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white placeholder:text-slate-400"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pimpinan yang memimpin sesi walkthrough Genba / (Leader of walkthrough session).
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 3: 4. Finding Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  4. Uraian Masalah &amp; Temuan Lapangan / (Finding Description &amp; On-site Condition) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="input-finding-desc"
                  rows={2}
                  value={findingText}
                  onChange={(e) => setFindingText(e.target.value)}
                  placeholder="Jelaskan secara spesifik ketidaksesuaian, potensi bahaya, ceceran 5S, atau anomali yang ditemukan..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  required
                />
              </div>

              {/* Row 4: 5. Category & Departemen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    5. Kategori Temuan / (Finding Category) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="input-finding-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FindingCategory)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white font-medium"
                  >
                    {FINDING_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Departemen Penanggung Jawab / (Responsible Department) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="input-finding-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white font-medium"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.name}>{dept.name} ({dept.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: 6. PIC & Target SLA Selesai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    6. Penanggung Jawab Lapangan (PIC) / (Person In Charge - PIC) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-finding-pic"
                    type="text"
                    value={pic}
                    onChange={(e) => setPic(e.target.value)}
                    placeholder="Contoh: Bpk. Bambang Sudiro (Maint. Electrician)"
                    required
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Batas Waktu Selesai / (Target Due Date / SLA)
                  </label>
                  <input
                    id="input-finding-target-date"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  />
                </div>
              </div>

              {/* If not editing, also show Corrective Action and Status here */}
              {!isEditing && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      7. Tindakan Korektif &amp; Rencana Perbaikan / (Corrective Action &amp; Countermeasure) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="input-finding-action"
                      rows={2}
                      value={correctiveAction}
                      onChange={(e) => setCorrectiveAction(e.target.value)}
                      placeholder="Rencana aksi korektif, modifikasi fixture, pembersihan 5S, standardisasi SOP..."
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        8. Status Awal Temuan / (Initial Finding Status) <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="input-finding-status"
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value as FindingStatus)}
                        className="w-full px-3.5 py-2 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                      >
                        <option value="Open">🔴 Belum Dikerjakan / (Open)</option>
                        <option value="In Progress">🟡 Sedang Dikerjakan / (In Progress)</option>
                        <option value="Pending Verification">🔵 Menunggu Verifikasi / (Pending Verification)</option>
                        <option value="Closed">🟢 Selesai / (Closed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        9. Tanggal Penyelesaian Aktual / (Actual Close Date)
                      </label>
                      <input
                        id="input-finding-close-date"
                        type="date"
                        value={closeDate}
                        onChange={(e) => setCloseDate(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Foto Bukti Temuan (Before) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>10. Lampiran Foto Bukti Temuan (Before) / (Attachment Photo Proof - Before) <span className="text-rose-500">*</span></span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPresetsBefore(!showPresetsBefore)}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{showPresetsBefore ? 'Tutup Contoh Foto / (Close Presets)' : 'Pilih Contoh Foto Temuan / (Select Sample Photo)'}</span>
                  </button>
                </div>

                {/* Presets picker */}
                {showPresetsBefore && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-amber-50/40 rounded-lg border border-amber-100 animate-in fade-in">
                    {SAMPLE_PHOTO_PRESETS.slice(0, 5).map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setAttachmentUrl(preset.url);
                          setShowPresetsBefore(false);
                        }}
                        className={`text-left p-1.5 rounded-lg border text-xs transition-all overflow-hidden cursor-pointer ${
                          attachmentUrl === preset.url
                            ? 'border-amber-600 ring-2 ring-amber-500/20 bg-amber-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-16 object-cover rounded mb-1"
                          referrerPolicy="no-referrer"
                        />
                        <p className="font-semibold text-slate-800 text-[11px] truncate">{preset.label}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Input file & preview for Before Photo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="cursor-pointer block border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-4 text-center transition-colors bg-white group">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-amber-600 mx-auto mb-1" />
                      <p className="text-xs font-bold text-slate-700">Unggah Foto Temuan / (Upload Before Photo)</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Kamera HP / File JPG, PNG maks 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleFileUpload(e, false)}
                        className="hidden"
                      />
                    </label>
                    <div className="mt-2">
                      <input
                        type="url"
                        placeholder="Atau masukkan URL gambar langsung..."
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                    {attachmentUrl ? (
                      <>
                        <img
                          src={attachmentUrl}
                          alt="Pratinjau Foto Temuan"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          BEFORE PROOF
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400 text-xs font-medium">Belum ada foto</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Priority & Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    11. Tingkat Prioritas &amp; Keparahan / (Priority Level &amp; Severity)
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Low">Rendah / (Low - Kosmetik / Non-kritis)</option>
                    <option value="Medium">Sedang / (Medium - Kepatuhan 5S)</option>
                    <option value="High">Tinggi / (High - Potensi Cacat / Downtime)</option>
                    <option value="Critical">Kritis / (Critical - Bahaya K3 &amp; Keselamatan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    12. Estimasi Dampak &amp; Manfaat Kaizen / (Estimated Impact &amp; Kaizen Benefit)
                  </label>
                  <input
                    type="text"
                    value={impactScore}
                    onChange={(e) => setImpactScore(e.target.value)}
                    placeholder="Contoh: Menghemat cycle time 4.2s / Eliminasi bahaya slip"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {isEditing ? (
                <span>Mengedit temuan <strong className="text-slate-800">{initialData?.id}</strong></span>
              ) : (
                <span>Form standar pencatatan Genba Walk ISO 9001</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal / (Cancel)
              </button>
              <button
                type="submit"
                id="submit-finding-form-btn"
                className="px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Simpan Pembaruan Perbaikan / (Save Improvement Update)' : 'Simpan Temuan Baru / (Save New Finding)'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
