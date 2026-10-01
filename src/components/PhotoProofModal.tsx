import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Edit3,
  Upload,
  Clock,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { InspectionFinding } from '../types';

interface PhotoProofModalProps {
  finding: InspectionFinding | null;
  onClose: () => void;
  onEditFinding?: (finding: InspectionFinding) => void;
}

export const PhotoProofModal: React.FC<PhotoProofModalProps> = ({ 
  finding, 
  onClose,
  onEditFinding 
}) => {
  if (!finding) return null;

  return (
    <div 
      id="photo-proof-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="photo-proof-modal-card"
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {finding.id}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                finding.status === 'Closed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : finding.status === 'In Progress'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : finding.status === 'Pending Verification'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {finding.status}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {finding.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Bukti Foto Dokumentasi Genba Walk
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {onEditFinding && (
              <button
                onClick={() => {
                  onClose();
                  onEditFinding(finding);
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Edit data temuan dan update foto perbaikan"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit / Update Perbaikan</span>
              </button>
            )}
            <button
              id="close-photo-proof-btn"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metadata pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Tanggal Temuan</p>
                <p className="font-medium text-slate-800">{finding.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Area Kerja</p>
                <p className="font-medium text-slate-800 truncate" title={finding.area}>{finding.area}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Penanggung Jawab (PIC)</p>
                <p className="font-medium text-slate-800 truncate" title={finding.pic}>{finding.pic}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Target / Close Date</p>
                <p className="font-medium text-slate-800">{finding.closeDate || finding.targetDate || '-'}</p>
              </div>
            </div>
          </div>

          {/* Photo Showcase (Before vs After) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Foto Temuan (Before) */}
            <div className="flex flex-col border border-rose-200 bg-rose-50/20 rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-3.5 py-2 bg-rose-50 border-b border-rose-200">
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wide">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Foto Temuan (Kondisi Sebelum / Before)
                </span>
                <span className="text-[11px] text-rose-600 font-medium">Recorded: {finding.date}</span>
              </div>
              <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden group">
                {finding.attachmentUrl ? (
                  <img
                    src={finding.attachmentUrl}
                    alt="Foto bukti temuan sebelum perbaikan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400 text-xs">
                    Tidak ada lampiran foto temuan
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  BEFORE
                </div>
              </div>
              <div className="p-3 bg-white text-xs text-slate-700">
                <p className="font-semibold text-slate-900 mb-0.5">Uraian Temuan (Finding):</p>
                <p className="text-slate-600 leading-relaxed">{finding.finding}</p>
              </div>
            </div>

            {/* Foto Perbaikan (After) */}
            <div className={`flex flex-col rounded-xl overflow-hidden shadow-sm border ${
              finding.attachmentAfterUrl
                ? 'border-emerald-200 bg-emerald-50/20'
                : 'border-slate-300 bg-slate-50/50 border-dashed'
            }`}>
              <div className={`flex items-center justify-between px-3.5 py-2 border-b ${
                finding.attachmentAfterUrl
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-100 border-slate-200'
              }`}>
                <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${
                  finding.attachmentAfterUrl ? 'text-emerald-700' : 'text-slate-600'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Foto Bukti Perbaikan (Kondisi Sesudah / After)
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {finding.closeDate ? `Selesai: ${finding.closeDate}` : 'Menunggu Penyelesaian'}
                </span>
              </div>

              <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden group">
                {finding.attachmentAfterUrl ? (
                  <>
                    <img
                      src={finding.attachmentAfterUrl}
                      alt="Foto bukti setelah perbaikan selesai"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      AFTER
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-slate-400 text-xs flex flex-col items-center justify-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                      <ExternalLink className="w-5 h-5 opacity-60" />
                    </div>
                    <p className="font-bold text-slate-200">Belum Ada Foto Bukti Perbaikan (After)</p>
                    <p className="text-slate-400 mt-1 max-w-xs text-[11px]">
                      Setelah tindakan perbaikan selesai dilakukan, Anda dapat mengunggah foto After dan memperbarui status temuan.
                    </p>
                    {onEditFinding && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEditFinding(finding);
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>+ Unggah Foto After &amp; Update Progress</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 bg-white text-xs text-slate-700 flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-slate-900 mb-0.5">Tindakan Korektif (Corrective Action):</p>
                  <p className="text-slate-600 leading-relaxed">{finding.correctiveAction}</p>
                </div>
                {finding.attachmentAfterUrl && onEditFinding && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditFinding(finding);
                      }}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Ubah Foto After / Catatan Progress</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Notes & Impact details */}
          {(finding.progressNotes || finding.notes || finding.impactScore) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(finding.progressNotes || finding.notes) && (
                <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Catatan Kemajuan / Progress Terkini:</span>
                  </div>
                  <p className="text-blue-800 leading-relaxed font-medium">
                    {finding.progressNotes || finding.notes}
                  </p>
                </div>
              )}

              {finding.impactScore && (
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dampak &amp; Manfaat Hasil Kaizen:</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed font-medium">
                    {finding.impactScore}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              Inspektor: <span className="font-semibold text-slate-700">{finding.inspectorName}</span>
            </span>
            {finding.recordedBy && (
              <>
                <span className="text-slate-300">&bull;</span>
                <span>
                  Diinput Oleh: <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{finding.recordedBy}</span>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEditFinding && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditFinding(finding);
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Temuan</span>
              </button>
            )}
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
