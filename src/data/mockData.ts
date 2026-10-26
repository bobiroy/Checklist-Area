import { 
  DepartmentInfo, 
  InspectionFinding, 
  GenbaActivityVisual, 
  FindingCategory,
  GenbaHierarchyTier,
  GenbaWalkthroughSession,
  BiMonthlyAssessor,
  UserAccount
} from '../types';

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'ppa',
    name: 'PPA',
    code: 'PPA',
    headName: 'Bpk. Hendri Gunawan, S.T.',
    headTitle: 'Head of Pre-Production & Automation (PPA)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    email: 'hendri.gunawan@factory-genba.co.id',
    phone: 'Ext. 2150 / +62 812-9876-5432',
    teamSize: 28,
    color: 'indigo',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-700',
    genbaRoleDescription: 'Pengawasan area persiapan pra-produksi dan otomasi (PPA Auto & Manual): sistem auto-spreading kain, digital nesting CAD, mesin pemotong otomatis (auto cutter), dan integrasi otomatisasi lini produksi.',
    keyResponsibilities: [
      'Kalibrasi akurasi sensor optik dan pisau putar mesin auto-cutter',
      'Pengecekan sistem vacuum table auto-spreading dan keselamatan tombol emergency stop',
      'Pemantauan utilisasi mesin otomatis dan efisiensi konsumsi energi listrik',
      'Penerapan 5S dan K3 pada area mekanikal presisi dan panel kontrol PLC otomasi'
    ],
    inspectionAreas: [
      'PPA Auto & Manual Line',
      'Auto-Spreading Vacuum Table Bay',
      'CAD Nesting & Digital Pattern Station',
      'Automation PLC Control & Server Rack Area'
    ],
    raci: {
      responsible: 'Keandalan mesin otomasi pemotongan dan keselamatan operator PPA.',
      accountable: 'Akurasi presisi potong digital dan kesiapan feeder panel ke sewing.',
      consulted: 'Sinkronisasi software pola CAD dengan technical engineering Adidas.',
      informed: 'Status kesiapan operasional mesin otomasi harian ke tim Cutting.'
    }
  },
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
    id: 'bi-monthly',
    levelNumber: 1,
    name: 'BI MONTHLY',
    subtitle: 'Genba with Adidas',
    description: 'Inspeksi tingkat tertinggi bersama perwakilan & auditor brand Adidas setiap dua bulan sekali (Bi-Monthly). Memastikan kepatuhan standar global kualitas garmen, etika ketenagakerjaan, keselamatan kerja (EHS), dan keberlanjutan proses produksi ekspor.',
    frequency: 'Bi-Monthly (Setiap 2 Bulan Sekali)',
    frequencyCode: 'Bi-Monthly',
    participants: '1. Adidas Representative, 2. AOI Team Representative',
    leadRole: 'Plant General Manager & Adidas Brand Quality Lead',
    targetArea: '1. Warehouse, 2. Cutting, 3. Distribusi, 4. Sewing, 5. Warehouse Finish Good',
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
      'Melakukan Inspeksi di diarea produksi untuk melihat kondisi dilapangan secara langsung',
      'Mencatat seluruh hasil temuan agar terdata dan terstruktur',
      'Evaluasi temuan akan 5R dan Melakukan perbaikan atas hasil temuan dengan menelusuri latar belakang temuan dan cara penyelesaian',
      'Review dan melanjutkan Continuous Improvement pada seluruh area'
    ],
    standardChecklist: [
      'Potensi Safety STOP 6 mulai dari Apparatus, Big, Car, Drop, Electricity, Fire',
      'Framework 6S yaitu Sort,Set in order, Shine, Standarize, Sustain, Safety',
      'Potensi temuan ergonomy diarea kerja'
    ],
    kpiTarget: 'Closing all finding with PICA and maintaining 6S + Safety',
    picLeader: 'Operation Excellence'
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
    hierarchyLevel: 'bi-monthly',
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
    id: 'SES-2026-0701',
    hierarchyLevel: 'bi-monthly',
    date: '2026-07-28',
    time: '08:30 - 12:00 WIB',
    shift: 'General Office',
    area: 'Cutting & Pre-Assembly Zone, Chemical Storage EHS',
    leader: 'Ir. Hendra Gunawan & Auditor Regional Adidas',
    participants: 'Plant Manager, EHS Manager, Head of Production, Quality Assurance Lead',
    focusTheme: 'Tinjauan Kepatuhan Lingkungan EHS & Kalibrasi Alat Pemotong Presisi Ekspor',
    status: 'Completed',
    totalFindingsCount: 5,
    notes: 'Seluruh temuan perbaikan ventilasi dan APD kimiawi telah diverifikasi dan dinyatakan Closed.'
  }
];

