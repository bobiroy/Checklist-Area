import React, { useState, useEffect } from 'react';
import { 
  Network, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Building, 
  Users, 
  ChevronRight, 
  Target, 
  Sparkles, 
  ClipboardList,
  Calendar,
  Clock,
  HardHat,
  Plus,
  Edit3,
  Trash2,
  Filter,
  Layers,
  MapPin,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { 
  DepartmentInfo, 
  InspectionFinding, 
  GenbaHierarchyTier, 
  GenbaHierarchyLevel, 
  GenbaWalkthroughSession 
} from '../types';
import { 
  DEPARTMENTS, 
  PLANT_MANAGER_PROFILE, 
  GENBA_HIERARCHY_TIERS, 
  INITIAL_WALKTHROUGH_SESSIONS 
} from '../data/mockData';
import { WalkthroughSessionModal } from './WalkthroughSessionModal';
import { EditHierarchyTierModal } from './EditHierarchyTierModal';

interface ManagementStructureViewProps {
  findings: InspectionFinding[];
}

export const ManagementStructureView: React.FC<ManagementStructureViewProps> = ({
  findings
}) => {
  // Primary Navigation Tab within Management Structure
  const [activeSection, setActiveSection] = useState<'hierarchy' | 'sessions' | 'departments'>('hierarchy');

  // Hierarchy Tiers State (with localStorage persistence)
  const [hierarchyTiers, setHierarchyTiers] = useState<GenbaHierarchyTier[]>(() => {
    const saved = localStorage.getItem('genba_hierarchy_tiers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved hierarchy tiers', e);
      }
    }
    return GENBA_HIERARCHY_TIERS;
  });

  // Selected Pyramid Tier
  const [selectedTierId, setSelectedTierId] = useState<GenbaHierarchyLevel>('bi-weekly');

  // Walkthrough Sessions State (with localStorage persistence)
  const [sessions, setSessions] = useState<GenbaWalkthroughSession[]>(() => {
    const saved = localStorage.getItem('genba_walkthrough_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved walkthrough sessions', e);
      }
    }
    return INITIAL_WALKTHROUGH_SESSIONS;
  });

  // Filter for sessions tab
  const [sessionFilterLevel, setSessionFilterLevel] = useState<string>('all');

  // Modals state
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isEditTierModalOpen, setIsEditTierModalOpen] = useState(false);

  // Selected Department State (for department org chart tab)
  const [selectedDept, setSelectedDept] = useState<DepartmentInfo>(DEPARTMENTS[0]);

  // Persist tiers to localStorage
  useEffect(() => {
    localStorage.setItem('genba_hierarchy_tiers', JSON.stringify(hierarchyTiers));
  }, [hierarchyTiers]);

  // Persist sessions to localStorage
  useEffect(() => {
    localStorage.setItem('genba_walkthrough_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Active selected tier object
  const activeTier = hierarchyTiers.find(t => t.id === selectedTierId) || hierarchyTiers[0];

  // Sessions for current active tier
  const tierSessions = sessions.filter(s => s.hierarchyLevel === selectedTierId);

  // Compute live department findings stats
  const getDeptStats = (dept: DepartmentInfo) => {
    const deptFindings = findings.filter(f => 
      f.department.toLowerCase().includes(dept.name.toLowerCase()) || 
      f.department.toLowerCase().includes(dept.code.toLowerCase())
    );
    const closed = deptFindings.filter(f => f.status === 'Closed').length;
    const rate = deptFindings.length > 0 ? Math.round((closed / deptFindings.length) * 100) : 100;
    return {
      total: deptFindings.length,
      closed,
      rate
    };
  };

  const currentDeptStats = getDeptStats(selectedDept);

  // Handle adding new session
  const handleAddSession = (newSession: GenbaWalkthroughSession) => {
    setSessions(prev => [newSession, ...prev]);
  };

  // Handle deleting session
  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Hapus agenda walkthrough ini?')) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  // Handle status toggle for session
  const handleToggleSessionStatus = (sessionId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        const nextStatus: Record<string, 'Scheduled' | 'In Progress' | 'Completed'> = {
          'Scheduled': 'In Progress',
          'In Progress': 'Completed',
          'Completed': 'Scheduled'
        };
        return { ...s, status: nextStatus[s.status] };
      }
      return s;
    }));
  };

  // Handle updating tier config
  const handleSaveTier = (updatedTier: GenbaHierarchyTier) => {
    setHierarchyTiers(prev => prev.map(t => t.id === updatedTier.id ? updatedTier : t));
  };

  // Helper for tier icon
  const renderTierIcon = (iconType: string, className: string = "w-5 h-5") => {
    switch (iconType) {
      case 'calendar':
        return <Calendar className={className} />;
      case 'users':
        return <Users className={className} />;
      case 'clipboard':
        return <ClipboardList className={className} />;
      case 'hard-hat':
        return <HardHat className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Hirarki Tata Kelola Genba Multi-Tier
            </span>
            <span className="text-xs text-slate-500">Standar Operasional Partner Brand Adidas</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Genba Management Structure &amp; Walkthrough Hierarchy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Piramida 4-tingkat kepemimpinan inspeksi lapangan (Genba Walk) dari tingkat harian shopfloor hingga inspeksi direksi dan perwakilan Adidas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSessionModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Agenda Walkthrough</span>
          </button>
        </div>
      </div>

      {/* Main Section Navigation Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSection('hierarchy')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSection === 'hierarchy'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Diagram Piramida Hirarki Genba</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/20 text-amber-300">
            4 Tier
          </span>
        </button>

        <button
          onClick={() => setActiveSection('sessions')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSection === 'sessions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>Log &amp; Jadwal Agenda Walkthrough</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
            {sessions.length} Sesi
          </span>
        </button>

        <button
          onClick={() => setActiveSection('departments')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSection === 'departments'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Network className="w-4 h-4 text-purple-400" />
          <span>Struktur Departemen &amp; Matriks RACI</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/20 text-purple-300">
            {DEPARTMENTS.length} Divisi
          </span>
        </button>
      </div>

      {/* SECTION 1: PIRAMIDA HIRARKI GENBA (SESUAI FOTO) */}
      {activeSection === 'hierarchy' && (
        <div className="space-y-6">
          {/* Main Visual: 3D Pyramid & Matching Callout Cards */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl text-white relative overflow-hidden">
            {/* Background lighting flare */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Visualisasi Diagram Hirarki Kepemimpinan Genba
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Struktur 4 Tingkat Walkthrough Manajemen Pabrik
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Piramida operasional ini mengintegrasikan pengawasan harian lantai produksi (Shopfloor) hingga verifikasi strategis bersama Direksi dan brand partner Adidas. Klik salah satu tingkat untuk melihat detail dan SOP.
                </p>
              </div>

              {/* Grid: 3D Pyramid (Left) & Real Callout Cards (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: 3D Stepped Pyramid Graphic */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center p-4">
                  <div className="w-full max-w-md space-y-2.5">
                    {/* Tier 1: Apex - BI WEEKLY (Gold) */}
                    <div 
                      onClick={() => setSelectedTierId('bi-weekly')}
                      className={`relative cursor-pointer transition-all duration-300 transform group ${
                        selectedTierId === 'bi-weekly'
                          ? 'scale-105 z-40'
                          : 'hover:scale-102 opacity-90 hover:opacity-100 z-30'
                      }`}
                    >
                      <div className="w-40 sm:w-48 mx-auto h-20 bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-600 rounded-t-2xl shadow-lg border-2 border-amber-200/90 flex flex-col items-center justify-center text-center p-2 relative overflow-hidden group-hover:shadow-amber-500/50">
                        <div className="absolute inset-0 bg-radial from-white/30 to-transparent pointer-events-none"></div>
                        <span className="text-[10px] font-mono font-black text-amber-950 bg-amber-300/80 px-2 py-0.5 rounded-full mb-0.5 shadow-xs">
                          TIER 1 (APEX)
                        </span>
                        <h3 className="text-xs sm:text-sm font-black text-slate-950 tracking-wider">
                          BI WEEKLY
                        </h3>
                        <p className="text-[10px] font-bold text-amber-950">
                          Genba with Adidas
                        </p>
                        {selectedTierId === 'bi-weekly' && (
                          <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-950 animate-ping"></div>
                        )}
                      </div>
                    </div>

                    {/* Tier 2: Level 2 - BoD GENBA (Blue) */}
                    <div 
                      onClick={() => setSelectedTierId('bod-genba')}
                      className={`relative cursor-pointer transition-all duration-300 transform group ${
                        selectedTierId === 'bod-genba'
                          ? 'scale-105 z-40'
                          : 'hover:scale-102 opacity-90 hover:opacity-100 z-20'
                      }`}
                    >
                      <div className="w-64 sm:w-72 mx-auto h-18 bg-gradient-to-b from-blue-500 via-blue-600 to-indigo-800 rounded-xl shadow-lg border-2 border-blue-400/80 flex flex-col items-center justify-center text-center p-2 relative overflow-hidden group-hover:shadow-blue-500/50">
                        <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none"></div>
                        <span className="text-[9px] font-mono font-bold text-blue-100 bg-blue-900/60 px-2 py-0.2 rounded-full mb-0.5">
                          TIER 2 &bull; EXECUTIVE
                        </span>
                        <h3 className="text-xs sm:text-sm font-black text-white tracking-wider">
                          BoD GENBA
                        </h3>
                        <p className="text-[10px] font-semibold text-blue-200">
                          Genba with Board Of Directors
                        </p>
                        {selectedTierId === 'bod-genba' && (
                          <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-300 animate-ping"></div>
                        )}
                      </div>
                    </div>

                    {/* Tier 3: Level 3 - CROSS CHECK GENBA MANAGEMENT (Orange/Bronze) */}
                    <div 
                      onClick={() => setSelectedTierId('cross-check')}
                      className={`relative cursor-pointer transition-all duration-300 transform group ${
                        selectedTierId === 'cross-check'
                          ? 'scale-105 z-40'
                          : 'hover:scale-102 opacity-90 hover:opacity-100 z-10'
                      }`}
                    >
                      <div className="w-80 sm:w-96 mx-auto h-18 bg-gradient-to-b from-amber-600 via-orange-600 to-orange-800 rounded-xl shadow-lg border-2 border-orange-400/80 flex flex-col items-center justify-center text-center p-2 relative overflow-hidden group-hover:shadow-orange-500/50">
                        <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none"></div>
                        <span className="text-[9px] font-mono font-bold text-orange-100 bg-orange-950/60 px-2 py-0.2 rounded-full mb-0.5">
                          TIER 3 &bull; CROSS-FUNCTIONAL
                        </span>
                        <h3 className="text-xs sm:text-sm font-black text-white tracking-wider truncate max-w-[280px]">
                          CROSS CHECK GENBA MANAGEMENT
                        </h3>
                        <p className="text-[10px] font-semibold text-orange-100">
                          Monthly Genba internal Operation Excellence
                        </p>
                        {selectedTierId === 'cross-check' && (
                          <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-orange-200 animate-ping"></div>
                        )}
                      </div>
                    </div>

                    {/* Tier 4: Base - DAILY GENBA (SHOPFLOOR MANAGEMENT) (Emerald/Teal) */}
                    <div 
                      onClick={() => setSelectedTierId('daily-genba')}
                      className={`relative cursor-pointer transition-all duration-300 transform group ${
                        selectedTierId === 'daily-genba'
                          ? 'scale-105 z-40'
                          : 'hover:scale-102 opacity-90 hover:opacity-100 z-0'
                      }`}
                    >
                      <div className="w-full mx-auto h-20 bg-gradient-to-b from-emerald-600 via-teal-700 to-teal-900 rounded-b-2xl shadow-xl border-2 border-teal-400/80 flex flex-col items-center justify-center text-center p-2 relative overflow-hidden group-hover:shadow-teal-500/50">
                        <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none"></div>
                        <span className="text-[9px] font-mono font-bold text-teal-100 bg-teal-950/60 px-2 py-0.2 rounded-full mb-0.5">
                          TIER 4 (FOUNDATION) &bull; DAILY SHOPFLOOR
                        </span>
                        <h3 className="text-xs sm:text-sm font-black text-white tracking-wider">
                          DAILY GENBA (SHOPFLOOR MANAGEMENT)
                        </h3>
                        <p className="text-[10px] font-semibold text-teal-100">
                          GL &amp; Supervisor Genba everyday on site
                        </p>
                        {selectedTierId === 'daily-genba' && (
                          <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-teal-300 animate-ping"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Visual Pedestal / Stage */}
                  <div className="w-full max-w-lg h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-full shadow-inner mt-2 border border-slate-600/60"></div>
                </div>

                {/* Right: Exact Callout Cards from the reference diagram */}
                <div className="lg:col-span-6 space-y-3">
                  {hierarchyTiers.map((tier) => {
                    const isSelected = selectedTierId === tier.id;
                    const tierSessionsCount = sessions.filter(s => s.hierarchyLevel === tier.id).length;

                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-white text-slate-900 border-amber-400 shadow-xl ring-2 ring-amber-400/40 translate-x-1'
                            : 'bg-slate-800/80 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Icon container */}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                              : 'bg-slate-900/90 text-amber-400 border-slate-700'
                          }`}>
                            {renderTierIcon(tier.iconType, "w-6 h-6")}
                          </div>

                          {/* Content */}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                isSelected ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-400'
                              }`}>
                                LEVEL {tier.levelNumber}
                              </span>
                              <span className={`text-[10px] font-bold ${
                                isSelected ? 'text-amber-700' : 'text-amber-400'
                              }`}>
                                &bull; {tier.frequency}
                              </span>
                            </div>

                            <h3 className={`text-sm font-black tracking-tight mt-0.5 ${
                              isSelected ? 'text-slate-950' : 'text-white'
                            }`}>
                              {tier.name}
                            </h3>

                            <p className={`text-xs font-semibold ${
                              isSelected ? 'text-slate-600' : 'text-slate-300'
                            }`}>
                              {tier.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Right stats badge */}
                        <div className="text-right shrink-0">
                          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                            isSelected 
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-slate-900/70 text-slate-300 border-slate-700'
                          }`}>
                            <span>{tierSessionsCount} Agenda</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE TIER PROFILE DETAIL CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {/* Tier Header with Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                  activeTier.id === 'bi-weekly' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  activeTier.id === 'bod-genba' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                  activeTier.id === 'cross-check' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                  'bg-teal-100 text-teal-800 border-teal-300'
                }`}>
                  {renderTierIcon(activeTier.iconType, "w-7 h-7")}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                      LEVEL {activeTier.levelNumber} &bull; {activeTier.frequencyCode}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {activeTier.frequency}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {activeTier.name} — <span className="text-amber-800">{activeTier.subtitle}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    {activeTier.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditTierModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Konfigurasi Level</span>
                </button>

                <button
                  onClick={() => setIsSessionModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Jadwalkan Sesi Ini</span>
                </button>
              </div>
            </div>

            {/* Parameter Cards: PIC, Participants, Scope, KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-slate-100">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Pimpinan Walkthrough (Lead):
                </span>
                <p className="text-xs font-bold text-slate-900">{activeTier.picLeader}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  Tim Peserta / Stakeholders:
                </span>
                <p className="text-xs font-semibold text-slate-800 truncate" title={activeTier.participants}>
                  {activeTier.participants}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  Area Cakupan Utama:
                </span>
                <p className="text-xs font-semibold text-slate-800 truncate" title={activeTier.targetArea}>
                  {activeTier.targetArea}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1 mb-1">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  Target KPI Kepatuhan:
                </span>
                <p className="text-xs font-black text-amber-950">{activeTier.kpiTarget}</p>
              </div>
            </div>

            {/* 2-Column: Objectives & Standard Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Left: Objectives */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Tujuan Pokok Inspeksi Level {activeTier.name}
                </h3>
                <div className="space-y-2.5">
                  {activeTier.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Standard Checklist & SOP */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-purple-600" />
                  Standar Poin Pemeriksaan (Checklist SOP)
                </h3>
                <div className="space-y-2.5">
                  {activeTier.standardChecklist.map((chk, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/40 border border-purple-100 text-xs text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sesi Terjadwal & Riwayat untuk Level Ini */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Agenda &amp; Riwayat Walkthrough Khusus {activeTier.name} ({tierSessions.length} Sesi)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jadwal walkthrough kepemimpinan yang telah dicatat untuk tingkat ini
                  </p>
                </div>
                <button
                  onClick={() => setIsSessionModalOpen(true)}
                  className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Sesi</span>
                </button>
              </div>

              {tierSessions.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">Belum ada agenda walkthrough untuk tingkat ini.</p>
                  <button
                    onClick={() => setIsSessionModalOpen(true)}
                    className="mt-2 text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    + Buat Agenda Sekarang
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tierSessions.map((s) => (
                    <div 
                      key={s.id} 
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="font-mono font-bold text-slate-500">{s.id}</span>
                          <span 
                            onClick={() => handleToggleSessionStatus(s.id)}
                            className={`px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                              s.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              s.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}
                            title="Klik untuk ubah status"
                          >
                            &bull; {s.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mb-1 line-clamp-2">
                          {s.focusTheme}
                        </h4>

                        <p className="text-[11px] text-slate-500 mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{s.area}</span>
                        </p>

                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2">
                          <span className="font-semibold text-slate-900">Lead: </span>{s.leader}
                          <br />
                          <span className="font-semibold text-slate-900">Tim: </span>
                          <span className="truncate">{s.participants}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {s.date} {s.time ? `(${s.time})` : ''}
                        </span>
                        <button
                          onClick={() => handleDeleteSession(s.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                          title="Hapus sesi ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: LOG & JADWAL SELURUH AGENDA WALKTHROUGH */}
      {activeSection === 'sessions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                Daftar Seluruh Agenda Walkthrough Berdasarkan Hirarki
              </h2>
              <p className="text-xs text-slate-500">
                Pencatatan sesi inspeksi Genba terjadwal, sedang berjalan, dan riwayat selesai di pabrik
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filter Level:</span>
                <select
                  value={sessionFilterLevel}
                  onChange={(e) => setSessionFilterLevel(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">Semua Level ({sessions.length})</option>
                  <option value="bi-weekly">1. BI WEEKLY (Adidas)</option>
                  <option value="bod-genba">2. BoD GENBA</option>
                  <option value="cross-check">3. CROSS CHECK MANAGEMENT</option>
                  <option value="daily-genba">4. DAILY GENBA SHOPFLOOR</option>
                </select>
              </div>

              <button
                onClick={() => setIsSessionModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Input Sesi</span>
              </button>
            </div>
          </div>

          {/* Sessions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3">Kode &amp; Tanggal</th>
                  <th className="py-3 px-3">Level Hirarki</th>
                  <th className="py-3 px-3">Area &amp; Shift</th>
                  <th className="py-3 px-3">Fokus &amp; Tema Kaizen</th>
                  <th className="py-3 px-3">Pimpinan &amp; Peserta</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions
                  .filter(s => sessionFilterLevel === 'all' || s.hierarchyLevel === sessionFilterLevel)
                  .map((session) => {
                    const tier = hierarchyTiers.find(t => t.id === session.hierarchyLevel) || hierarchyTiers[0];

                    return (
                      <tr key={session.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 whitespace-nowrap">
                          <p className="font-mono font-bold text-slate-900">{session.id}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {session.date}
                          </p>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                            session.hierarchyLevel === 'bi-weekly' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                            session.hierarchyLevel === 'bod-genba' ? 'bg-blue-50 text-blue-900 border-blue-300' :
                            session.hierarchyLevel === 'cross-check' ? 'bg-orange-50 text-orange-900 border-orange-300' :
                            'bg-teal-50 text-teal-900 border-teal-300'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {tier.name}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-0.5">{tier.subtitle}</p>
                        </td>

                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-900 line-clamp-1">{session.area}</p>
                          <p className="text-[11px] text-slate-500">{session.shift || 'Shift 1'}</p>
                        </td>

                        <td className="py-3 px-3 max-w-xs">
                          <p className="font-bold text-slate-900 line-clamp-2">{session.focusTheme}</p>
                          {session.notes && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                              Catatan: {session.notes}
                            </p>
                          )}
                        </td>

                        <td className="py-3 px-3 max-w-xs">
                          <p className="font-bold text-slate-800 line-clamp-1">{session.leader}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{session.participants}</p>
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleSessionStatus(session.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                              session.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' :
                              session.status === 'In Progress' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
                              'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                            title="Klik untuk mengubah status agenda"
                          >
                            &bull; {session.status}
                          </button>
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Hapus sesi ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: STRUKTUR DEPARTEMEN & RACI MATRIX */}
      {activeSection === 'departments' && (
        <div className="space-y-6">
          {/* Visual Organization Hierarchy Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2 text-center justify-center">
              <Network className="w-5 h-5 text-purple-600" />
              Bagan Organisasi Manajemen Genba Walk Pabrik
            </h2>

            {/* Level 1: Plant General Manager (Apex) */}
            <div className="max-w-md mx-auto mb-6">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl p-5 shadow-lg border border-slate-700 text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                  PLANT LEADERSHIP
                </div>

                <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-2 border-amber-400 p-0.5 shadow-md">
                  <img
                    src={PLANT_MANAGER_PROFILE.avatarUrl}
                    alt={PLANT_MANAGER_PROFILE.name}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <h3 className="text-base font-bold text-white">{PLANT_MANAGER_PROFILE.name}</h3>
                <p className="text-xs text-amber-300 font-semibold mb-2">{PLANT_MANAGER_PROFILE.title}</p>
                <p className="text-[11px] text-slate-300 italic max-w-sm mx-auto mb-3">
                  {PLANT_MANAGER_PROFILE.quote}
                </p>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-around text-[11px] text-slate-400">
                  <span>{PLANT_MANAGER_PROFILE.phone}</span>
                  <span>&bull;</span>
                  <span>Jadwal Genba: Setiap Selasa &amp; Kamis</span>
                </div>
              </div>

              {/* Tree connector arrow */}
              <div className="flex justify-center my-2">
                <div className="w-0.5 h-6 bg-slate-300"></div>
              </div>
            </div>

            {/* Level 2: Horizontal Departments Grid */}
            <div className="pt-2 border-t border-slate-200">
              <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Departemen Terkait Operasional Pabrik &amp; Tim Penanggung Jawab
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {DEPARTMENTS.map((dept) => {
                  const stats = getDeptStats(dept);
                  const isSelected = selectedDept.id === dept.id;

                  return (
                    <button
                      key={dept.id}
                      onClick={() => setSelectedDept(dept)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer relative ${
                        isSelected
                          ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border border-slate-200">
                          <img
                            src={dept.avatarUrl}
                            alt={dept.headName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 font-mono">
                          {dept.code}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight mt-0.5 line-clamp-2">
                          {dept.name}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 truncate">
                          {dept.headName.split(',')[0]}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">{dept.teamSize} Org</span>
                        <span className={`font-bold ${stats.rate >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {stats.rate}% Close
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Department Responsibility Profile Detail */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0 shadow-xs">
                  <img
                    src={selectedDept.avatarUrl}
                    alt={selectedDept.headName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      DEPARTEMEN {selectedDept.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedDept.teamSize} Anggota Tim
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {selectedDept.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                    Pimpinan: <span className="text-slate-900 font-bold">{selectedDept.headName}</span> &bull; {selectedDept.headTitle}
                  </p>
                </div>
              </div>

              {/* Department Contact Card */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 shrink-0">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedDept.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedDept.email}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-purple-700">
                  <Target className="w-3.5 h-3.5" />
                  <span>Penyelesaian Temuan: {currentDeptStats.closed}/{currentDeptStats.total} ({currentDeptStats.rate}%)</span>
                </div>
              </div>
            </div>

            {/* Responsibility Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Col 1: Peran Genba & Tanggung Jawab Kunci */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Peran Kunci dalam Kegiatan Genba Walk
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/40 p-3.5 rounded-xl border border-amber-200">
                    {selectedDept.genbaRoleDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-blue-600" />
                    Tanggung Jawab Utama di Pabrik (Key Responsibilities)
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {selectedDept.keyResponsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Col 2: RACI Matrix & Area Cakupan Inspeksi */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    Matriks Akuntabilitas RACI (Genba Improvement)
                  </h3>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200">
                      <span className="font-bold text-rose-800">R - Responsible:</span>
                      <p className="text-rose-900/80 mt-0.5">{selectedDept.raci.responsible}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200">
                      <span className="font-bold text-amber-800">A - Accountable:</span>
                      <p className="text-amber-900/80 mt-0.5">{selectedDept.raci.accountable}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200">
                      <span className="font-bold text-blue-800">C - Consulted:</span>
                      <p className="text-blue-900/80 mt-0.5">{selectedDept.raci.consulted}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                      <span className="font-bold text-emerald-800">I - Informed:</span>
                      <p className="text-emerald-900/80 mt-0.5">{selectedDept.raci.informed}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-600" />
                    Area Cakupan Inspeksi (Scope of Walkthrough)
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDept.inspectionAreas.map((area, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        📍 {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Input Walkthrough Session */}
      <WalkthroughSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onSubmit={handleAddSession}
        initialLevel={selectedTierId}
      />

      {/* Modal: Edit Hierarchy Tier Configuration */}
      <EditHierarchyTierModal
        isOpen={isEditTierModalOpen}
        onClose={() => setIsEditTierModalOpen(false)}
        tier={activeTier}
        onSave={handleSaveTier}
      />
    </div>
  );
};
