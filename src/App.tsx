import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InspectionTableView } from './components/InspectionTableView';
import { ManagementStructureView } from './components/ManagementStructureView';
import { FactoryDashboardView } from './components/FactoryDashboardView';
import { ChecksheetView } from './components/ChecksheetView';
import { FindingFormModal } from './components/FindingFormModal';
import { PhotoProofModal } from './components/PhotoProofModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { ActiveTab, InspectionFinding, FindingStatus, FindingCategory, FactoryOption, UserAccount } from './types';
import { INITIAL_FINDINGS, SYSTEM_ACCOUNTS } from './data/mockData';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'factory_genba_findings_v1';
const USER_STORAGE_KEY = 'factory_genba_user_session_v1';

const normalizeCategory = (cat: string): FindingCategory => {
  if (cat === '5R' || cat === '5S & Housekeeping') return '5R';
  if (cat === 'Safety Stop 6' || cat === 'Safety & K3') return 'Safety Stop 6';
  if (cat === 'Waste & Elimination' || cat === 'Machinery & TPM' || cat === 'Environment & Waste' || cat === 'Ergonomics' || cat === 'Cost & Kaizen') {
    return 'Waste & Elimination';
  }
  if (cat === 'Quality' || cat === 'Quality & Poka-Yoke') return 'Quality';
  if (cat === 'Material Flow') return 'Material Flow';
  return '5R';
};

const normalizeDepartment = (dept?: string): string => {
  if (!dept) return 'Warehouse';
  const d = dept.toLowerCase();
  if (d === 'warehouse' || d.includes('ware') || d.includes('gudang') || d.includes('ppic')) return 'Warehouse';
  if (d === 'cutting' || d.includes('cut') || d.includes('potong')) return 'Cutting';
  if (d === 'distribusi' || d.includes('distrib') || d.includes('logist') || d.includes('transit') || d.includes('ppa') || d.includes('supermarket') || d.includes('heat')) return 'Distribusi';
  if (d === 'sewing' || d.includes('sew') || d.includes('jahit') || d.includes('prod') || d.includes('maint')) return 'Sewing';
  if (d.includes('finish') || d.includes('fg') || d.includes('good') || d.includes('pack') || d.includes('qa') || d.includes('qc') || d.includes('ehs')) return 'Finish Good';
  return 'Warehouse';
};