export const BI_MONTHLY_ASSESSORS: BiMonthlyAssessor[] = [
  // --- GROUP 1: FACILITATOR ---
  {
    id: 'ASR-F01',
    group: 'Facilitator',
    name: 'Mr. Michael Chen',
    title: 'Country QA & Brand Compliance Lead',
    department: 'Adidas Brand Global Sourcing',
    area: 'Dedicated Adidas Lines, QA Gates & Final Packaging',
    mandatoryStatus: 'Lead Facilitator',
    attendanceConfirmed: true,
    email: 'michael.chen@adidas.com',
    phone: '+65 9123-4567',
    notes: 'Auditor kepala brand Adidas. Memfasilitasi verifikasi standar global A-01, audit etika K3, dan kepatuhan shipment.'
  },
  {
    id: 'ASR-F02',
    group: 'Facilitator',
    name: 'Ir. Hendra Gunawan, IPM',
    title: 'Plant General Manager & Operational Director',
    department: 'Plant Executive Leadership',
    area: 'Seluruh Fasilitas & Area Produksi Pabrik',
    mandatoryStatus: 'Lead Facilitator',
    attendanceConfirmed: true,
    email: 'hendra.gunawan@factory-genba.co.id',
    phone: 'Ext. 2001',
    notes: 'Executive Sponsor & Lead Operasional. Pengambil keputusan otorisasi dan alokasi resource perbaikan CAPEX/OPEX.'
  },
  {
    id: 'ASR-F03',
    group: 'Facilitator',
    name: 'Fajar Ramadhan, S.T.',
    title: 'Head of Operational Excellence & Continuous Improvement',
    department: 'Operational Excellence (OE / CI)',
    area: 'Kaizen Board, Shopfloor Yamazumi & Flow Balancing',
    mandatoryStatus: 'Wajib Hadir (Mandatory)',
    attendanceConfirmed: true,
    email: 'fajar.ramadhan@factory-genba.co.id',
    phone: 'Ext. 2045',
    notes: 'Fasilitator teknis Genba Walk. Mengatur alur rute inspeksi, pencatatan SLA temuan, dan moderasi diskusi perbaikan.'
  },
  {
    id: 'ASR-F04',
    group: 'Facilitator',
    name: 'Siti Rahma, S.Kom.',
    title: 'CI Officer & Genba Minutes Secretary',
    department: 'Operational Excellence (OE / CI)',
    area: 'Seluruh Checkpoint Inspeksi (Digital Recording Station)',
    mandatoryStatus: 'Wajib Hadir (Mandatory)',
    attendanceConfirmed: true,
    email: 'siti.rahma@factory-genba.co.id',
    phone: 'Ext. 2046',
    notes: 'Pencatat resmi notulen dan foto bukti perbaikan digital. Pengelola log temuan Bi-Monthly dan distribusi action item.'
  },

  // --- GROUP 2: PIC AREA ---
  {
    id: 'ASR-P01',
    group: 'PIC Area',
    name: 'Ibu Anita Wijaya, S.E., M.M.',
    title: 'Head of Warehouse & Inventory Control',
    department: 'Warehouse (WH)',
    area: 'Fabric Roll Storage, Trims Room & Finished Goods',
    mandatoryStatus: 'Standby di Area',
    attendanceConfirmed: true,
    email: 'anita.wijaya@factory-genba.co.id',
    phone: 'Ext. 2101',
    notes: 'PIC tuan rumah gudang. Bertanggung jawab atas sistem FIFO kain roll, relaksasi kain, kebersihan palet, dan akurasi lot trims.'
  },
  {
    id: 'ASR-P02',
    group: 'PIC Area',
    name: 'Bpk. Ir. Rahmat Hidayat, M.T.',
    title: 'Cutting Department Manager',
    department: 'Cutting (CUT)',
    area: 'Auto-Spreading Table, Auto-Cutter Bay & Fusing Station',
    mandatoryStatus: 'Standby di Area',
    attendanceConfirmed: true,
    email: 'rahmat.hidayat@factory-genba.co.id',
    phone: 'Ext. 2201',
    notes: 'PIC tuan rumah cutting. Bertanggung jawab atas presisi pola potong, mesh glove keselamatan, dan shading bundle kain.'
  },
  {
    id: 'ASR-P03',
    group: 'PIC Area',
    name: 'Bpk. Dedi Kurniawan, S.T.',
    title: 'Internal Logistics & Distribution Supervisor',
    department: 'Distribusi (DIST)',
    area: 'Bundle Transfer Pathway & Sewing Input Staging',
    mandatoryStatus: 'Standby di Area',
    attendanceConfirmed: true,
    email: 'dedi.kurniawan@factory-genba.co.id',
    phone: 'Ext. 2301',
    notes: 'PIC alur transfer. Bertanggung jawab atas marka demarkasi lintasan trolley, kelancaran feeder, dan pencegahan bundle mix-up.'
  },
  {
    id: 'ASR-P04',
    group: 'PIC Area',
    name: 'Ibu Ratna Kusuma, S.T.',
    title: 'Sewing Production Senior Manager',
    department: 'Sewing (SEW)',
    area: 'Dedicated Adidas Sewing Lines 1 - 8 & In-line QC',
    mandatoryStatus: 'Standby di Area',
    attendanceConfirmed: true,
    email: 'ratna.kusuma@factory-genba.co.id',
    phone: 'Ext. 2401',
    notes: 'PIC tuan rumah penjahitan. Bertanggung jawab atas Broken Needle Policy, 5S meja jahit, dan kualitas kerapian jahitan.'
  },
  {
    id: 'ASR-P05',
    group: 'PIC Area',
    name: 'Bpk. Agus Prasetyo, S.T.',
    title: 'Head of Finishing & Packaging Operations',
    department: 'Finishing Packing (FP)',
    area: 'Calibrated Metal Detector Tunnel & Steam Press Station',
    mandatoryStatus: 'Standby di Area',
    attendanceConfirmed: true,
    email: 'agus.prasetyo@factory-genba.co.id',
    phone: 'Ext. 2501',
    notes: 'PIC tuan rumah finishing. Bertanggung jawab atas kalibrasi 9-titik detektor logam, kerapian folding, dan kartonasi ekspor.'
  },
  {
    id: 'ASR-P06',
    group: 'PIC Area',
    name: 'Bpk. Arif Wibowo, S.K.M.',
    title: 'EHS & Sustainability Officer',
    department: 'EHS & K3',
    area: 'B3 Chemical Storage, Waste Sorting & Emergency Exits',
    mandatoryStatus: 'Standby di Area',
    attendanceConfirmed: true,
    email: 'arif.wibowo@factory-genba.co.id',
    phone: 'Ext. 2601',
    notes: 'PIC tuan rumah K3 & lingkungan. Bertanggung jawab atas kelengkapan MSDS kimia, spill kit, dan jalur evakuasi bebas rintangan.'
  },

  // --- GROUP 3: ASSESSORS ---
  {
    id: 'ASR-A01',
    group: 'Assessors',
    name: 'Irwan Prasetya, S.T.',
    title: 'Senior Quality Assurance Lead Assessor',
    department: 'Quality Assurance (QA)',
    area: 'Sewing Seam Strength, Needle Calibration & Stitch Density',
    mandatoryStatus: 'Wajib Hadir (Mandatory)',
    attendanceConfirmed: true,
    email: 'irwan.prasetya@factory-genba.co.id',
    phone: 'Ext. 2701',
    notes: 'Auditor teknis kualitas Adidas A-01. Memeriksa kerapian jahitan, tension benang, log pergantian jarum, dan defect rate.'
  },
  {
    id: 'ASR-A02',
    group: 'Assessors',
    name: 'Linda Mayasari',
    title: 'In-Line QC Specialist & Color Matching Assessor',
    department: 'Quality Control (QC)',
    area: 'Fabric Inspection Table, Shading & Trims Consistency',
    mandatoryStatus: 'Wajib Hadir (Mandatory)',
    attendanceConfirmed: true,
    email: 'linda.mayasari@factory-genba.co.id',
    phone: 'Ext. 2705',
    notes: 'Assessor verifikasi shading warna bahan, lux pencahayaan meja inspeksi (min 1000 Lux), dan kelayakan barcode trims.'
  },
  {
    id: 'ASR-A03',
    group: 'Assessors',
    name: 'Rian Firmansyah',
    title: 'Safety Stop 6 & EHS Certified Assessor',
    department: 'Environment, Health & Safety (EHS)',
    area: 'Machine Guarding, Pinch Points, Electrical Panels & APD',
    mandatoryStatus: 'Wajib Hadir (Mandatory)',
    attendanceConfirmed: true,
    email: 'rian.firmansyah@factory-genba.co.id',
    phone: 'Ext. 2605',
    notes: 'Assessor kepatuhan Stop 6 Hazard. Menilai cover puli dinamo, eye guard mesin jahit, grounding panel, dan pemakaian APD.'
  },
  {
    id: 'ASR-A04',
    group: 'Assessors',
    name: 'Joko Susilo',
    title: 'Senior Maintenance & Poka-Yoke Assessor',
    department: 'Maintenance & Facility Engineering',
    area: 'Interlock Sensors, Pneumatic Air Pressure & Tool Calibration',
    mandatoryStatus: 'Wajib Hadir (Mandatory)',
    attendanceConfirmed: true,
    email: 'joko.susilo@factory-genba.co.id',
    phone: 'Ext. 2801',
    notes: 'Assessor fungsi poka-yoke teknis, keandalan safety interlock mesin potong, dan kalibrasi uji bola detektor logam.'
  },
  {
    id: 'ASR-A05',
    group: 'Assessors',
    name: 'Nurul Hidayati, S.Psi.',
    title: 'Social Compliance & Ergonomics Assessor',
    department: 'HR & Labor Compliance',
    area: 'Shopfloor Ergonomics, Ventilation & Operator Hydration',
    mandatoryStatus: 'Wajib Hadir (Mandatory)',
    attendanceConfirmed: true,
    email: 'nurul.hidayati@factory-genba.co.id',
    phone: 'Ext. 2901',
    notes: 'Assessor standar perlakuan pekerja & etika kerja (Adidas Code of Conduct), sirkulasi udara lini, dan kenyamanan kursi operator.'
  },
  {
    id: 'ASR-A06',
    group: 'Assessors',
    name: 'Bambang Sudiro',
    title: 'Cross-Line 5S & Kaizen Assessor',
    department: 'Operational Excellence (OE / CI)',
    area: '5S Visual Shadow Boards, Tool Organization & Waste Flow',
    mandatoryStatus: 'Wajib Hadir (Mandatory)',
    attendanceConfirmed: true,
    email: 'bambang.sudiro@factory-genba.co.id',
    phone: 'Ext. 2048',
    notes: 'Assessor audit silang 5R/5S shopfloor. Memeriksa kerapian meja kerja, visual labelling rak, dan eliminasi waste gerakan operator.'
  }
];

