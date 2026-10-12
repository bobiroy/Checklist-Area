import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardCheck, 
  Network, 
  Plus, 
  Factory, 
  Clock, 
  Calendar, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2,
  ShieldCheck,
  User,
  KeyRound,
  Lock,
  LogOut
} from 'lucide-react';
import { ActiveTab, InspectionFinding, UserAccount } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenNewFindingModal: () => void;
  findings: InspectionFinding[];
  currentUser: UserAccount;
  onOpenLoginModal: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewFindingModal,
  findings,
  currentUser,
  onOpenLoginModal,
  onLogout
}) => {
  // Live date & time tracking
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentDateTime);

  const formattedTime = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(currentDateTime);

  // Compute top-level summary metrics
  const totalFindings = findings.length;
  const openCount = findings.filter(f => f.status === 'Open').length;
  const inProgressCount = findings.filter(f => f.status === 'In Progress' || f.status === 'Pending Verification').length;
  const closedCount = findings.filter(f => f.status === 'Closed').length;
  const closureRate = totalFindings > 0 ? Math.round((closedCount / totalFindings) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top status bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-amber-400 font-semibold shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GENBA MONITORING: ONLINE
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="flex items-center gap-1.5 text-slate-200 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-white">Live:</span>
            <span>{formattedDate}</span>
            <span className="hidden md:inline font-mono text-[10px] text-slate-400">({formattedTime} WIB)</span>
            <span>&bull;</span>
            <span className="font-bold text-amber-300">PT Apparel One Indonesia</span>
          </span>

          {/* User Role Quick Pill in Topbar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700 text-[10px] font-bold border border-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Klik untuk membuka Menu Log In"
            >
              <Lock className="w-2.5 h-2.5 text-amber-400" />
              <span>Role:</span>
              <span className={currentUser.role === 'admin' ? 'text-amber-300 font-extrabold' : 'text-blue-300 font-extrabold'}>
                {currentUser.role.toUpperCase()}
              </span>
              <span className="text-slate-400 font-normal hidden lg:inline">({currentUser.name.split(' ')[0]})</span>
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-[10px] text-rose-300 hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-rose-900/50 transition-colors cursor-pointer"
                title="Keluar / Logout dari Sistem"
              >
                <LogOut className="w-2.5 h-2.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
          </div>
        </div>

        {/* Realtime KPI Pill badges */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/60">
            <AlertCircle className="w-3 h-3" />
            {openCount} Open
          </span>
          <span className="flex items-center gap-1 text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
            <TrendingUp className="w-3 h-3" />
            {inProgressCount} In Progress
          </span>
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3" />
            {closedCount} Closed ({closureRate}%)
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Logo */}
          <div 
            className="flex items-center gap-3 select-none cursor-pointer group"
            onClick={() => onSelectTab('dashboard')}
            title="Genba Kaizen Dashboard - PT Apparel One Indonesia"
          >
            {/* Factory Brand Logo (Default) */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 shrink-0">
              <Factory className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-amber-700 transition-colors">
                  GENBA KAIZEN
                </span>
                <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300">
                  FACTORY OPS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                PT Apparel One Indonesia &bull; Continuous Improvement &amp; Genba Walk
              </p>
            </div>
          </div>

          {/* Quick Action Buttons: Menu Login + Catat Temuan Baru */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* MENU LOG IN & USER STATUS */}
            <button
              id="header-login-menu-btn"
              type="button"
              onClick={onOpenLoginModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs group ${
                currentUser.role === 'admin'
                  ? 'bg-gradient-to-r from-amber-50 to-amber-100/70 border-amber-300 text-amber-950 hover:border-amber-400 hover:shadow-xs'
                  : 'bg-gradient-to-r from-blue-50 to-blue-100/70 border-blue-300 text-blue-950 hover:border-blue-400 hover:shadow-xs'
              }`}
              title="Menu Log In: Ganti peran Admin atau Anggota"
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                currentUser.role === 'admin' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-blue-600 text-white shadow-xs'
              }`}>
                {currentUser.role === 'admin' ? (
                  <ShieldCheck className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>

              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] uppercase font-black tracking-wider px-1 py-0.2 rounded ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-200 text-amber-950'
                      : 'bg-blue-200 text-blue-950'
                  }`}>
                    {currentUser.role === 'admin' ? 'ADMIN' : 'ANGGOTA'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[90px]">
                    {currentUser.username}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                  {currentUser.role === 'admin' ? 'Bisa Close Temuan' : 'Khusus Open/Proses'}
                </p>
              </div>

              <div className="border-l border-slate-300/80 pl-2 ml-0.5 text-xs font-bold text-amber-800 group-hover:text-amber-950 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="text-[11px] font-black uppercase">Menu Log In</span>
              </div>
            </button>

            {/* Catat Temuan Baru Button */}
            <button
              id="header-add-finding-btn"
              onClick={onOpenNewFindingModal}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-amber-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Temuan Baru</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 py-1">
          <button
            id="nav-tab-dashboard"
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-amber-50 text-amber-900 border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-amber-600" />
            <span>Genba Dashboard</span>
          </button>

          <button
            id="nav-tab-factory-dashboard"
            onClick={() => onSelectTab('factory-dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'factory-dashboard'
                ? 'bg-amber-50 text-amber-900 border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Factory Dashboard</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-semibold font-mono">
              AOI 1-3
            </span>
          </button>

          <button
            id="nav-tab-leadership-walkthrough"
            onClick={() => onSelectTab('leadership-walkthrough')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'leadership-walkthrough'
                ? 'bg-amber-50 text-amber-900 border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ClipboardCheck className="w-4 h-4 text-blue-600" />
            <span>Leadership Walkthrough & Inspection</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-mono">
              {findings.length}
            </span>
          </button>

          <button
            id="nav-tab-management-structure"
            onClick={() => onSelectTab('management-structure')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'management-structure'
                ? 'bg-amber-50 text-amber-900 border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Network className="w-4 h-4 text-purple-600" />
            <span>Management Structure</span>
          </button>

          {/* Nav Right Menu Log In Quick Link & Logout */}
          <div className="ml-auto flex items-center gap-1.5 pl-2">
            <button
              id="nav-btn-login-menu"
              type="button"
              onClick={onOpenLoginModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                currentUser.role === 'admin'
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-950 border-blue-300'
              }`}
              title="Buka Menu Log In untuk verifikasi & ubah role"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Ganti Akun:</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-black ${
                currentUser.role === 'admin' ? 'bg-amber-200 text-amber-950' : 'bg-blue-200 text-blue-950'
              }`}>
                {currentUser.role.toUpperCase()}
              </span>
            </button>

            {onLogout && (
              <button
                id="nav-btn-logout"
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Keluar dari sistem (kembali ke layar login)"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
