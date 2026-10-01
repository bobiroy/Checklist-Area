import { 
  DepartmentInfo, 
  InspectionFinding, 
  GenbaActivityVisual, 
  FindingCategory,
  GenbaHierarchyTier,
  GenbaWalkthroughSession
} from '../types';

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'wh',
    name: 'Warehouse',
    code: 'WH',
    headName: 'Ibu Anita Wijaya, S.E., M.M.',
    headTitle: 'Head of Warehouse & Inventory Control',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    email: 'anita.wijaya@factory-genba.co.id',
    phone: 'Ext. 2101 / +62 818-0912-3456',
    teamSize: 42,
    color: 'amber',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-700',
    genbaRoleDescription: 'Tata kelola penyimpanan bahan baku kain (fabric roll), aksesoris garmen (trims, zipper, button, benang), sistem FIFO kain, relaksasi kain, dan penataan palet barang jadi ekspor.',
    keyResponsibilities: [
      'Penerapan visual labeling rak racking fabric dan sistem FIFO kain roll',
      'Pemeriksaan kepatuhan suhu & kelembaban ruang simpan kain dan aksesoris',
      'Penataan staging area bongkar muat kontainer dan jalur aman hand pallet/forklift',
      'Penyelesaian temuan deadstock, kerusakan karton, dan kebersihan lantai gudang 5S'
    ],
    inspectionAreas: [
      'Fabric Roll Storage (Gudang Kain)',
      'Trims & Accessories Room (Gudang Aksesoris)',
      'Fabric Relaxing & Inspection Bay',
      'Finished Goods Export Warehouse'
    ],
    raci: {
      responsible: 'Penyusunan tata letak kain, paletisasi aman, dan kebersihan 5S gudang.',
      accountable: 'Akurasi stok bahan baku, sistem FIFO, dan zero kerusakan material.',
      consulted: 'Jadwal kedatangan kain impor dari supplier dan kapasitas staging.',
      informed: 'Kesiapan rilis kain siap potong ke departemen Cutting.'
    }
  },
  {
    id: 'cut',
    name: 'Cutting',
    code: 'CUT',
    headName: 'Bpk. Ir. Rahmat Hidayat, M.T.',
    headTitle: 'Cutting Department Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    email: 'rahmat.hidayat@factory-genba.co.id',
    phone: 'Ext. 2201 / +62 812-3456-7890',
    teamSize: 68,
    color: 'blue',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-700',
    genbaRoleDescription: 'Pengawasan proses gelar kain (spreading), pemotongan kain presisi (auto cutter/laser/straight knife), penomoran nomor lot (numbering), penempelan interlining (fusing), dan bundling komponen.',
    keyResponsibilities: [
      'Memastikan tegangan kain rata (tensionless spreading) saat proses gelar kain',
      'Inspeksi ketajaman mata pisau mesin potong dan keamanan sarung tangan kawat (mesh glove)',
      'Verifikasi suhu, tekanan, dan kecepatan mesin fusing interlining berkala',
      'Kontrol pemilahan sisa perca kain (cutting waste) dan barcode labeling ikatan bundle'
    ],
    inspectionAreas: [
      'Auto-Spreading Table Line 1 - 3',
      'Auto-Cutter & CNC Knife Bay',
      'Continuous Fusing Press Machine Area',
      'Numbering, Ticketing & Bundling Station'
    ],
    raci: {
      responsible: 'Kerapian meja potong, akurasi pola potong, dan K3 operator mesin potong.',
      accountable: 'Ketepatan rasio konsumsi kain (fabric utilization) dan pencegahan cacat potong.',
      consulted: 'Konsultasi pola marker dengan tim Pattern Maker & CAD Engineering.',
      informed: 'Laporan kesiapan bundle potongan kain kepada supervisor Distribusi.'
    }
  },
  {
    id: 'dist',
    name: 'Distribusi',
    code: 'DIST',
    headName: 'Bpk. Dedi Kurniawan, S.T.',
    headTitle: 'Internal Logistics & Distribution Supervisor',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    email: 'dedi.kurniawan@factory-genba.co.id',
    phone: 'Ext. 2301 / +62 811-2345-6781',
    teamSize: 34,
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    genbaRoleDescription: 'Aliran distribusi material potongan kain antar lini, pengelolaan trolley bundle bertingkat, penegakan marka demarkasi lintasan internal, pencegahan mix-up ukuran/warna, dan suplai tepat waktu (JIT feeder) ke Sewing.',
    keyResponsibilities: [
      'Memastikan ketertiban rute lintasan trolley dorong dan keselamatan pejalan kaki',
      'Pencegahan insiden tercecer atau tertukarnya bundle kain antar varian PO',
      'Monitoring buffer transit area dan ketepatan waktu pengiriman bundle ke lini jahit',
      'Pemeriksaan kelayakan roda trolley, handle dorong ergonomis, dan kebersihan keranjang transfer'
    ],
    inspectionAreas: [
      'Bundle Transfer Main Pathway (Koridor Distribusi)',
      'Sewing Input Feeder Staging Area',
      'Transit Holding Zone Antar-Gedung',
      'Trolley & Material Handling Parking Bay'
    ],
    raci: {
      responsible: 'Kelancaran pengangkutan bundle kain, kancing, dan benang ke sewing line.',
      accountable: 'Zero keterlambatan suplai input sewing (zero starvation) dan zero bundle mix-up.',
      consulted: 'Koordinasi urutan prioritas loading style dengan Planner Sewing.',
      informed: 'Status penerimaan bundle kain di lini jahit.'
    }
  },
  {
    id: 'sew',
    name: 'Sewing',
    code: 'SEW',
    headName: 'Ibu Ratna Kusuma, S.T.',
    headTitle: 'Sewing Production Senior Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    email: 'ratna.kusuma@factory-genba.co.id',
    phone: 'Ext. 2401 / +62 813-8899-1122',
    teamSize: 210,
    color: 'purple',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-700',
    genbaRoleDescription: 'Operasional lini penjahitan garmen (assembly sewing lines), kepatuhan SOP jahit, penegakan kebijakan patah jarum (Broken Needle Policy), kerapian meja kerja 5S operator, penataan kabel dinamo motor, dan ergonomi kursi kerja.',
    keyResponsibilities: [
      'Penerapan ketat Broken Needle Policy: pencatatan logbook & penukaran patahan jarum 100%',
      'Penataan wadah benang (thread stand), gunting perca gantung, dan kotak sisa potongan',
      'Pemeriksaan pelindung mata (eye guard) dan penutup puli dinamo (pulley cover) mesin jahit',
      'Pengawasan kebersihan mesin jahit dari debu serat kain dan tetesan oli pelumas'
    ],
    inspectionAreas: [
      'Main Sewing Line 1 - 4 (Kemeja & Celana)',
      'Main Sewing Line 5 - 8 (Jacket & Sportswear)',
      'Needle Replacement & Logbook Station',
      'In-line Sewing Quality Checkpoint'
    ],
    raci: {
      responsible: 'Pencegahan cacat jahitan (jahitan loncat, kerut, benang putus) dan 5S lini.',
      accountable: 'Pencapaian target output efisiensi lini jahit dan zero kontaminasi jarum patah.',
      consulted: 'Konsultasi setting tarikan benang dan attachment jahit bersama mekanik.',
      informed: 'Status output harian kepada tim Finishing Packing.'
    }
  },
  {
    id: 'fp',
    name: 'Finishing Packing',
    code: 'FP',
    headName: 'Bpk. Agus Prasetyo, S.T.',
    headTitle: 'Head of Finishing & Packaging Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
    email: 'agus.prasetyo@factory-genba.co.id',
    phone: 'Ext. 2501 / +62 815-9988-7766',
    teamSize: 85,
    color: 'rose',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    genbaRoleDescription: 'Tahap akhir penyelesaian garmen: pembersihan sisa benang (thread trimming), setrika uap (steam press/ironing), deteksi logam (metal detector inspection), pelipatan (folding), pemasangan hangtag barcode, dan kartonasi siap ekspor.',
    keyResponsibilities: [
      'Kalibrasi harian dan uji sensitivitas terowongan Metal Detector (uji bola besi 1.0mm/1.2mm)',
      'Inspeksi keselamatan pipa steam boiler uap panas dan selang setrika industri',
      'Pemeriksaan meja folding & tagging bebas dari noda oli, debu, atau jarum pentul',
      'Standar penutupan dan pengeleman karton master box sesuai spesifikasi buyer ekspor'
    ],
    inspectionAreas: [
      'Thread Trimming & Suction Table Area',
      'Steam Press & Boiler Ironing Station',
      'Calibrated Metal Detector Tunnel Bay',
      'Master Carton Packing & Sealing Station'
    ],
    raci: {
      responsible: 'Kualitas tampilan fisik garmen akhir (rapi, licin, bersih) dan packing karton.',
      accountable: '100% garmen lolos detektor logam (zero metal contamination) dan siap kirim.',
      consulted: 'Spesifikasi ukuran karton box dan barcode label bersama buyer QC.',
      informed: 'Notifikasi kesiapan barang jadi ke Warehouse Finished Goods.'
    }
  }
];

