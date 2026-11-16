import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ServerFinding {
  id: string;
  factory?: 'AOI 1' | 'AOI 2' | 'AOI 3' | 'DC';
  date: string;
  area: string;
  finding: string;
  category: string;
  pic: string;
  department: string;
  correctiveAction: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Pending Verification';
  closeDate?: string;
  targetDate?: string;
  attachmentUrl: string;
  attachmentAfterUrl?: string;
  photoCaption?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  inspectorName: string;
  recordedBy?: string;
  weekNumber: number;
  hierarchyLevel?: string;
  notes?: string;
  progressNotes?: string;
  impactScore?: string;
  createdAt?: number;
}

const INITIAL_SEED_FINDINGS: ServerFinding[] = [
  {
    id: 'FND-2026-001',
    factory: 'AOI 1',
    date: '2026-09-15',
    area: 'Cutting - Auto-Spreading Table Line 1',
    finding: 'Kabel instalasi sensor safety light curtain mesin cutting terkelupas dan menjulur keluar tanpa pelindung spiral conduit, berisiko tersangkut trolley bundle kain.',
    category: 'Safety Stop 6',
    pic: 'Suryadi (Cutting Spv) / Rahmat Hidayat',
    department: 'Cutting',
    correctiveAction: 'Penggantian kabel sensor baru, pemasangan protective steel flexible conduit, dan pengikatan rapi dengan cable gland serta pengetesan ulang safety interlock sensor.',
    status: 'Closed',
    closeDate: '2026-09-17',
    targetDate: '2026-09-18',
    attachmentUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    photoCaption: 'Foto Before: Kabel sensor menjulur | Foto After: Terproteksi conduit baja & tested OK',
    priority: 'Critical',
    inspectorName: 'Bpk. Ir. Hendra Gunawan (Plant GM)',
    recordedBy: 'Siti Rahma (CI Officer / Notulen Genba)',
    weekNumber: 37,
    notes: 'Verifikasi fisik dilakukan pada Genba Walk sesi berikutnya. Fungsi interlock berhenti seketika saat terpotong.',
    impactScore: 'Mencegah potensi kecelakaan pinch point dan stop line akibat kabel putus.'
  },
  {
    id: 'FND-2026-002',
    factory: 'AOI 2',
    date: '2026-09-16',
    area: 'Sewing - Main Line 1 (Station 06)',
    finding: 'Penumpukan tool perkakas gunting benang dan obeng berserakan di atas meja kerja mesin jahit tanpa dudukan jelas. Operator harus mencari gunting saat changeover style.',
    category: '5R',
    pic: 'Bambang Sudiro (Sewing Line Leader) / Ratna Kusuma',
    department: 'Sewing',
    correctiveAction: 'Pembuatan custom 5S Visual Shadow Board dari acrylic busa dengan penomoran barcode tool dan penataan spring balancer gantung agar meja jahit 100% bersih.',
    status: 'Closed',
    closeDate: '2026-09-18',
    targetDate: '2026-09-19',
    attachmentUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&auto=format&fit=crop&q=80',
    photoCaption: 'Foto Before: Perkakas tercecer | Foto After: Shadow board 5S & spring balancer terpasang',
    priority: 'Medium',
    inspectorName: 'Fajar Ramadhan (CI Specialist)',
    recordedBy: 'Bayu Nugroho (Sewing Staff / Notetaker)',
    weekNumber: 37,
    notes: 'Mengurangi waktu pencarian tool dari 45 detik menjadi 2 detik saat pergantian varian.',
    impactScore: 'Efisiensi waktu changeover 12% dan eliminasi risiko gunting jatuh ke bahan garmen.'
  },
  {
    id: 'FND-2026-003',
    factory: 'AOI 1',
    date: '2026-09-18',
    area: 'Warehouse - Fabric Roll Storage (Zone B-12)',
    finding: 'Garis demarkasi pemisah jalur pejalan kaki dengan lintasan forklift sudah pudar dan terkelupas parah akibat gesekan roda forklift, membahayakan pejalan kaki di gudang kain.',
    category: 'Material Flow',
    pic: 'Dedi Kurniawan (Warehouse Spv) / Anita Wijaya',
    department: 'Warehouse',
    correctiveAction: 'Pengecatan ulang menggunakan high-durability epoxy safety yellow dengan garis zebra cross, serta pemasangan cermin cembung 360 derajat di blindspot simpang empat.',
    status: 'Closed',
    closeDate: '2026-09-20',
    targetDate: '2026-09-21',
    attachmentUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80',
    photoCaption: 'Foto Before: Garis lintasan hilang | Foto After: Marka epoxy kuning terang & cermin keselamatan',
    priority: 'High',
    inspectorName: 'Bpk. Ir. Hendra Gunawan (Plant GM)',
    recordedBy: 'Tri Wahyuni (Warehouse Staff)',
    weekNumber: 37,
    notes: 'Pekerjaan pengecatan dilakukan malam hari saat warehouse operasional off-peak.',
    impactScore: 'Pemisahan tegas pedestrian vs alat berat, zero near-miss blindspot.'
  },
  {
    id: 'FND-2026-004',
    factory: 'AOI 3',
    date: '2026-09-19',
    area: 'Finish Good - Carton Packing & Sealing',
    finding: 'Penumpukan karton master box ekspor melebihi batas ketinggian garis demarkasi kuning (maks 4 tumpukan), berisiko miring dan menimpa operator packing.',
    category: 'Material Flow',
    pic: 'Rudi Hartono (FG Leader) / Yuliana Dewi',
    department: 'Finish Good',
    correctiveAction: 'Penurunan tumpukan karton ke batas 4 tier dan pembuatan signage visual height limit indikator berwarna merah-kuning-hijau.',
    status: 'In Progress',
    targetDate: '2026-09-24',
    attachmentUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80',
    photoCaption: 'Foto Before: Tumpukan karton melebihi safety height indicator',
    priority: 'Medium',
    inspectorName: 'Bpk. Ir. Hendra Gunawan (Plant GM)',
    recordedBy: 'Agus Pratama (FG Staff)',
    weekNumber: 38,
    notes: 'Material handling guide telah disosialisasikan pada briefing pagi.',
    impactScore: 'Mencegah kerusakan karton produk ekspor dan potensi bahaya tertimpa barang.'
  },
  {
    id: 'FND-2026-005',
    factory: 'DC',
    date: '2026-09-20',
    area: 'Distribusi - Supermarket & Staging Bay',
    finding: 'Penataan hand pallet jack dan trolley transfer tidak pada staging parkir bergaris marka, menghalangi jalur staging flow distribusi komponen garmen.',
    category: '5R',
    pic: 'Wahyu Hidayat (DC Inbound Supervisor) / Triyono',
    department: 'Warehouse',
    correctiveAction: 'Pembuatan marking nomor slot parkir hand pallet (5S Seiton) dengan stop-block karet dan papan visual checklist alat angkut harian.',
    status: 'Closed',
    closeDate: '2026-09-22',
    targetDate: '2026-09-23',
    attachmentUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80',
    photoCaption: 'Foto Before: Hand pallet berserakan di jalur staging | Foto After: Slot parkir 5S rapi & checklist terpasang',
    priority: 'Medium',
    inspectorName: 'Bpk. Ir. Hendra Gunawan (Plant GM)',
    recordedBy: 'Siti Rahma (CI Officer / Notulen Genba)',
    weekNumber: 38,
    notes: 'Area staging DC kini bersih dan mobilitas pengiriman ke lini sewing menjadi lebih lancar.',
    impactScore: 'Eliminasi bottleneck transfer logistik antar gudang dan pabrik hingga 15%.'
  }
];

