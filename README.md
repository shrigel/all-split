# All Split 🧾

> **Multi-Bill Expense Splitting & Optimized Settlement Web Application**  
> Solusi penghitungan dan pembagian pengeluaran grup multi-tagihan tanpa ribet, tanpa login, dengan kalkulasi presisi dan penyelesaian utang-piutang (*settlement*) yang optimal.

---

## 📌 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Masalah yang Diselesaikan](#-masalah-yang-diselesaikan)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Direktori](#-struktur-direktori)
- [Cara Menjalankan Proyek](#-cara-menjalankan-proyek)
- [Catatan Pengembangan & Roadmap](#-catatan-pengembangan--roadmap)
  - [Catatan Refactoring & Kualitas Kode](#1-refactoring--kualitas-kode)
  - [Rekomendasi Lanjutan dari Engineering Mentor](#2-rekomendasi-lanjutan-engineering-mentor)
- [Prinsip Finansial & Invarian Perhitungan](#-prinsip-finansial--invarian-perhitungan)

---

## 💡 Tentang Proyek

**All Split** adalah aplikasi web modern yang dirancang untuk mempermudah penghitungan patungan ketika sekelompok orang melakukan aktivitas bersama (liburan, makan bersama, sewa villa, acara kantor, dll.).

Berbeda dengan kalkulator patungan sederhana yang hanya membagi rata satu struk, All Split dibangun dengan prinsip:
> **"Complex calculation, simple experience."**

Aplikasi ini mendukung banyak tagihan dalam satu sesi, pembayar yang berbeda di setiap tagihan, pemilikan item yang spesifik maupun patungan rata, serta perhitungan otomatis untuk pajak, servis, dan diskon.

---

## 🎯 Masalah yang Diselesaikan

Merekonsiliasi pengeluaran grup seringkali membingungkan karena:
- Orang yang membayar berbeda-beda di tiap tempat (si A bayar makan siang, si B bayar bensin & tiket, si C bayar penginapan).
- Satu tagihan restoran memiliki banyak item dengan porsi konsumsi yang berbeda antar anggota.
- Ada biaya tambahan seperti pajak resto (PB1), *service charge*, diskon promo, atau parkir.
- Menghitung utang-piutang manual memakan waktu dan menimbulkan transfer uang berantai yang tidak perlu antar teman.

**All Split menyelesaikan ini dengan:**
1. Mengonsolidasi seluruh tagihan ke dalam satu sesi terpusat.
2. Mengagregasi saldo bersih (*net balance*) tiap partisipan (`Total Dibayar - Total Tanggung Jawab`).
3. Menghitung rute transfer seminimal mungkin (*optimized settlement*) menggunakan algoritma penyelesaian utang yang adil dan efisien.

---

## ✨ Fitur Utama

- [x] **Sesi Tanpa Login (Zero Friction)**  
  Langsung buat sesi patungan tanpa perlu registrasi atau membuat akun.
- [x] **Multi-Bill & Multi-Payer**  
  Mendukung pencatatan banyak tagihan dalam satu sesi, di mana setiap tagihan dapat ditalangi oleh partisipan yang berbeda.
- [x] **Dua Mode Input Fleksibel**  
  - **Itemized Bill**: Rincian per item menu, harga satuan, jumlah kuantitas, dan penugasan partisipan (bisa dipilih per orang atau dibagi rata ke semua).
  - **Single Expense**: Pencatatan cepat untuk pengeluaran tunggal/gelondongan (misal: bensin, sewa mobil, parkir).
- [x] **Kalkulasi Biaya Tambahan & Penyesuaian (Adjustments)**  
  - Mendukung Pajak, Biaya Layanan (*Service Charge*), Diskon, dan Kustom.
  - Opsi alokasi penyesuaian: **Proporsional** (berdasarkan rasio nilai konsumsi masing-masing) atau **Rata** (dibagi sama rata ke seluruh anggota).
- [x] **Mesin Penyelesaian Utang Optimal (Greedy Settlement Engine)**  
  Mengeliminasi transfer berputar-putar dan meminimalkan jumlah transaksi pembayaran antar partisipan.
- [x] **Ekspor & Berbagi Hasil Mudah**  
  - Salin ringkasan hasil kalkulasi ke clipboard dengan format teks yang rapi.
  - Bagikan langsung ke grup WhatsApp dengan satu klik.
- [x] **Penyimpanan Lokal Sementara (Auto-save)**  
  Data sesi otomatis tersimpan di peramban (`localStorage`) sehingga aman dari ketidaksengajaan *refresh* atau kendala koneksi, dilengkapi masa aktif sesi 7 hari.
- [x] **Modal Konfirmasi Pengamanan Data**  
  Mencegah kehilangan perubahan yang belum tersimpan saat berpindah halaman secara tidak sengaja.

---

## 🛠 Teknologi yang Digunakan

- **Frontend Core**: [React 19](https://react.dev/)
- **Build Tool & Bundler**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) & CSS
- **Code Linter**: [Oxlint](https://oxc.rs/)
- **Storage**: Browser Local Storage (Persistensi Sesi Sementara)

---

## 📂 Struktur Direktori

```text
all-split/
├── public/                # Aset statis publik
├── src/
│   ├── assets/            # Aset gambar & ilustrasi
│   ├── components/        # Komponen UI global (Header, Modal, Logo, dsb.)
│   ├── feature/
│   │   └── session/       # Alur halaman & fitur sesi patungan
│   │       ├── Bill/      # Komponen tagihan, form input, dan modal terkait
│   │       │   ├── modal/ # ItemModal, AdjustmentModal, BillDetailModal, dll.
│   │       │   ├── BillForm.jsx
│   │       │   └── Bills.jsx
│   │       ├── Home.jsx         # Halaman utama & manajemen riwayat sesi
│   │       ├── Participants.jsx # Halaman kelola partisipan grup
│   │       └── Result.jsx       # Halaman rincian kalkulasi & penyelesaian
│   ├── utils/             # Helper fungsi kalkulasi & format mata uang/teks
│   │   ├── calculations.js
│   │   └── formatter.js
│   ├── App.jsx            # Routing, state global sesi, & penjaga navigasi
│   ├── index.css          # Desain sistem, font, token warna Tailwind
│   └── main.jsx           # Entry point React
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat
- Pastikan sudah terinstal [Node.js](https://nodejs.org/) (versi 18+ direkomendasikan)
- Package manager `npm`

### Langkah Instalasi

1. **Clone repositori dan masuk ke direktori proyek:**
   ```bash
   git clone https://github.com/username/all-split.git
   cd all-split
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (development server):**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173/` secara default.

4. **Perintah lainnya:**
   - Menjalankan linter:
     ```bash
     npm run lint
     ```
   - Membuat build produksi:
     ```bash
     npm run build
     ```
   - Meninjau hasil build lokal:
     ```bash
     npm run preview
     ```

---

## 🧭 Catatan Pengembangan & Roadmap

Untuk membawa aplikasi ini ke standar *production-ready* dan menjadikannya proyek portofolio yang solid, berikut adalah catatan area perbaikan saat ini serta rekomendasi pengembangan ke depan:

### 1. Refactoring & Kualitas Kode

- **Pecah Halaman Monolitik ke Komponen yang Lebih Kecil & Terfokus**  
  Beberapa komponen halaman utama (khususnya `BillForm.jsx` dan `Result.jsx`) saat ini menangani terlalu banyak tanggung jawab UI sekaligus. Perlu didekomposisi menjadi sub-komponen kecil dengan satu tanggung jawab (*Single Responsibility Principle*), misalnya:
  - `BillModeSelector`, `ItemList`, `ItemRow`, `AdjustmentList`, dan `PayerSelector` pada formulir tagihan.
  - `ParticipantBalanceCard`, `SettlementTransferList`, dan `ParticipantDetailAccordion` pada halaman hasil.
- **Pemisahan Handlers, Business Logic, dan Utils ke Modul Terpisah**  
  Ekstraksi logika manipulasi form, formatting pesan WhatsApp/clipboard, dan query storage dari dalam JSX ke *custom hooks* (misal `useSession`, `useBillForm`, `useClipboard`) dan file utilitas mandiri. Hal ini membuat komponen UI lebih deklaratif dan mempermudah pengujian.
- **Merapikan dan Menserasikan Struktur Kode & Arsitektur Direktori**  
  - Penyeragaman konvensi penamaan folder dan file (misalnya harmonisasi nama folder plural/singular `features/` vs `feature/`, `bills/` vs `Bill/`).
  - Mengurangi *prop drilling* yang dalam dari `App.jsx` dengan menerapkan React Context (`SessionContext`) atau state management ringan.
  - Standardisasi pola impor dan manajemen konstanta global (misal tipe adjustment, default currency, masa aktif sesi).
- **Peningkatan Aksesibilitas (Accessibility / A11y)**  
  - Memastikan seluruh elemen interaktif dan tombol memiliki `aria-label` yang deskriptif (terutama tombol aksi berbasis ikon seperti edit/hapus).
  - Implementasi *focus trap* dan penutupan dengan tombol `Escape` pada seluruh modal dialog (`ItemModal`, `AdjustmentModal`, `ConfirmationModal`).
  - Menghubungkan label form secara eksplisit ke input masing-masing menggunakan atribut `htmlFor` dan `id`.
  - Memverifikasi rasio kontras warna (WCAG AA/AAA) pada teks sekunder dan lencana (*badge*) status tagihan.

---

### 2. Rekomendasi Lanjutan

- 🧪 **Unit Testing & Financial Invariant Verification**  
  Implementasi pengujian otomatis (menggunakan [Vitest](https://vitest.dev/)) untuk engine finansial di `calculations.js`:
  - Uji kasus pembagian tidak habis (misal: Rp100.000 dibagi 3 orang) untuk memastikan pembulatan deterministik dan tidak ada rupiah yang hilang atau tercipta secara gaib.
  - Uji invarian global: `sum(all participant balances) === 0` dan `sum(transfers sent) === sum(transfers received)`.
- 📷 **Implementasi Penuh OCR Scan Struk**  
  Mengembangkan modal scan struk dari *mockup* saat ini menjadi fitur nyata menggunakan integrasi OCR (seperti Tesseract.js atau layanan cloud vision), dilengkapi dengan antarmuka peninjauan (*review & correction step*) sebelum item dimasukkan ke tagihan.
- 📘 **Adopsi Bertahap TypeScript**  
  Melakukan migrasi bertahap ke TypeScript, dimulai dari mendefinisikan *types* atau *interfaces* untuk entitas domain utama (`Participant`, `Bill`, `Item`, `Adjustment`, `Settlement`). Ini akan meningkatkan keandalan perhitungan dan memberikan *autocomplete* yang aman di seluruh komponen.
- 💾 **Upgrade Penyimpanan Lokal (IndexedDB / Dexie.js)**  
  Beralih dari `localStorage` ke `IndexedDB` sebagai cache pemulihan peramban (*offline resilience*) untuk kapasitas penyimpanan yang lebih lega dan kemampuan menyimpan berkas gambar struk sementara.
- ☁️ **Backend Sinkronisasi & Multi-Device Sharing (Phase 2 PRD)**  
  Menambahkan backend API ringan (Node.js / Express / NestJS) dengan penyimpanan sementara (Redis / PostgreSQL berkala TTL 7 hari) agar hasil kalkulasi dapat dibuka lewat tautan unik oleh seluruh anggota grup langsung dari ponsel masing-masing.

---

## ⚖️ Prinsip Finansial & Invarian Perhitungan

Perhitungan keuangan dalam All Split tunduk pada aturan ketat berikut:

1. **Format Mata Uang Tanpa Floating-Point Loss**  
   Nominal dihitung dalam satuan integer terkecil (Rupiah utuh tanpa desimal mengambang) guna mencegah masalah presisi biner IEEE 754.
2. **Formula Saldo Bersih Partisipan**  
   ```text
   Balance = Total Dibayarkan - Total Tanggung Jawab
   ```
   - Nilai positif (`> 0`): Partisipan berhak **menerima uang**.
   - Nilai negatif (`< 0`): Partisipan berkewajiban **membayar utang**.
   - Nol (`= 0`): Partisipan dalam kondisi lunas (*settled*).
3. **Invarian Keseimbangan Global**  
   ```text
   Total Seluruh Saldo Partisipan = 0
   ```
4. **Invarian Integritas Penyelesaian (Settlement)**  
   ```text
   Total Uang Ditransfer = Total Uang Diterima
   ```
   Transfer pembayaran tidak boleh menciptakan atau menghilangkan uang dari total tagihan sebenarnya.

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran dan pengembangan portofolio mandiri. Bebas digunakan dan dikembangkan untuk keperluan non-komersial.