export const PLANT_MANAGER_PROFILE = {
  name: 'Bpk. Ir. Hendra Gunawan, IPM',
  title: 'Plant General Manager & Operational Director',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
  quote: '"Genba Walk bukan untuk mencari kesalahan karyawan, melainkan pergi langsung ke tempat kerja (Genba), melihat kenyataan fisik (Genbutsu), dan bersama-sama menemukan solusi nyata (Genjitsu) untuk keselamatan dan efisiensi pabrik."',
  phone: 'Ext. 2001',
  email: 'hendra.gunawan@factory-genba.co.id',
  inspectionFrequency: 'Setiap Hari Selasa & Kamis Pukul 09.00 - 11.00 WIB'
};

export const INITIAL_FINDINGS: InspectionFinding[] = [
  {
    id: 'FND-2026-001',
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
    date: '2026-09-21',
    area: 'Cutting - CNC Knife Bay #03',
    finding: 'Ditemukan rembesan oli pelumas menetes di lantai bawah mesin potong otomatis CNC #03, berpotensi memicu bahaya terpeleset dan risiko mengotori kain tumpukan gelar.',
    category: 'Waste & Elimination',
    pic: 'Hendra Saputra (Cutting Tech) / Rahmat Hidayat',
    department: 'Cutting',
    correctiveAction: 'Penggantian O-ring seal flange pompa hidrolik, penambahan oil drip tray stainless steel, dan pembersihan lantai menggunakan absorbent pad degreaser.',
    status: 'In Progress',
    closeDate: undefined,
    targetDate: '2026-09-23',
    attachmentUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: undefined,
    photoCaption: 'Foto Before: Tetesan oli di lantai plat bordes bawah mesin potong',
    priority: 'High',
    inspectorName: 'Bpk. Ir. Hendra Gunawan (Plant GM)',
    recordedBy: 'Siti Rahma (CI Officer / Notulen Genba)',
    weekNumber: 38,
    notes: 'Spare part seal kit sudah diambil dari store. Pemasangan dijadwalkan saat break shift 2 malam ini.',
    impactScore: 'Pencegahan noda oli pada kain dan eliminasi bahaya slip & fall operator.'
  },
  {
    id: 'FND-2026-005',
    date: '2026-09-21',
    area: 'Finishing Packing - Metal Detector Tunnel & Final Gate',
    finding: 'Lampu penerangan pada meja inspeksi akhir garmen sebelum metal detector hanya 420 Lux (standar minimal 1000 Lux), menyebabkan blind spot pada serat benang sisa.',
    category: 'Quality',
    pic: 'Iwan Setiawan (FP Tech) / Agus Prasetyo',
    department: 'Finishing Packing',
    correctiveAction: 'Instalasi 4 unit LED daylight 6500K dengan diffuser anti-glare untuk mencapai intensitas pencahayaan 1250 Lux merata di meja folding dan tunnel detektor.',
    status: 'In Progress',
    closeDate: undefined,
    targetDate: '2026-09-24',
    attachmentUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: undefined,
    photoCaption: 'Foto Before: Meja inspeksi finishing gelap berbayang (420 Lux)',
    priority: 'High',
    inspectorName: 'Ratna Kusuma (QA Head)',
    recordedBy: 'Budi Santoso (FP Inspector)',
    weekNumber: 38,
    notes: 'Lampu LED khusus sudah tiba, teknisi maintenance dan FP akan menguji keseragaman lux besok pagi.',
    impactScore: 'Pencegahan reject benang lolos ke buyer ekspor (Zero defect escape guarantee).'
  },
  {
    id: 'FND-2026-006',
    date: '2026-09-21',
    area: 'Distribusi - Sewing Input Feeder Bay',
    finding: 'Operator transfer bundle harus membungkuk 65 derajat dan memutar tubuh saat mengambil bundle kain berat dari keranjang lantai berulang kali (Ergonomic Hazard).',
    category: 'Waste & Elimination',
    pic: 'Teguh Wibowo (Distribusi Leader) / Dedi Kurniawan',
    department: 'Distribusi',
    correctiveAction: 'Rancang bangun meja trolley pegas berputar (Scissor Lift Tilter Trolley) beroda dengan ketinggian pas di pinggang operator (ergonomic golden zone).',
    status: 'Open',
    closeDate: undefined,
    targetDate: '2026-09-25',
    attachmentUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: undefined,
    photoCaption: 'Foto Before: Postur membungkuk berulang mengangkat bundle kain dari lantai',
    priority: 'Medium',
    inspectorName: 'Bpk. Ir. Hendra Gunawan (Plant GM)',
    recordedBy: 'Bayu Nugroho (Distribusi Staff / Notetaker)',
    weekNumber: 38,
    notes: 'Desain lift table sudah disetujui CI Dojo. Perakitan dilakukan di workshop internal.',
    impactScore: 'Mengurangi keluhan sakit punggung operator transfer (RULA Score turun dari 7 ke 2).'
  },
  {
    id: 'FND-2026-007',
    date: '2026-09-20',
    area: 'Warehouse - Finished Goods Export Bay',
    finding: 'Satu unit tabung APAR powder 6kg di samping pintu loading dock nomor 2 jarum tekanannya berada di zona merah (kurang tekanan) dan kartu inspeksi belum diparaf.',
    category: 'Safety Stop 6',
    pic: 'Wahyudi (Safety Inspector) / Anita Wijaya',
    department: 'Warehouse',
    correctiveAction: 'Penukaran langsung dengan unit APAR cadangan tersertifikasi, pengisian ulang gas nitrogen tabung lama ke vendor, dan revisi checklist QR code inspeksi digital.',
    status: 'Closed',
    closeDate: '2026-09-21',
    targetDate: '2026-09-21',
    attachmentUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    photoCaption: 'Foto Before: APAR pressure low | Foto After: Unit baru terpasang di hanger dengan QR tag',
    priority: 'Critical',
    inspectorName: 'Bpk. Ir. Hendra Gunawan (Plant GM)',
    recordedBy: 'Tri Wahyuni (Warehouse Staff)',
    weekNumber: 38,
    notes: 'Tindakan selesai dalam 4 jam sesuai SOP darurat bahaya kebakaran gudang garmen ekspor.',
    impactScore: 'Kesiapan 100% sistem proteksi kebakaran darurat gedung gudang bahan garmen.'
  },
  {
    id: 'FND-2026-008',
    date: '2026-09-19',
    area: 'Distribusi - Main Transit Corridor & Route',
    finding: 'Palet trolley transfer rusak dengan roda macet dan paku mencuat dibiarkan teronggok di jalur lintasan lorong utama antar gedung tanpa label afkir.',
    category: '5R',
    pic: 'Joko Susilo (Distribusi Leader) / Dedi Kurniawan',
    department: 'Distribusi',
    correctiveAction: 'Evakuasi trolley afkir ke bengkel maintenance, pemasangan papan penandaan khusus "Trolley Quarantine", dan pengadaan roda PU anti-macet baru.',
    status: 'Closed',
    closeDate: '2026-09-20',
    targetDate: '2026-09-20',
    attachmentUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80',
    photoCaption: 'Foto Before: Roda trolley rusak | Foto After: Jalur transit bersih dan steril dari hambatan',
    priority: 'Medium',
    inspectorName: 'Rahmat Hidayat (Cutting Mgr)',
    recordedBy: 'Andi Saputra (Distribusi Controller)',
    weekNumber: 38,
    notes: 'Diverifikasi langsung oleh tim safety dan supervisor distribusi.',
    impactScore: 'Eliminasi risiko bundle kain robek tersangkut roda dan kelancaran alur transit 100%.'
  },
  {
    id: 'FND-2026-009',
    date: '2026-09-21',
    area: 'Sewing - Main Line 5 (Brand Dedicated Line)',
    finding: 'Penumpukan keranjang WIP potongan kain di ujung lini jahit menghambat alur lintasan ke area finishing tanpa tanda kanban buffer FIFO.',
    category: 'Material Flow',
    pic: 'Bambang Tri (Sewing Line Leader) / Ratna Kusuma',
    department: 'Sewing',
    correctiveAction: 'Pemasangan floor line demarcation satu arah (One-way flow) dan penyediaan buffer staging rack bertingkat sistem FIFO gravitasi.',
    status: 'Pending Verification',
    closeDate: undefined,
    targetDate: '2026-09-24',
    attachmentUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    photoCaption: 'Foto Before: Box WIP memblokir lorong jahit | Foto After: Jalur transit FIFO rapi teratur',
    priority: 'High',
    inspectorName: 'Bpk. Ir. Hendra Gunawan (Plant GM)',
    recordedBy: 'Siti Rahma (CI Officer / Notulen Genba)',
    weekNumber: 38,
    notes: 'Pekerjaan fisik selesai, menunggu pengetesan alur kerja shift pagi sebelum status diubah ke Closed.',
    impactScore: 'Kelancaran lead time transfer garmen setengah jadi ke finishing meningkat 25%.'
  },
  {
    id: 'FND-2026-010',
    date: '2026-09-14',
    area: 'Finishing Packing - Steam Press & Ironing Station',
    finding: 'Kabel instalasi pembumian (grounding) meja setrika uap industri kendor baut dudukannya, menyebabkan fluktuasi pemanas dan getaran pada selang uap berlebih.',
    category: 'Quality',
    pic: 'Arif Setiawan (Finishing Spv) / Agus Prasetyo',
    department: 'Finishing Packing',
    correctiveAction: 'Pembersihan permukaan kontak grounding tembaga dari kerak oksidasi, pengencangan baut torsi 45 Nm dengan spring washer, dan penandaan cat garis torsi kuning (Torque seal).',
    status: 'Closed',
    closeDate: '2026-09-15',
    targetDate: '2026-09-16',
    attachmentUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    attachmentAfterUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    photoCaption: 'Foto Before: Grounding berkarat goyang | Foto After: Tembaga bersih & torque seal kuning',
    priority: 'High',
    inspectorName: 'Ratna Kusuma (QA Head)',
    recordedBy: 'Budi Santoso (FP Inspector)',
    weekNumber: 37,
    notes: 'Suhu steam press terkalibrasi stabil kembali pada 160 derajat Celcius.',
    impactScore: 'Menghindari risiko kain mengkilap (shine defect) dan kebocoran arus listrik.'
  }
];

