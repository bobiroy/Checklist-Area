import { useState, useEffect, useCallback, useRef } from 'react';
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
import { INITIAL_FINDINGS } from './data/mockData';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'factory_genba_findings_v1';
const USER_STORAGE_KEY = 'factory_genba_user_session_v1';
const INITIAL_MOCK_IDS = new Set(INITIAL_FINDINGS.map((f) => f.id));

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

const normalizeFinding = (item: InspectionFinding): InspectionFinding => ({
  ...item,
  category: normalizeCategory(item.category),
  department: normalizeDepartment(item.department)
});

const normalizeFindingsList = (items: InspectionFinding[]): InspectionFinding[] =>
  items.map(normalizeFinding);

const saveToLocalStorageSafe = (items: InspectionFinding[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Jika kuota localStorage penuh (misalnya banyak foto resolusi tinggi),
    // simpan metadata tanpa data URL gambar besar agar tidak membuang data temuan.
    try {
      const compact = items.map((item) => ({
        ...item,
        attachmentUrl: item.attachmentUrl?.startsWith('data:image/') && item.attachmentUrl.length > 50000
          ? ''
          : item.attachmentUrl,
        attachmentAfterUrl: item.attachmentAfterUrl?.startsWith('data:image/') && item.attachmentAfterUrl.length > 50000
          ? ''
          : item.attachmentAfterUrl
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
    } catch {
      // Abaikan jika browser memblokir storage
    }
  }
};

export default function App() {
  // Navigation: Default to 'dashboard' as landing page
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Persistence of inspection findings (localStorage fallback cache before server sync)
  const [findings, setFindings] = useState<InspectionFinding[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizeFindingsList(parsed);
        }
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_FINDINGS;
  });

  // Global Active Factory synchronization across Checksheet, Factory Dashboard, and modal
  const [activeFactory, setActiveFactory] = useState<FactoryOption>('AOI 1');

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

  const hasSyncedLocalCacheRef = useRef(false);
  const isMutatingRef = useRef(false);

  // Fetch findings from shared server API
  const fetchFindingsFromServer = useCallback(async (allowLocalMigration = false) => {
    if (isMutatingRef.current) return;
    try {
      const res = await fetch('/api/findings', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data?.findings)) return;

      const serverFindings: InspectionFinding[] = normalizeFindingsList(data.findings);

      // Migrate custom findings created offline/previously in localStorage if server still only has initial seed
      if (allowLocalMigration && !hasSyncedLocalCacheRef.current) {
        hasSyncedLocalCacheRef.current = true;
        try {
          const savedRaw = localStorage.getItem(STORAGE_KEY);
          if (savedRaw) {
            const parsedLocal = JSON.parse(savedRaw);
            if (Array.isArray(parsedLocal)) {
              const serverIds = new Set(serverFindings.map((f) => f.id));
              const customUnsynced = parsedLocal.filter(
                (f: InspectionFinding) => f?.id && f?.finding && !INITIAL_MOCK_IDS.has(f.id) && !serverIds.has(f.id)
              );
              const serverOnlyHasInitial = serverFindings.every((f) => INITIAL_MOCK_IDS.has(f.id));
              if (customUnsynced.length > 0 && serverOnlyHasInitial) {
                const batchRes = await fetch('/api/findings/batch', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ findings: normalizeFindingsList(customUnsynced) })
                });
                if (batchRes.ok) {
                  const batchData = await batchRes.json();
                  if (Array.isArray(batchData?.findings)) {
                    const merged = normalizeFindingsList(batchData.findings);
                    setFindings(merged);
                    saveToLocalStorageSafe(merged);
                    return;
                  }
                }
              }
            }
          }
        } catch {
          // ignore local migration error
        }
      }

      if (!isMutatingRef.current) {
        setFindings(serverFindings);
        saveToLocalStorageSafe(serverFindings);
      }
    } catch {
      // Offline / network fallback keeps local cache
    }
  }, []);

  // Initial load from server
  useEffect(() => {
    fetchFindingsFromServer(true);
  }, [fetchFindingsFromServer]);

  // Refetch when user navigates to dashboard or table views so HP/PC stay in sync
  useEffect(() => {
    if (!currentUser) return;
    if (activeTab === 'dashboard' || activeTab === 'factory-dashboard' || activeTab === 'leadership-walkthrough' || activeTab === 'management-structure') {
      fetchFindingsFromServer(false);
    }
  }, [activeTab, currentUser, fetchFindingsFromServer]);

  // Background polling & tab visibility sync across devices (HP <-> Desktop)
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchFindingsFromServer(false);
      }
    }, 5000);

    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchFindingsFromServer(false);
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
    };
  }, [currentUser, fetchFindingsFromServer]);

  // Keep localStorage backup cache synced
  useEffect(() => {
    saveToLocalStorageSafe(findings);
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

  // Add / Edit submission: Seluruh temuan otomatis masuk ke BI Genba ('bi-monthly') dan tersimpan ke database server
  const handleSaveFinding = async (finding: InspectionFinding) => {
    // Role check: Only admin can save finding with status Closed
    if (finding.status === 'Closed' && currentUser?.role !== 'admin') {
      showToast('⚠️ Akses Ditolak: Hanya Admin yang dapat membuat temuan Close.');
      handleOpenLoginWithReason('Hanya akun Admin yang berwenang menetapkan status Closed.');
      return;
    }

    const findingWithBI: InspectionFinding = normalizeFinding({
      ...finding,
      hierarchyLevel: 'bi-monthly',
      createdAt: finding.createdAt || Date.now()
    });

    if (finding.factory) {
      setActiveFactory(finding.factory);
    }

    let isUpdate = false;
    setFindings((prev) => {
      const existsIndex = prev.findIndex((f) => f.id === findingWithBI.id);
      if (existsIndex >= 0) {
        isUpdate = true;
        const updated = [...prev];
        updated[existsIndex] = findingWithBI;
        return updated;
      }
      return [findingWithBI, ...prev];
    });
    setEditingFinding(null);

    isMutatingRef.current = true;
    try {
      const res = await fetch('/api/findings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(findingWithBI)
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.findings)) {
          const synced = normalizeFindingsList(data.findings);
          setFindings(synced);
          saveToLocalStorageSafe(synced);
        }
        showToast(
          isUpdate
            ? `Temuan ${findingWithBI.id} berhasil diperbarui ke Dashboard.`
            : `Temuan baru ${findingWithBI.id} berhasil tersimpan ke Dashboard.`
        );
      } else {
        showToast(`⚠️ Temuan ${findingWithBI.id} tersimpan lokal, namun gagal sinkron ke server.`);
      }
    } catch {
      showToast(`⚠️ Koneksi terganggu. Temuan ${findingWithBI.id} tersimpan di perangkat ini.`);
    } finally {
      isMutatingRef.current = false;
    }
  };

  // Batch save multiple findings from Checksheet
  const handleSaveMultipleFindings = async (incomingFindings: InspectionFinding[]) => {
    if (!incomingFindings || incomingFindings.length === 0) return;

    const validFindings: InspectionFinding[] = [];
    for (const f of incomingFindings) {
      if (f.status === 'Closed' && currentUser?.role !== 'admin') {
        showToast('⚠️ Akses Ditolak: Hanya Admin yang dapat membuat temuan Close.');
        handleOpenLoginWithReason('Hanya akun Admin yang berwenang menetapkan status Closed.');
        return;
      }
      validFindings.push(
        normalizeFinding({
          ...f,
          hierarchyLevel: 'bi-monthly',
          createdAt: f.createdAt || Date.now()
        })
      );
    }

    const lastFactory = validFindings[validFindings.length - 1]?.factory;
    if (lastFactory) {
      setActiveFactory(lastFactory);
    }

    setFindings((prev) => {
      const next = [...prev];
      for (let i = validFindings.length - 1; i >= 0; i--) {
        const item = validFindings[i];
        const idx = next.findIndex((existing) => existing.id === item.id);
        if (idx >= 0) {
          next[idx] = item;
        } else {
          next.unshift(item);
        }
      }
      return next;
    });

    isMutatingRef.current = true;
    try {
      const res = await fetch('/api/findings/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ findings: validFindings })
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.findings)) {
          const synced = normalizeFindingsList(data.findings);
          setFindings(synced);
          saveToLocalStorageSafe(synced);
        }
        showToast(`✅ ${validFindings.length} temuan checksheet berhasil tersimpan ke Dashboard.`);
      } else {
        showToast(`⚠️ ${validFindings.length} temuan tersimpan lokal, namun gagal sinkron ke server.`);
      }
    } catch {
      showToast(`⚠️ Koneksi terganggu. ${validFindings.length} temuan tersimpan di perangkat ini.`);
    } finally {
      isMutatingRef.current = false;
    }
  };

  // Delete finding
  const handleDeleteFinding = async (id: string) => {
    setFindings((prev) => prev.filter((f) => f.id !== id));

    isMutatingRef.current = true;
    try {
      const res = await fetch(`/api/findings/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.findings)) {
          const synced = normalizeFindingsList(data.findings);
          setFindings(synced);
          saveToLocalStorageSafe(synced);
        }
      }
    } catch {
      // ignore network error
    } finally {
      isMutatingRef.current = false;
    }
    showToast(`Temuan ${id} telah dihapus.`);
  };

  // Delete multiple findings
  const handleDeleteMultipleFindings = async (ids: string[]) => {
    setFindings((prev) => prev.filter((f) => !ids.includes(f.id)));

    isMutatingRef.current = true;
    try {
      const res = await fetch('/api/findings/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.findings)) {
          const synced = normalizeFindingsList(data.findings);
          setFindings(synced);
          saveToLocalStorageSafe(synced);
        }
      }
    } catch {
      // ignore
    } finally {
      isMutatingRef.current = false;
    }
    showToast(`${ids.length} temuan berhasil dihapus.`);
  };

  // Clear all findings
  const handleClearAllFindings = async () => {
    setFindings([]);
    saveToLocalStorageSafe([]);

    isMutatingRef.current = true;
    try {
      await fetch('/api/findings', { method: 'DELETE' });
    } catch {
      // ignore
    } finally {
      isMutatingRef.current = false;
    }
    showToast('Seluruh temuan pada tabel berhasil dihapus.');
  };

  // Quick inline status update
  const handleQuickUpdateStatus = async (id: string, newStatus: FindingStatus) => {
    // Strict Guard: Hanya Admin yang dapat membuat temuan status Closed
    if (newStatus === 'Closed' && currentUser?.role !== 'admin') {
      showToast('⚠️ Akses Ditolak: Hanya Admin yang dapat membuat temuan Close.');
      handleOpenLoginWithReason('Hanya Admin yang berwenang menutup temuan (Status Closed). Akun Anda saat ini adalah Anggota.');
      return;
    }

    const existing = findings.find((f) => f.id === id);
    const nextCloseDate = newStatus === 'Closed'
      ? (existing?.closeDate || new Date().toISOString().split('T')[0])
      : existing?.closeDate;

    setFindings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            closeDate: nextCloseDate
          };
        }
        return item;
      })
    );

    isMutatingRef.current = true;
    try {
      const res = await fetch(`/api/findings/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, closeDate: nextCloseDate })
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.findings)) {
          const synced = normalizeFindingsList(data.findings);
          setFindings(synced);
          saveToLocalStorageSafe(synced);
        }
      }
    } catch {
      // ignore
    } finally {
      isMutatingRef.current = false;
    }
    showToast(`Status temuan ${id} diubah menjadi: ${newStatus}`);
  };

  // Reset sample data
  const handleResetData = () => {
    setIsResetModalOpen(true);
  };

  const performResetData = async () => {
    setFindings(INITIAL_FINDINGS);
    saveToLocalStorageSafe(INITIAL_FINDINGS);

    isMutatingRef.current = true;
    try {
      const res = await fetch('/api/findings/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.findings)) {
          const synced = normalizeFindingsList(data.findings);
          setFindings(synced);
          saveToLocalStorageSafe(synced);
        }
      }
    } catch {
      // ignore
    } finally {
      isMutatingRef.current = false;
    }
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-24 md:pb-8">
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
            selectedFactory={activeFactory}
            onSelectFactory={setActiveFactory}
            onOpenFindingModal={(defaultFac) => {
              setDefaultFactoryForModal(defaultFac || activeFactory);
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
            selectedFactory={activeFactory}
            onSelectFactory={setActiveFactory}
            onSaveFinding={handleSaveFinding}
            onSaveMultipleFindings={handleSaveMultipleFindings}
            onSelectPhotoProof={(finding) => setPhotoProofFinding(finding)}
            onGoToInspectionTable={() => setActiveTab('leadership-walkthrough')}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onNavigateToFactoryDashboard={(factory) => {
              setActiveFactory(factory);
              setActiveTab('factory-dashboard');
            }}
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
            <span>PT. Apparel One Indonesia Semarang.</span>
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
          className="fixed bottom-20 md:bottom-5 left-3 right-3 sm:left-auto sm:right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-2 fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