export default function App() {
  // Navigation: Default to 'dashboard' as landing page
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Persistence of inspection findings
  const [findings, setFindings] = useState<InspectionFinding[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Hanya temuan 1 sampai 3 yang tersisa dari data sample bawaan
          const legacyIdsToRemove = [
            'FND-2026-004', 'FND-2026-005', 'FND-2026-006', 'FND-2026-007',
            'FND-2026-008', 'FND-2026-009', 'FND-2026-010'
          ];
          const filtered = parsed.filter((item: InspectionFinding) => !legacyIdsToRemove.includes(item.id));
          return filtered.map((item: InspectionFinding) => ({
            ...item,
            category: normalizeCategory(item.category),
            department: normalizeDepartment(item.department)
          }));
        }
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_FINDINGS;
  });

  // User Authentication & Role State (Admin vs Anggota)
  // LAYER 1: First layer requires username & password before accessing web
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role && parsed.username) return parsed;
      }
    } catch {
      // fallback
    }
    // Default to null: User must log in first
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRestrictReason, setLoginRestrictReason] = useState<string | null>(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFinding, setEditingFinding] = useState<InspectionFinding | null>(null);
  const [defaultFactoryForModal, setDefaultFactoryForModal] = useState<FactoryOption | undefined>('AOI 1');
  const [photoProofFinding, setPhotoProofFinding] = useState<InspectionFinding | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save findings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(findings));
    } catch {
      // ignore
    }
  }, [findings]);

  // Show temporary toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Auth Handlers
  const handleLogin = (account: UserAccount) => {
    setCurrentUser(account);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(account));
    } catch {
      // ignore
    }
    showToast(`Berhasil masuk sebagai ${account.role === 'admin' ? 'ADMIN' : 'MEMBER'}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('Anda telah logout dari sistem. Silakan masukkan username dan password untuk masuk kembali.');
  };

  const handleOpenLoginWithReason = (reason?: string) => {
    setLoginRestrictReason(reason || null);
    setIsLoginModalOpen(true);
  };

  // Add / Edit submission: Seluruh temuan otomatis masuk ke BI Genba ('bi-monthly')
  const handleSaveFinding = (finding: InspectionFinding) => {
    // Role check: Only admin can save finding with status Closed
    if (finding.status === 'Closed' && currentUser?.role !== 'admin') {
      showToast('⚠️ Akses Ditolak: Hanya Admin yang dapat membuat temuan Close.');
      handleOpenLoginWithReason('Hanya akun Admin yang berwenang menetapkan status Closed.');
      return;
    }

    const findingWithBI: InspectionFinding = {
      ...finding,
      hierarchyLevel: 'bi-monthly'
    };
    setFindings((prev) => {
      const existsIndex = prev.findIndex((f) => f.id === findingWithBI.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = findingWithBI;
        showToast(`Temuan ${findingWithBI.id} berhasil diperbarui.`);
        return updated;
      } else {
        showToast(`Temuan baru ${findingWithBI.id} berhasil dicatat.`);
        return [findingWithBI, ...prev];
      }
    });
    setEditingFinding(null);
  };

  // Delete finding
  const handleDeleteFinding = (id: string) => {
    setFindings((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast(`Temuan ${id} telah dihapus.`);
  };

  // Delete multiple findings
  const handleDeleteMultipleFindings = (ids: string[]) => {
    setFindings((prev) => {
      const updated = prev.filter((f) => !ids.includes(f.id));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast(`${ids.length} temuan berhasil dihapus.`);
  };

  // Clear all findings
  const handleClearAllFindings = () => {
    setFindings([]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
    showToast('Seluruh temuan pada tabel berhasil dihapus.');
  };

  // Quick inline status update
  const handleQuickUpdateStatus = (id: string, newStatus: FindingStatus) => {
    // Strict Guard: Hanya Admin yang dapat membuat temuan status Closed
    if (newStatus === 'Closed' && currentUser?.role !== 'admin') {
      showToast('⚠️ Akses Ditolak: Hanya Admin yang dapat membuat temuan Close.');
      handleOpenLoginWithReason('Hanya Admin yang berwenang menutup temuan (Status Closed). Akun Anda saat ini adalah Anggota.');
      return;
    }

    setFindings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            closeDate: newStatus === 'Closed' ? (item.closeDate || new Date().toISOString().split('T')[0]) : item.closeDate
          };
        }
        return item;
      })
    );
    showToast(`Status temuan ${id} diubah menjadi: ${newStatus}`);
  };

  // Reset sample data
  const handleResetData = () => {
    setIsResetModalOpen(true);
  };

  const performResetData = () => {
    setFindings(INITIAL_FINDINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FINDINGS));
    showToast('Data temuan berhasil di-reset ke data bawaan.');
  };

  // FIRST LAYER SECURITY GATEKEEPER
  // User MUST input username & password and confirm identity before web is accessible
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <LoginScreen onLoginSuccess={handleLogin} />
        {toastMessage && (
          <div 
            id="app-toast-alert"
            className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2 fade-in"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewFindingModal={() => {
          setEditingFinding(null);
          setIsFormModalOpen(true);
        }}
        findings={findings}
        currentUser={currentUser}
        onOpenLoginModal={() => handleOpenLoginWithReason()}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            findings={findings}
            onNavigateTab={setActiveTab}
            onOpenFindingModal={() => {
              setDefaultFactoryForModal('AOI 1');
              setEditingFinding(null);
              setIsFormModalOpen(true);
            }}
            onSelectPhotoProof={(finding) => setPhotoProofFinding(finding)}
            onEditFinding={(finding) => {
              setEditingFinding(finding);
              setIsFormModalOpen(true);
            }}
          />
        )}

        {activeTab === 'factory-dashboard' && (
          <FactoryDashboardView
            findings={findings}
            onOpenFindingModal={(defaultFac) => {
              setDefaultFactoryForModal(defaultFac || 'AOI 1');
              setEditingFinding(null);
              setIsFormModalOpen(true);
            }}
            onSelectPhotoProof={(finding) => setPhotoProofFinding(finding)}
            onEditFinding={(finding) => {
              setEditingFinding(finding);
              setIsFormModalOpen(true);
            }}
            onQuickUpdateStatus={handleQuickUpdateStatus}
            currentUser={currentUser}
            onOpenLoginModal={handleOpenLoginWithReason}
          />
        )}

        {activeTab === 'checksheet' && (
          <ChecksheetView
            findings={findings}
            currentUser={currentUser}
            onSaveFinding={handleSaveFinding}
            onSelectPhotoProof={(finding) => setPhotoProofFinding(finding)}
            onGoToInspectionTable={() => setActiveTab('leadership-walkthrough')}
          />
        )}

        {activeTab === 'leadership-walkthrough' && (
          <InspectionTableView
            findings={findings}
            onOpenNewFindingModal={() => {
              setEditingFinding(null);
              setIsFormModalOpen(true);
            }}
            onEditFinding={(finding) => {
              setEditingFinding(finding);
              setIsFormModalOpen(true);
            }}
            onDeleteFinding={handleDeleteFinding}
            onDeleteMultipleFindings={handleDeleteMultipleFindings}
            onClearAllFindings={handleClearAllFindings}
            onSelectPhotoProof={(finding) => setPhotoProofFinding(finding)}
            onQuickUpdateStatus={handleQuickUpdateStatus}
            currentUser={currentUser}
            onOpenLoginModal={handleOpenLoginWithReason}
          />
        )}

        {activeTab === 'management-structure' && (
          <ManagementStructureView 
            findings={findings}
            onOpenNewFindingModal={() => {
              setEditingFinding(null);
              setIsFormModalOpen(true);
            }}
            onEditFinding={(finding) => {
              setEditingFinding(finding);
              setIsFormModalOpen(true);
            }}
            onSelectPhotoProof={(finding) => setPhotoProofFinding(finding)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Sistem Manajemen Genba Factory Improvement</span>
            <span>&bull;</span>
            <span>PT Apparel One Indonesia Semarang &bull; Continuous Improvement Division</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-amber-700 underline text-[11px] cursor-pointer"
            >
              Reset Data Bawaan (Sample Data)
            </button>
            <span className="text-slate-300">|</span>
            <span>Standar 5S &bull; K3 Zero Accident &bull; ISO 9001</span>
          </div>
        </div>
      </footer>

      {/* Modal: Input / Edit Finding (9 Columns) */}
      <FindingFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingFinding(null);
        }}
        onSubmit={handleSaveFinding}
        initialData={editingFinding}
        defaultFactory={defaultFactoryForModal}
        currentUser={currentUser}
        onRequireAdmin={handleOpenLoginWithReason}
      />

      {/* Modal: Photo Proof Comparator / Viewer */}
      <PhotoProofModal
        finding={photoProofFinding}
        onClose={() => setPhotoProofFinding(null)}
        onEditFinding={(finding) => {
          setPhotoProofFinding(null);
          setEditingFinding(finding);
          setIsFormModalOpen(true);
        }}
      />

      {/* Modal: Menu Log In (Username & Password: Admin vs Anggota) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginRestrictReason(null);
        }}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        restrictReason={loginRestrictReason}
      />

      {/* Modal: Reset Confirmation */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={performResetData}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div 
          id="app-toast-alert"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2 fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