export const GENBA_VISUAL_ACTIVITIES: GenbaActivityVisual[] = [
  {
    id: 'ACT-01',
    title: 'Kaizen 5S Visual Shadow Board Meja Kerja Sewing',
    date: '18 September 2026',
    area: 'Sewing - Main Line 1 (Station 06)',
    department: 'Sewing',
    category: '5R',
    beforePhoto: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&auto=format&fit=crop&q=80',
    problemDescription: 'Alat kerja gunting dan obeng berserakan di atas meja, sering hilang, dan waktu mencari alat memakan waktu 45 detik saat ganti model jahit.',
    solutionDescription: 'Memasang papan visual bayangan (shadow board) berkode warna dan suspension balancer tepat di jangkauan tangan operator.',
    impactSummary: 'Waktu changeover berkurang 12%, meja kerja 100% steril dari ceceran benda tajam, dan kepatuhan 5S naik ke level bintang 5.',
    leaderName: 'Bpk. Ir. Hendra Gunawan (Plant GM)',
    pic: 'Suryadi (Sewing Leader)'
  },
  {
    id: 'ACT-02',
    title: 'Pencegahan Bahaya Kabel Terkelupas & Steel Conduit Meja Potong',
    date: '17 September 2026',
    area: 'Cutting - Auto-Spreading Table Line 1',
    department: 'Cutting',
    category: 'Safety Stop 6',
    beforePhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    problemDescription: 'Kabel sensor keselamatan tirai cahaya (optical sensor) mesin potong terpuntir dan telanjang tanpa pelindung, sangat rawan terjepit rel mesin.',
    solutionDescription: 'Mengganti kabel sensor tahan oli, membungkusnya dengan pipa flexible baja tahan karat, dan melengkapi terminal penahan getaran.',
    impactSummary: 'Eliminasi total potensi kecelakaan fatal tangan terjepit mesin dan mencegah downtime jalur cutting bernilai tinggi.',
    leaderName: 'Bpk. Rahmat Hidayat (Cutting Mgr)',
    pic: 'Hendra Saputra (Tech)'
  },
  {
    id: 'ACT-03',
    title: 'Epoxy Demarcation & Jalur Keselamatan Gudang Kain Forklift',
    date: '20 September 2026',
    area: 'Warehouse - Fabric Roll Storage (Zone B-12)',
    department: 'Warehouse',
    category: 'Material Flow',
    beforePhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80',
    problemDescription: 'Cat garis lantai jalur forklift gudang kain telah pudar total. Pejalan kaki kerap melintas di rute manuver alat angkut.',
    solutionDescription: 'Mengecat ulang lantai dengan cat epoxy reflective yellow 200 mikron, zebra cross pedestrian, dan cermin pantul sudut 360 derajat.',
    impactSummary: 'Zero insiden benturan material, tertib lalu lintas gudang 100%, dan jalur evakuasi darurat terlihat sangat jelas.',
    leaderName: 'Ibu Anita Wijaya (WH Mgr)',
    pic: 'Dedi Kurniawan'
  },
  {
    id: 'ACT-04',
    title: 'Poka-Yoke Kalibrasi Grounding & Sensor Meja Finishing Packing',
    date: '15 September 2026',
    area: 'Finishing Packing - Steam Press Station',
    department: 'Finishing Packing',
    category: 'Quality',
    beforePhoto: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    afterPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    problemDescription: 'Koneksi grounding meja steam kendor menyebabkan suhu plat setrika berfluktuasi dan memicu cacat kain mengkilap.',
    solutionDescription: 'Pembersihan plat tembaga, pemasangan ring pegas baru, pengetatan torsi 45 Nm dan visual torque seal kuning untuk kontrol inspeksi mata.',
    impactSummary: 'Reject cacat garmen berkurang drastis, menghemat rework dan menjaga kestabilan kualitas ekspor.',
    leaderName: 'Bpk. Agus Prasetyo (FP Head)',
    pic: 'Arif Setiawan'
  }
];