export interface AuthCredential {
  password: string;
  account: {
    id: string;
    username: string;
    name: string;
    role: 'admin' | 'anggota';
    title: string;
    department: string;
    email?: string;
  };
}

export const SYSTEM_ACCOUNTS: AuthCredential[] = [
  {
    password: 'genbaadidas',
    account: {
      id: 'USR-ADMIN-1',
      username: 'admin',
      name: 'Ir. Hendra Gunawan',
      role: 'admin',
      title: 'Plant General Manager & Kaizen Lead',
      department: 'Continuous Improvement (Admin Pusat)',
      email: 'hendra.gunawan@aoi.co.id'
    }
  },
  {
    password: 'genbaadidas',
    account: {
      id: 'USR-ADMIN-2',
      username: 'admin_kaizen',
      name: 'Ir. Hendra Gunawan',
      role: 'admin',
      title: 'Plant General Manager & Kaizen Lead',
      department: 'Continuous Improvement (Admin Pusat)',
      email: 'admin.genba@aoi.co.id'
    }
  },
  {
    password: 'membergenba',
    account: {
      id: 'USR-ANGGOTA-1',
      username: 'member',
      name: 'Rian Kurniawan, S.T.',
      role: 'anggota',
      title: 'Field Inspector & Shopfloor Assessor',
      department: 'Quality Assurance & Genba Team',
      email: 'rian.kurniawan@aoi.co.id'
    }
  },
  {
    password: 'membergenba',
    account: {
      id: 'USR-ANGGOTA-2',
      username: 'anggota',
      name: 'Rian Kurniawan, S.T.',
      role: 'anggota',
      title: 'Field Inspector & Shopfloor Assessor',
      department: 'Quality Assurance & Genba Team',
      email: 'rian.kurniawan@aoi.co.id'
    }
  },
  {
    password: 'membergenba',
    account: {
      id: 'USR-ANGGOTA-3',
      username: 'user',
      name: 'Rian Kurniawan, S.T.',
      role: 'anggota',
      title: 'Field Inspector & Shopfloor Assessor',
      department: 'Quality Assurance & Genba Team',
      email: 'rian.kurniawan@aoi.co.id'
    }
  },
  {
    password: 'membergenba',
    account: {
      id: 'USR-ANGGOTA-4',
      username: 'anggota_qc',
      name: 'Siti Rahayu',
      role: 'anggota',
      title: 'Supervisor Lini Sewing & 5S Auditor',
      department: 'Production Sewing Line 4',
      email: 'siti.rahayu@aoi.co.id'
    }
  }
];

export const verifyCredentials = (usernameInput: string, passwordInput: string): { success: boolean; account?: UserAccount; error?: string } => {
  const cleanUser = usernameInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanUser || !cleanPass) {
    return { success: false, error: 'Silakan isi Username dan Password.' };
  }

  const match = SYSTEM_ACCOUNTS.find(
    (acc) => acc.account.username.toLowerCase() === cleanUser && acc.password === cleanPass
  );

  if (match) {
    return { success: true, account: match.account };
  }

  return { 
    success: false, 
    error: 'Username atau Password salah. Silakan periksa kembali username dan password Anda.' 
  };
};


