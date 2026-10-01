import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, ListChecks, Target, UserCheck } from 'lucide-react';
import { GenbaHierarchyTier } from '../types';

interface EditHierarchyTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: GenbaHierarchyTier;
  onSave: (updatedTier: GenbaHierarchyTier) => void;
}

export const EditHierarchyTierModal: React.FC<EditHierarchyTierModalProps> = ({
  isOpen,
  onClose,
  tier,
  onSave
}) => {
  const [name, setName] = useState(tier.name);
  const [subtitle, setSubtitle] = useState(tier.subtitle);
  const [frequency, setFrequency] = useState(tier.frequency);
  const [picLeader, setPicLeader] = useState(tier.picLeader);
  const [participants, setParticipants] = useState(tier.participants);
  const [targetArea, setTargetArea] = useState(tier.targetArea);
  const [kpiTarget, setKpiTarget] = useState(tier.kpiTarget);
  const [description, setDescription] = useState(tier.description);
  const [objectivesText, setObjectivesText] = useState(tier.objectives.join('\n'));
  const [checklistText, setChecklistText] = useState(tier.standardChecklist.join('\n'));

  useEffect(() => {
    setName(tier.name);
    setSubtitle(tier.subtitle);
    setFrequency(tier.frequency);
    setPicLeader(tier.picLeader);
    setParticipants(tier.participants);
    setTargetArea(tier.targetArea);
    setKpiTarget(tier.kpiTarget);
    setDescription(tier.description);
    setObjectivesText(tier.objectives.join('\n'));
    setChecklistText(tier.standardChecklist.join('\n'));
  }, [tier]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTier: GenbaHierarchyTier = {
      ...tier,
      name,
      subtitle,
      frequency,
      picLeader,
      participants,
      targetArea,
      kpiTarget,
      description,
      objectives: objectivesText.split('\n').filter(line => line.trim().length > 0),
      standardChecklist: checklistText.split('\n').filter(line => line.trim().length > 0)
    };
    onSave(updatedTier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
              {tier.levelNumber}
            </span>
            <div>
              <h2 className="text-base font-bold text-white">
                Edit Konfigurasi Level: {tier.name}
              </h2>
              <p className="text-xs text-slate-300">
                Sesuaikan profil hirarki, PIC, checklist audit, dan target KPI
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                Nama Level:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-900 mb-1">
                Sub-Judul / Mitra Terkait:
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Frekuensi Inspeksi:
              </label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                Penanggung Jawab Utama (Lead PIC):
              </label>
              <input
                type="text"
                value={picLeader}
                onChange={(e) => setPicLeader(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              Peserta / Tim Auditor Wajib:
            </label>
            <input
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-900 mb-1">
                Area Fokus Pabrik:
              </label>
              <input
                type="text"
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                Target KPI Kepatuhan:
              </label>
              <input
                type="text"
                value={kpiTarget}
                onChange={(e) => setKpiTarget(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-900 mb-1">
              Deskripsi & Peran Strategis:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Tujuan Pokok (1 per baris):
              </label>
              <textarea
                rows={4}
                value={objectivesText}
                onChange={(e) => setObjectivesText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-amber-500"
              ></textarea>
            </div>
            <div>
              <label className="block font-semibold text-slate-900 mb-1 flex items-center gap-1">
                <ListChecks className="w-3.5 h-3.5 text-purple-600" />
                Standar Checklist Audit (1 per baris):
              </label>
              <textarea
                rows={4}
                value={checklistText}
                onChange={(e) => setChecklistText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-amber-500"
              ></textarea>
            </div>
          </div>

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
              <span>Simpan Perubahan Level</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