export const SAMPLE_PHOTO_PRESETS = [
  {
    label: 'Kabel & Elektrikal (Safety/TPM)',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'Meja Kerja & 5S Tools',
    url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'Gudang & Jalur Forklift',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'Mesin Industri & Hidrolik',
    url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'Inspeksi Kualitas & Lampu Lab',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'Perbaikan Terpasang Rapi (After)',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: '5S Organiser Selesai (After)',
    url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&auto=format&fit=crop&q=80'
  },
  {
    label: 'Lantai Bersih Marka Jelas (After)',
    url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80'
  }
];

export const FACTORY_AREAS = [
  'Warehouse - Fabric Roll Storage (Gudang Kain)',
  'Warehouse - Trims & Accessories Room',
  'Warehouse - Finished Goods Export Bay',
  'Cutting - Spreading Table Line 1 - 3',
  'Cutting - Auto-Cutter & CNC Knife Station',
  'Cutting - Fusing Press & Bundling Area',
  'Distribusi - Main Transit Corridor & Route',
  'Distribusi - Sewing Input Feeder Bay',
  'Sewing - Main Line 1 - 4 (Assembly)',
  'Sewing - Main Line 5 - 8 (Brand Dedicated)',
  'Sewing - Needle Replacement Station',
  'Finishing Packing - Thread Trimming & Suction Table',
  'Finishing Packing - Steam Press & Ironing Station',
  'Finishing Packing - Metal Detector Tunnel',
  'Finishing Packing - Master Carton Packing Bay'
];