function resolveStorageFile(): string {
  const candidates = [
    path.resolve(__dirname, '.data'),
    '/tmp/genba-kaizen-data'
  ];
  for (const dir of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      const testFile = path.join(dir, '.write-test');
      fs.writeFileSync(testFile, 'ok');
      fs.unlinkSync(testFile);
      return path.join(dir, 'findings.json');
    } catch {
      // Try next directory
    }
  }
  return path.join('/tmp', 'genba-findings.json');
}

const DATA_FILE = resolveStorageFile();

function readFindingsFromDisk(): ServerFinding[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed reading findings from disk:', err);
  }
  // Initialize with default seed findings
  writeFindingsToDisk(INITIAL_SEED_FINDINGS);
  return [...INITIAL_SEED_FINDINGS];
}

function writeFindingsToDisk(items: ServerFinding[]): void {
  try {
    const tmpFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(items), 'utf-8');
    fs.renameSync(tmpFile, DATA_FILE);
  } catch (err) {
    console.error('Failed writing findings to disk:', err);
  }
}

let findingsStore: ServerFinding[] = readFindingsFromDisk();

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, count: findingsStore.length });
  });

  // Get all findings
  app.get('/api/findings', (_req, res) => {
    res.json({ findings: findingsStore });
  });

  // Create or update a single finding
  app.post('/api/findings', (req, res) => {
    const body = req.body as ServerFinding | undefined;
    if (!body || !body.id || !body.finding) {
      res.status(400).json({ error: 'Invalid finding payload: id and finding are required.' });
      return;
    }

    const item: ServerFinding = {
      ...body,
      hierarchyLevel: 'bi-monthly',
      createdAt: body.createdAt || Date.now()
    };

    const existingIdx = findingsStore.findIndex((f) => f.id === item.id);
    if (existingIdx >= 0) {
      findingsStore[existingIdx] = item;
    } else {
      findingsStore = [item, ...findingsStore];
    }

    writeFindingsToDisk(findingsStore);
    res.json({ finding: item, findings: findingsStore });
  });

  // Batch upsert findings (used by Checksheet bulk save or offline sync)
  app.post('/api/findings/batch', (req, res) => {
    const incoming = req.body?.findings as ServerFinding[] | undefined;
    if (!Array.isArray(incoming)) {
      res.status(400).json({ error: 'Invalid batch payload: findings array is required.' });
      return;
    }

    let savedCount = 0;
    const now = Date.now();

    for (let i = incoming.length - 1; i >= 0; i--) {
      const raw = incoming[i];
      if (!raw || !raw.id || !raw.finding) continue;
      const item: ServerFinding = {
        ...raw,
        hierarchyLevel: 'bi-monthly',
        createdAt: raw.createdAt || now + i
      };
      const existingIdx = findingsStore.findIndex((f) => f.id === item.id);
      if (existingIdx >= 0) {
        findingsStore[existingIdx] = item;
      } else {
        findingsStore = [item, ...findingsStore];
      }
      savedCount++;
    }

    writeFindingsToDisk(findingsStore);
    res.json({ savedCount, findings: findingsStore });
  });

  // Update finding status or fields
  app.patch('/api/findings/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body as Partial<ServerFinding> | undefined;
    if (!updates) {
      res.status(400).json({ error: 'Missing update payload.' });
      return;
    }

    const idx = findingsStore.findIndex((f) => f.id === id);
    if (idx < 0) {
      res.status(404).json({ error: `Finding ${id} not found.` });
      return;
    }

    const updated: ServerFinding = {
      ...findingsStore[idx],
      ...updates,
      id
    };
    findingsStore[idx] = updated;
    writeFindingsToDisk(findingsStore);
    res.json({ finding: updated, findings: findingsStore });
  });

  // Bulk delete findings
  app.post('/api/findings/bulk-delete', (req, res) => {
    const ids = req.body?.ids as string[] | undefined;
    if (!Array.isArray(ids)) {
      res.status(400).json({ error: 'ids array is required.' });
      return;
    }
    const idSet = new Set(ids);
    findingsStore = findingsStore.filter((f) => !idSet.has(f.id));
    writeFindingsToDisk(findingsStore);
    res.json({ findings: findingsStore });
  });

  // Reset findings to initial seed
  app.post('/api/findings/reset', (_req, res) => {
    findingsStore = [...INITIAL_SEED_FINDINGS];
    writeFindingsToDisk(findingsStore);
    res.json({ findings: findingsStore });
  });

  // Delete single finding
  app.delete('/api/findings/:id', (req, res) => {
    const { id } = req.params;
    findingsStore = findingsStore.filter((f) => f.id !== id);
    writeFindingsToDisk(findingsStore);
    res.json({ findings: findingsStore });
  });

  // Clear all findings
  app.delete('/api/findings', (_req, res) => {
    findingsStore = [];
    writeFindingsToDisk(findingsStore);
    res.json({ findings: findingsStore });
  });

  const distPath = path.resolve(__dirname, 'dist');
  const distIndex = path.join(distPath, 'index.html');
  const isProd =
    process.env.NODE_ENV === 'production' ||
    (process.env.npm_lifecycle_event === 'start' && fs.existsSync(distIndex));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(distIndex);
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
