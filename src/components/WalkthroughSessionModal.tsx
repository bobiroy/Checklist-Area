import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, Users, Target, FileText, CheckCircle2 } from 'lucide-react';
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
  initialLevel = 'daily-genba'
}) => {
  const [level, setLevel] = useState<GenbaHierarchyLevel>(initialLevel);
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

  // Selected tier data for auto-populating defaults
  const activeTier = GENBA_HIERARCHY_TIERS.find(t => t.id === level) || GENBA_HIERARCHY_TIERS[0];

  const handleLevelChange = (newLevel: GenbaHierarchyLevel) => {
    setLevel(newLevel);
    const tier = GENBA_HIERARCHY_TIERS.find(t => t.id === newLevel);
    if (tier) {
      setLeader(tier.picLeader);
      setParticipants(tier.participants);
      setFocusTheme(`Fokus ${tier.name}: ${tier.subtitle}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: GenbaWalkthroughSession = {
      id: `SES-${Date.now().toString().slice(-4)}`,
      hierarchyLevel: level,
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
                Input Agenda Walkthrough Berdasarkan Hirarki
              </h2>
              <p className="text-xs text-slate-300">
                Pencatatan sesi Genba resmi sesuai tingkat piramida kepemimpinan pabrik
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
          {/* Level Hirarki Selector (4 Tiers) */}
          <div>
            <label className="block font-bold text-slate-900 mb-2">
              1. Pilih Level Hirarki Genba (Sesuai Diagram Piramida):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GENBA_HIERARCHY_TIERS.map((tier) => {
                const isSelected = level === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleLevelChange(tier.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {tier.levelNumber}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate">{tier.name}</p>
                      <p className="text-[11px] text-slate-600 truncate">{tier.subtitle}</p>
                      <span className="text-[10px] font-semibold text-amber-800 block mt-0.5">
                        {tier.frequency}
                      </span>
                    </div>
                  </button>
                );
              })}
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
                Pimpinan Walkthrough (Lead Inspector):
              </label>
              <input
                type="text"
                value={leader}
                placeholder={activeTier.picLeader}
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