export const FINDING_CATEGORIES: FindingCategory[] = [
  '5R',
  'Safety Stop 6',
  'Waste & Elimination',
  'Quality',
  'Material Flow'
];

export const GENBA_HIERARCHY_TIERS: GenbaHierarchyTier[] = [
  {
    id: 'bi-weekly',
    levelNumber: 1,
    name: 'BI WEEKLY',
    subtitle: 'Genba with Adidas',
    description: 'Inspeksi tingkat tertinggi bersama perwakilan & auditor brand Adidas dua minggu sekali. Memastikan kepatuhan standar global kualitas garmen, etika ketenagakerjaan, keselamatan kerja (EHS), dan keberlanjutan proses produksi ekspor.',
    frequency: 'Bi-Weekly (Setiap 2 Minggu Sekali)',
    frequencyCode: 'Bi-Weekly',
    participants: 'Adidas Brand Representative, Country Quality Auditor, Plant General Manager, Head of QA, EHS Lead',
    leadRole: 'Plant General Manager & Adidas Brand Quality Lead',
    targetArea: 'Dedicated Adidas Sewing Lines, Final QC Gate, Packaging, Chemical Storage, Finished Goods Warehouse',
    iconType: 'calendar',
    colors: {
      gradient: 'from-amber-500 via-amber-400 to-yellow-500',
      border: 'border-amber-400',
      text: 'text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      accent: '#f59e0b',
      pyramidBg: 'bg-gradient-to-b from-amber-300 to-amber-500',
      pyramidHover: 'hover:from-amber-200 hover:to-amber-400'
    },
    objectives: [
      'Verifikasi kepatuhan standar teknis kualitas jahitan & material apparel Adidas (A-01 Standard)',
      'Audit kepatuhan etika keselamatan kerja & lingkungan (EHS Brand Compliance)',
      'Evaluasi ketertelusuran nomor lot material, barcode scan, dan kalibrasi needle detector',
      'Review continuous improvement (CI Kaizen) pada lini berdedikasi Adidas'
    ],
    standardChecklist: [
      'Kalibrasi & log 9-point needle detector (deteksi jarum patah) 100% tervalidasi',
      'Kerapian dan pelabelan lot potong bahan (fabric batch matching & shading)',
      'Standar pencahayaan inspection table (minimal 1000 - 1200 Lux)',
      'Poka-yoke tension benang & penguncian jahitan (sewing seam strength & density)',
      'B3 & Chemical compliance (MSDS terpasang, spill kit siap pakai di area cetak/sablon)'
    ],
    kpiTarget: 'Audit Score ≥ 95%, Zero High Risk Non-Compliance, 100% On-Time Shipment',
    picLeader: 'Ir. Hendra Gunawan (Plant GM) & Adidas QA Lead'
  },
  {
    id: 'bod-genba',
    levelNumber: 2,
    name: 'BoD GENBA',
    subtitle: 'Genba with Board Of Directors',
    description: 'Walkthrough berkala tingkat eksekutif bersama jajaran Direksi (Board of Directors) untuk mengevaluasi kesehatan menyeluruh operasional pabrik, menyelaraskan strategi bisnis, serta mempercepat keputusan persetujuan investasi modal (CAPEX) bagi fasilitas lini.',
    frequency: 'Monthly (Bulanan / Agenda Resmi Direksi)',
    frequencyCode: 'Monthly',
    participants: 'President Director, Managing Director, Operational Director, General Managers, Senior Division Heads',
    leadRole: 'Board of Directors & Operational Director',
    targetArea: 'Seluruh Lini Pabrik (Stamping, Machining, Sewing, Assembly, Otomasi Baru & Utilitas Pembangkit)',
    iconType: 'users',
    colors: {
      gradient: 'from-blue-600 via-blue-700 to-indigo-800',
      border: 'border-blue-500',
      text: 'text-blue-900',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      accent: '#2563eb',
      pyramidBg: 'bg-gradient-to-b from-blue-500 to-blue-700',
      pyramidHover: 'hover:from-blue-400 hover:to-blue-600'
    },
    objectives: [
      'Meninjau langsung kondisi nyata di lini produksi tanpa laporan perantara (Genchi Genbutsu)',
      'Pengambilan keputusan cepat (Quick Decision) untuk kendala fasilitas berskala CAPEX tinggi',
      'Menegakkan komitmen Zero Accident keselamatan kerja dari jajaran pimpinan tertinggi',
      'Memberikan apresiasi langsung kepada operator lini yang menghasilkan Kaizen terbaik'
    ],
    standardChecklist: [
      'Ketercapaian OEE lini utama dan evaluasi bottleneck kapasitas pabrik bulanan',
      'Kelayakan dan modernisasi mesin otomatisasi (Industry 4.0 IoT sensors)',
      'Standar keselamatan kerja makro (sistem hidran, APAR, ventilasi, dan jalur evakuasi darurat)',
      'Kerapian tata letak layout pabrik dan kenyamanan lingkungan kerja shopfloor'
    ],
    kpiTarget: 'Approval Solusi Strategis < 48 Jam, Zero Fatal Accident, Produktivitas Pabrik +5%',
    picLeader: 'Board of Directors & Bpk. Ir. Hendra Gunawan'
  },
  {
    id: 'cross-check',
    levelNumber: 3,
    name: 'CROSS CHECK GENBA MANAGEMENT',
    subtitle: 'Monthly Genba internal Operation Excellence',
    description: 'Audit silang antar-departemen (Cross-functional Genba) setiap bulan untuk mendorong Operation Excellence. Departemen satu menginspeksi departemen lain secara objektif dan independen untuk menghilangkan blind-spot ketidaksesuaian.',
    frequency: 'Monthly (Pekan ke-4 Setiap Bulan)',
    frequencyCode: 'Monthly Internal',
    participants: 'Cross-Department Managers (PROD, QA, MAINT, EHS, PPIC, CI) & Komite Kaizen Pabrik',
    leadRole: 'Head of Continuous Improvement & Lead Auditor Silang',
    targetArea: 'Area Antar-Lini, Batas Departemen, Gudang B3, Die & Mold Storage, Maintenance Workshop, Jalur Forklift',
    iconType: 'clipboard',
    colors: {
      gradient: 'from-amber-600 via-orange-600 to-orange-700',
      border: 'border-orange-500',
      text: 'text-orange-900',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      accent: '#ea580c',
      pyramidBg: 'bg-gradient-to-b from-amber-600 to-orange-600',
      pyramidHover: 'hover:from-amber-500 hover:to-orange-500'
    },
    objectives: [
      'Menghilangkan kebiasaan "terbiasa melihat kotor/rusak" melalui sudut pandang auditor luar departemen',
      'Skoring audit 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke) yang transparan dan kompetitif',
      'Benchmarking dan transfer ilmu best-practice perbaikan dari lini teladan ke lini lain',
      'Verifikasi efektivitas penutupan temuan bulan lalu agar masalah tidak timbul kembali'
    ],
    standardChecklist: [
      'Penerapan 5S: Kerapian meja kerja, visual shadow board, dan ketiadaan barang tak perlu (Red Tag)',
      'Standar visual demarcation (garis kuning epoxy jalur lalu lintas pejalan kaki vs forklift)',
      'Verifikasi integritas Poka-Yoke dan kelengkapan lembar instruksi kerja (IK/SOP)',
      'Disiplin penanganan limbah B3 dan pemilahan sampah anorganik di sumber'
    ],
    kpiTarget: 'Skor Rata-rata 5S Pabrik ≥ 90%, Replikasi Minimal 3 Kaizen Sukses per Bulan',
    picLeader: 'Bpk. Fajar Ramadhan (CI/Lean Lead) & Tim Auditor Silang'
  },
  {
    id: 'daily-genba',
    levelNumber: 4,
    name: 'DAILY GENBA (SHOPFLOOR MANAGEMENT)',
    subtitle: 'GL & Supervisor Genba everyday on site',
    description: 'Pilar fondasi manajemen lantai produksi harian (Shopfloor Management). Group Leader (GL) dan Supervisor melakukan walkthrough intensif setiap pergantian shift untuk mengawal 4M (Man, Machine, Material, Method) secara langsung di garis depan.',
    frequency: 'Daily (Setiap Hari - Shift 1 & Shift 2)',
    frequencyCode: 'Daily',
    participants: 'Group Leaders (GL), Shift Supervisors, Line QC Inspector, Teknisi Maintenance On-Duty, Leader Operator',
    leadRole: 'Production Group Leader & Area Shift Supervisor',
    targetArea: 'Meja Kerja Operator, Cell Jahit/Assembly, In-Line Inspection, Buffer WIP, Jalur Pasokan Trolley',
    iconType: 'hard-hat',
    colors: {
      gradient: 'from-emerald-600 via-teal-700 to-teal-800',
      border: 'border-teal-500',
      text: 'text-teal-900',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
      accent: '#0f766e',
      pyramidBg: 'bg-gradient-to-b from-emerald-500 to-teal-700',
      pyramidHover: 'hover:from-emerald-400 hover:to-teal-600'
    },
    objectives: [
      'Mendeteksi dan menyelesaikan kendala mikro operator sebelum berkembang menjadi bottleneck',
      'Menjamin disiplin penggunaan APD dan postur kerja ergonomis seluruh operator',
      'Mencegah penumpukan barang setengah jadi (WIP) di lorong kerja operator',
      'Eksekusi Quick Kaizen langsung di hari yang sama untuk masalah sederhana'
    ],
    standardChecklist: [
      'Disiplin APD operator (masker, earplug, sarung tangan pelindung, sepatu safety)',
      'Kondisi fisik mesin: bebas rembesan oli, getaran normal, tombol Emergency Stop berfungsi',
      'Toleransi ukuran dan kualitas jahitan pertama (First Piece Inspection sign-off)',
      'Kerapian alat bantu kerja (gunting garmen, obeng, penggaris pada holder yang ditentukan)',
      'Target jam-jaman produksi (Hourly Tracking Board) terpantau tepat waktu'
    ],
    kpiTarget: 'Penyelesaian Temuan Harian 100% dalam 24 Jam, In-Line Defect Rate < 0.8%',
    picLeader: 'Seluruh Group Leader (GL) & Supervisor Shift'
  }
];

