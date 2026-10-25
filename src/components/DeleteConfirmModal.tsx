import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { InspectionFinding } from '../types';

interface DeleteConfirmModalProps {
  finding?: InspectionFinding | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count?: number;
  isClearAll?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  finding,
  isOpen,
  onClose,
  onConfirm,
  count,
  isClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="delete-confirm-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="delete-confirm-modal-card"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Top visual warning */}
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3.5 border border-rose-100 shadow-xs">
            <Trash2 className="w-7 h-7" />
          </div>
          
          <h3 className="text-lg font-black text-slate-900 mb-1">
            {isClearAll 
              ? 'Hapus Seluruh Temuan?' 
              : count && count > 1 
              ? `Hapus ${count} Temuan Terpilih?` 
              : `Hapus Temuan ${finding?.id || ''}?`}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            {isClearAll 
              ? 'Tindakan ini akan menghapus seluruh catatan temuan dari tabel & dashboard.' 
              : count && count > 1
              ? `Tindakan ini akan menghapus ${count} temuan terpilih secara permanen dari tabel & dashboard.`
              : 'Apakah Anda yakin ingin menghapus data temuan ini secara permanen dari tabel & dashboard?'}
          </p>

          {/* Finding summary card (if single finding) */}
          {finding && !isClearAll && (!count || count <= 1) && (
            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                  {finding.id}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">{finding.date}</span>
              </div>
              
              <p className="font-bold text-slate-800 line-clamp-2 leading-snug">
                {finding.finding}
              </p>
              
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                <span className="truncate max-w-[180px]">Area: <strong>{finding.area}</strong></span>
                <span className="truncate max-w-[140px]">PIC: <strong>{finding.pic}</strong></span>
              </div>
            </div>
          )}

          {isClearAll && (
            <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-200 text-left text-xs flex items-center gap-2.5 text-rose-800">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Data bawaan dapat dipulihkan kembali kapan saja melalui menu tombol reset di bagian bawah halaman.</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            id="cancel-delete-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            id="confirm-delete-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>
              {isClearAll 
                ? 'Ya, Hapus Semua Temuan' 
                : count && count > 1 
                ? `Ya, Hapus ${count} Temuan` 
                : 'Ya, Hapus Temuan'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
