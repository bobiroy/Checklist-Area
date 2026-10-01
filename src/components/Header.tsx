import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  CalendarDays, 
  Network, 
  Plus, 
  Factory, 
  Clock, 
  Calendar,
  AlertCircle,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab, InspectionFinding } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenNewFindingModal: () => void;
  findings: InspectionFinding[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewFindingModal,
  findings
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
            <span className="font-bold text-amber-300">PT Apparel One Indonesia Semarang</span>
          </span>
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

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
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
            id="nav-tab-weekly-logs"
            onClick={() => onSelectTab('weekly-logs')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'weekly-logs'
                ? 'bg-amber-50 text-amber-900 border-b-2 border-amber-600'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-emerald-600" />
            <span>Weekly Finding Logs</span>
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
        </nav>
      </div>
    </header>
  );
};