export const INITIAL_WALKTHROUGH_SESSIONS: GenbaWalkthroughSession[] = [
  {
    id: 'SES-2026-0901',
    hierarchyLevel: 'bi-weekly',
    date: '2026-09-24',
    time: '09:00 - 12:30 WIB',
    shift: 'General Office',
    area: 'Dedicated Sewing Line 1 - 3 & Final Packaging QA',
    leader: 'Ir. Hendra Gunawan & Adidas Brand Auditor (Mr. Michael Chen)',
    participants: 'Adidas QA Lead, Country Compliance Manager, Plant GM, Head of QA, EHS Lead',
    focusTheme: 'Verifikasi Kesiapan Audit Sertifikasi QMS Adidas & Metal Detection Calibration',
    status: 'Scheduled',
    totalFindingsCount: 3,
    notes: 'Prioritas pada pengecekan log 9-point needle detector dan ketiadaan pin/jarum di area kerja operator.'
  },
  {
    id: 'SES-2026-0902',
    hierarchyLevel: 'bod-genba',
    date: '2026-09-22',
    time: '14:00 - 16:30 WIB',
    shift: 'General Office',
    area: 'Main Assembly Line & Otomasi CNC Machining',
    leader: 'Board of Directors (Bpk. Ir. Hendra Gunawan & Direksi Operasional)',
    participants: 'President Director, Managing Director, Head of Manufacturing, Senior Division Heads',
    focusTheme: 'Tinjauan CAPEX Upgrade Sistem Exhaust Ventilasi & Otomasi Konveyor Robotik',
    status: 'In Progress',
    totalFindingsCount: 2,
    notes: 'Persetujuan langsung anggaran modifikasi sistem pendingin udara lini jahit untuk kenyamanan operator.'
  },
  {
    id: 'SES-2026-0903',
    hierarchyLevel: 'cross-check',
    date: '2026-09-18',
    time: '10:00 - 12:00 WIB',
    shift: 'Shift 1',
    area: 'Tooling & Die Storage Room & Stamping Press Bay',
    leader: 'Fajar Ramadhan, S.T. (CI & Lean Lead) & Tim Auditor Silang QA',
    participants: 'QA Manager, Maintenance Lead, Production Supervisor, EHS Officer',
    focusTheme: 'Audit Silang Standar 5S & Poka-Yoke Proteksi Sensor Cetakan Die',
    status: 'Completed',
    totalFindingsCount: 4,
    notes: 'Temuan penataan kabel sensor hidrolik dan demarkasi area pallet telah ditutup dengan verifikasi foto.'
  },
  {
    id: 'SES-2026-0904',
    hierarchyLevel: 'daily-genba',
    date: '2026-09-22',
    time: '07:30 - 08:30 WIB',
    shift: 'Shift 1',
    area: 'Shopfloor Sewing Cell A & B - In Line Inspection',
    leader: 'GL Produksi Bpk. Joko Santoso & Supervisor Shift',
    participants: 'Group Leader (GL), Line Supervisor, Line QC, Teknisi Maintenance On-Duty',
    focusTheme: 'Shopfloor Routine Check: APD Operator, Kerapian Meja Jahit & First Piece Inspection',
    status: 'Completed',
    totalFindingsCount: 3,
    notes: 'Pembersihan serat benang di motor penggerak mesin jahit langsung dilakukan dalam 30 menit.'
  }
];

