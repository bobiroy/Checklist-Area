import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Factory, 
  ArrowRight
} from 'lucide-react';
import { UserAccount } from '../types';
import { verifyCredentials } from '../data/mockData';

interface LoginScreenProps {
  onLoginSuccess: (account: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Silakan masukkan Username dan Password lengkap.');
      return;
    }

    setIsSubmitting(true);
    const result = verifyCredentials(username, password);

    if (result.success && result.account) {
      const user = result.account;
      setSuccessInfo(`Kredensial terverifikasi! Masuk sebagai ${user.role === 'admin' ? 'ADMIN' : 'MEMBER'}.`);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess(user);
      }, 500);
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setErrorMessage(result.error || 'Username atau Password tidak valid.');
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 flex flex-col justify-between text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* Top Banner Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              PT APPAREL ONE INDONESIA
              <span className="hidden sm:inline-block text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Genba Kaizen System
              </span>
            </span>
            <p className="text-[11px] text-slate-400">
              Sistem Pengawasan Standar 5R, K3 Stop 6 &amp; Continuous Improvement Pabrik
            </p>
          </div>
        </div>

      </header>

      {/* Main Login Area - Centered of the page */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full mx-auto my-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Menu Masuk ke Sistem Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col justify-between text-slate-800">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Log in 
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Genba Management that conducted by Apparel One Indonesia
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                  <Lock className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              {/* Feedback Notifications */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              {successInfo && (
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p>{successInfo}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Input */}
                <div>
                  <label 
                    htmlFor="login-screen-username"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="login-screen-username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Masukkan username"
                      autoComplete="username"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm font-medium transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="mb-1.5">
                    <label 
                      htmlFor="login-screen-password"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="login-screen-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Masukkan kata sandi"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 text-sm font-medium transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memverifikasi Akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Sistem Genba Kaizen</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Role Authority Note without demo shortcuts */}
              <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ketentuan Hak Akses Sistem</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <p>
                    <strong className="text-amber-800 font-semibold">• Admin:</strong> Berwenang penuh mencatat temuan &amp; mengubah status temuan menjadi <strong>Close</strong>.
                  </p>
                  <p>
                    <strong className="text-blue-800 font-semibold">• Anggota:</strong> Berwenang mencatat temuan &amp; update progress (Open / In Progress), tetapi <strong>tidak dapat Close temuan</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center text-center">
              <span>Continuous Improvement Genba Kaizen</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-3 text-center text-xs text-slate-500">
        PT Apparel One Indonesia &bull; Continuous Improvement Division &bull; Semarang, Jawa Tengah
      </footer>
    </div>
  );
};
