import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  X, 
  LogIn, 
  LogOut, 
  ShieldAlert
} from 'lucide-react';
import { UserAccount } from '../types';
import { SYSTEM_ACCOUNTS } from '../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (account: UserAccount) => void;
  onLogout: () => void;
  restrictReason?: string | null;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  restrictReason
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim().toLowerCase();
    const matched = SYSTEM_ACCOUNTS.find(
      (acc) => acc.account.username.toLowerCase() === trimmedUser && acc.password === password
    );

    if (matched) {
      setSuccessMsg(`Berhasil login sebagai ${matched.account.role === 'admin' ? 'ADMIN' : 'ANGGOTA'}: ${matched.account.name}`);
      setTimeout(() => {
        onLogin(matched.account);
        setSuccessMsg('');
        setUsername('');
        setPassword('');
        onClose();
      }, 700);
    } else {
      setErrorMsg('Username atau Password tidak valid. Silakan periksa kembali kredensial Anda.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Menu Log In Sistem Genba
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-400/30">
                  Otentikasi
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Pembeda wewenang status temuan: <strong>Admin</strong> vs <strong>Anggota</strong>
              </p>
            </div>
          </div>

          {/* Current Active User Status Bar */}
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Akun Aktif Saat Ini:</span>
              {currentUser ? (
                <>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    currentUser.role === 'admin' 
                      ? 'bg-amber-400 text-slate-950 font-black' 
                      : 'bg-blue-400 text-slate-950 font-black'
                  }`}>
                    {currentUser.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5 text-slate-950" /> : <User className="w-3.5 h-3.5 text-slate-950" />}
                    {currentUser.role.toUpperCase()}
                  </span>
                  <span className="text-slate-300 font-semibold text-[11px] truncate max-w-[170px]">
                    {currentUser.name}
                  </span>
                </>
              ) : (
                <span className="text-slate-400 italic text-[11px]">Belum login</span>
              )}
            </div>

            {currentUser && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="text-[11px] text-rose-300 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Restriction Notice if user was triggered by unauthorized action */}
          {restrictReason && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900 animate-in slide-in-from-top-1">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-950">Akses Ditolak: Khusus Admin</p>
                <p className="text-rose-700 mt-0.5 leading-relaxed">{restrictReason}</p>
                <p className="text-[11px] text-rose-800 font-medium mt-1">
                  Silakan login menggunakan akun <strong>Admin</strong> untuk menutup temuan ini.
                </p>
              </div>
            </div>
          )}

          {/* Role Comparison Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Admin Role Card */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              currentUser?.role === 'admin'
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>1. Role: Admin</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Full Authority
                </span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>DAPAT membuat temuan CLOSE</strong> (Menutup temuan)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mencatat temuan baru &amp; edit seluruh data</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Verifikasi foto Before &amp; After</span>
                </li>
              </ul>
            </div>

            {/* Anggota Role Card */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              currentUser?.role === 'anggota'
                ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-400/20'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>2. Role: Anggota</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
                  Member / Inspector
                </span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Mencatat temuan baru di lapangan</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Update progress (Open &amp; In Progress)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-rose-700 font-semibold"><strong>TIDAK DAPAT membuat temuan CLOSE</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Login Manual */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="flex items-center gap-2">
              <span className="h-px bg-slate-200 flex-1"></span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Masukkan Username &amp; Password
              </span>
              <span className="h-px bg-slate-200 flex-1"></span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-semibold animate-in shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Username</span>
              </label>
              <input
                id="login-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ketik password..."
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                id="login-submit-btn"
                type="submit"
                className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In Sekarang</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
