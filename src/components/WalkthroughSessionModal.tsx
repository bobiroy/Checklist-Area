import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, Users, Target, FileText, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { GenbaHierarchyLevel, GenbaWalkthroughSession } from '../types';
import { GENBA_HIERARCHY_TIERS, FACTORY_AREAS } from '../data/mockData';

interface WalkthroughSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (session: GenbaWalkthroughSession) => void;
  initialLevel?: GenbaHierarchyLevel;
}

export const WalkthroughSessionModal: React.FC<WalkthroughSessionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialLevel = 'bi-monthly'
}) => {
  const [level, setLevel] = useState<GenbaHierarchyLevel>('bi-monthly');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('09:00 - 10:30 WIB');
  const [shift, setShift] = useState<string>('Shift 1');
  const [area, setArea] = useState<string>(FACTORY_AREAS[0]);
  const [leader, setLeader] = useState<string>('');
  const [participants, setParticipants] = useState<string>('');
  const [focusTheme, setFocusTheme] = useState<string>('');
  const [status, setStatus] = useState<'Scheduled' | 'In Progress' | 'Completed'>('Scheduled');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  // Selected tier data for auto-populating defaults (always BI Monthly)
  const activeTier = GENBA_HIERARCHY_TIERS.find(t => t.id === 'bi-monthly' || t.id === 'bi-weekly') || GENBA_HIERARCHY_TIERS[0];

  const handleLevelChange = (newLevel: GenbaHierarchyLevel) => {
    // Only allow BI Monthly
    if (newLevel === 'bi-monthly' || newLevel === 'bi-weekly') {
      setLevel('bi-monthly');
      const tier = activeTier;
      if (tier) {
        setLeader(tier.picLeader);
        setParticipants(tier.participants);
        setFocusTheme(`Fokus ${tier.name}: ${tier.subtitle}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: GenbaWalkthroughSession = {
      id: `SES-${Date.now().toString().slice(-4)}`,
      hierarchyLevel: 'bi-monthly',
      date,
      time,
      shift,
      area,
      leader: leader || activeTier.picLeader,
      participants: participants || activeTier.participants,
      focusTheme: focusTheme || `Inspeksi ${activeTier.name}`,
      status,
      notes,
      totalFindingsCount: 0
    };

    onSubmit(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <div>
              <h2 className="text-base font-bold text-white">
                Input Agenda Walkthrough BI Monthly (Adidas)
              </h2>
              <p className="text-xs text-slate-300">
                Pencatatan agenda resmi khusus tingkat BI Monthly (Satu-satunya level aktif input)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Level Hirarki Selector: Khusus BI Monthly */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-bold text-slate-900">
                1. Level Hirarki Genba:
              </label>
              <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                Khusus BI MONTHLY (Adidas)
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-400 bg-amber-50/90 ring-2 ring-amber-400/20 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-slate-950 text-xs">BI MONTHLY</p>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-200 text-amber-950">
                      SATU-SATUNYA LEVEL AKTIF
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700">Genba with Adidas &bull; Bi-Monthly (Setiap 2 Bulan Sekali)</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-1 rounded border border-amber-200 hidden sm:inline-block">
                Apex Tier
              </span>
            </div>

            <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Fitur penjadwalan pada BoD Genba, Cross Check, dan Daily Genba telah ditiadakan agar performa sistem tetap ringan dan cepat.</span>
            </div>
          </div>

          {/* Tanggal, Waktu & Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Tanggal Pelaksanaan:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Waktu Pelaksanaan:
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 09:00 - 11:30 WIB"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Shift Operasional:
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
              >
                <option value="Shift 1">Shift 1 (Pagi)</option>
                <option value="Shift 2">Shift 2 (Siang/Sore)</option>
                <option value="Shift 3">Shift 3 (Malam)</option>
                <option value="General Office">General Office (Non-Shift)</option>
              </select>
            </div>
          </div>

          {/* Area Pabrik */}
          <div>
            <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              Area Cakupan Inspeksi:
            </label>
            <div className="flex gap-2">
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500"
              >
                {FACTORY_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Atau ketik nama area spesifik..."
                onChange={(e) => {
                  if (e.target.value) setArea(e.target.value);
                }}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Pimpinan & Peserta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Fasilitator:
              </label>
              <input
                type="text"
                value={leader}
                placeholder="Operation Excellence"
                onChange={(e) => setLeader(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                Peserta / Tim Auditor Terlibat:
              </label>
              <input
                type="text"
                value={participants}
                placeholder={activeTier.participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Tema & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                Fokus Utama / Tema Kaizen:
              </label>
              <input
                type="text"
                value={focusTheme}
                placeholder={`Contoh: Audit 5S & Poka Yoke pada ${activeTier.subtitle}`}
                onChange={(e) => setFocusTheme(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Status Agenda:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-amber-500"
              >
                <option value="Scheduled">Terjadwal (Scheduled)</option>
                <option value="In Progress">Sedang Berjalan (In Progress)</option>
                <option value="Completed">Selesai (Completed)</option>
              </select>
            </div>
          </div>

          {/* Catatan Arahan Pimpinan */}
          <div>
            <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Catatan Khusus / Arahan Tindak Lanjut:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Instruksi khusus dari pimpinan atau auditor terkait poin krusial yang harus diperhatikan..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Simpan Agenda Walkthrough</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
