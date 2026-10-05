export type FindingCategory = 
  | '5R'
  | 'Safety Stop 6'
  | 'Waste & Elimination'
  | 'Quality'
  | 'Material Flow';

export type FindingStatus = 'Open' | 'In Progress' | 'Closed' | 'Pending Verification';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type GenbaHierarchyLevel = 
  | 'bi-monthly'   // BI MONTHLY - Genba with Adidas
  | 'bi-weekly'    // Legacy fallback compatibility
  | 'bod-genba'    // BoD GENBA - Genba with Board Of Directors
  | 'cross-check'  // CROSS CHECK GENBA MANAGEMENT - Monthly Genba internal Operation Excellence
  | 'daily-genba'; // DAILY GENBA (SHOPFLOOR MANAGEMENT) - GL & Supervisor Genba everyday on site

export interface GenbaHierarchyTier {
  id: GenbaHierarchyLevel;
  levelNumber: number; // 1 (Apex), 2, 3, 4 (Base)
  name: string; // e.g., "BI MONTHLY", "BoD GENBA"
  subtitle: string; // e.g., "Genba with Adidas", "Genba with Board Of Directors"
  description: string;
  frequency: string;
  frequencyCode: 'Bi-Monthly' | 'Bi-Weekly' | 'Monthly' | 'Monthly Internal' | 'Daily';
  participants: string;
  leadRole: string;
  targetArea: string;
  iconType: 'calendar' | 'users' | 'clipboard' | 'hard-hat';
  colors: {
    gradient: string;
    border: string;
    text: string;
    badgeBg: string;
    accent: string;
    pyramidBg: string;
    pyramidHover: string;
  };
  objectives: string[];
  standardChecklist: string[];
  kpiTarget: string;
  picLeader: string;
}

export interface GenbaWalkthroughSession {
  id: string;
  hierarchyLevel: GenbaHierarchyLevel;
  date: string; // YYYY-MM-DD
  time?: string; // e.g., "09:00 - 11:30 WIB"
  shift?: string; // e.g., "Shift 1", "Shift 2", "General Office"
  area: string;
  leader: string;
  participants: string;
  focusTheme: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  totalFindingsCount?: number;
  notes?: string;
}

export interface InspectionFinding {
  id: string;
  date: string; // YYYY-MM-DD
  area: string; // e.g. "Stamping Line A", "Assembly Line 2"
  finding: string; // Deskripsi temuan
  category: FindingCategory;
  pic: string; // Nama PIC & Jabatan
  department: string; // Departemen yang bertanggung jawab
  correctiveAction: string; // Tindakan korektif & rencana perbaikan
  status: FindingStatus;
  closeDate?: string; // Tanggal penyelesaian aktual atau target penyelesaian
  targetDate?: string; // Target SLA penyelesaian
  attachmentUrl: string; // Photo proof utama / foto temuan (Before)
  attachmentAfterUrl?: string; // Photo proof perbaikan (After)
  photoCaption?: string;
  priority: PriorityLevel;
  inspectorName: string; // e.g. Plant Manager / Kaizen Leader
  recordedBy?: string; // Nama user yang menginput temuan saat genba
  weekNumber: number; // e.g. 38
  hierarchyLevel?: GenbaHierarchyLevel; // Reference to Pyramid Tier
  notes?: string;
  progressNotes?: string; // Catatan progress perbaikan yang sedang berjalan
  impactScore?: string; // e.g. "Eliminasi potensi cedera tangan", "Reduksi cycle time 4.2s"
}

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  headName: string;
  headTitle: string;
  avatarUrl: string;
  email: string;
  phone: string;
  teamSize: number;
  color: string;
  badgeBg: string;
  badgeText: string;
  genbaRoleDescription: string;
  keyResponsibilities: string[];
  inspectionAreas: string[];
  raci: {
    responsible: string;
    accountable: string;
    consulted: string;
    informed: string;
  };
}

export interface GenbaActivityVisual {
  id: string;
  title: string;
  date: string;
  area: string;
  department: string;
  category: FindingCategory;
  beforePhoto: string;
  afterPhoto: string;
  problemDescription: string;
  solutionDescription: string;
  impactSummary: string;
  leaderName: string;
  pic: string;
}

export interface DepartmentWeeklyStat {
  departmentId: string;
  departmentName: string;
  totalAssigned: number;
  closed: number;
  inProgress: number;
  open: number;
  closureRate: number; // percentage
  targetMet: boolean;
}

export interface WeeklyReportSummary {
  weekNumber: number;
  monthYear: string;
  dateRange: string;
  theme: string;
  totalFindings: number;
  closedCount: number;
  inProgressCount: number;
  openCount: number;
  overallClosureRate: number;
  topPerformingDept: string;
  criticalAlertCount: number;
  departmentStats: DepartmentWeeklyStat[];
  keyHighlight: {
    title: string;
    area: string;
    pic: string;
    impact: string;
    beforePhoto: string;
    afterPhoto: string;
    explanation: string;
  };
}

export type ActiveTab = 
  | 'dashboard'
  | 'leadership-walkthrough'
  | 'weekly-logs'
  | 'management-structure';
