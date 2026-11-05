# KARCIS — Platform Tiket Acara Independen

> **"Tiket aman, antrean nggak ada."**
> Aplikasi web pemesanan tiket acara online (konser/gigs, lokakarya kreatif, temu teknologi, pemutaran film, dan festival kuliner) dengan konsep visual **"tiket fisik bertemu poster gigs"** serta transaksi anti-overselling berbasis PostgreSQL row-level locking dan Supabase Realtime.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript), React 19 (`useActionState`, Server Components & Server Actions)
- **Styling & UI**: Tailwind CSS v4 (`@theme` CSS variables), Shadcn UI primitives (Radix UI), Lucide Icons
- **Database, Auth & Realtime**: Supabase (PostgreSQL, Row Level Security, Email/Password + GitHub OAuth, Supabase Realtime `postgres_changes`) dengan `@supabase/ssr`
- **Validasi**: Zod
- **Animasi**: Motion (`motion/react` / Framer Motion) dengan dukungan `prefers-reduced-motion`
- **QR Code Tiket**: `qrcode.react`
- **Route Guard**: `src/proxy.ts` (Next.js 16 Proxy convention pengganti `middleware.ts`)

---

## Langkah Demi Langkah Setup & Menjalankan Proyek

### 1. Buat Project Supabase
1. Buka [https://supabase.com/dashboard](https://supabase.com/dashboard) dan buat project baru.
2. Catat **Project URL** dan **anon / public key** dari menu **Project Settings → API**.

### 2. Jalankan Skema Database & Seed Data (`supabase/schema.sql`)
1. Di dashboard Supabase, buka menu **SQL Editor → New Query**.
2. Salin seluruh isi file [`supabase/schema.sql`](./supabase/schema.sql) lalu klik **Run**.
3. Skrip ini otomatis membuat:
   - 6 tabel (`profiles`, `categories`, `events`, `ticket_types`, `orders`, `tickets`) beserta UUID primary key, foreign key, constraint (`remaining >= 0 AND remaining <= quota`), dan index.
   - Trigger otomatis `on_auth_user_created` yang membuat baris di `profiles` saat user baru mendaftar.
   - Fungsi RPC `purchase_tickets(p_ticket_type_id uuid, p_qty int)` dengan `SECURITY DEFINER` dan `SELECT ... FOR UPDATE` untuk mencegah overselling.
   - Row Level Security (RLS) penuh di semua tabel.
   - Publikasi Supabase Realtime untuk tabel `ticket_types` dan `orders`.
   - Seed data: 5 kategori dan 8 acara bertema Indonesia beserta 2–3 jenis tiket tiap acara.

### 3. Aktifkan Autentikasi Email & GitHub OAuth
1. Di dashboard Supabase, buka **Authentication → Providers → Email**. Untuk kemudahan pengujian lokal, kamu bisa menonaktifkan *"Confirm email"* agar pendaftaran langsung masuk.
2. Untuk **GitHub OAuth (1 Klik)**:
   - Buka [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers) dan buat OAuth App baru.
   - Isi **Homepage URL**: `http://localhost:3000`
   - Isi **Authorization callback URL**: `https://<PROJECT_ID_SUPABASE_KAMU>.supabase.co/auth/v1/callback`
   - Salin **Client ID** dan **Client Secret** dari GitHub ke menu **Authentication → Providers → GitHub** di dashboard Supabase.
   - Di menu **Authentication → URL Configuration** Supabase, tambahkan `http://localhost:3000/auth/callback` ke daftar **Redirect URLs**.

### 4. Konfigurasi `.env.local`
Salin `.env.example` menjadi `.env.local` lalu isi dengan kredensial Supabase milikmu:

```bash
cp .env.example .env.local
```

Isi `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://project-id-kamu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Install Dependensi & Jalankan Server Development
```bash
npm install
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser.

### 6. Cara Menjadikan Akun Sebagai Admin Lewat SQL
Secara default, setiap pengguna baru memiliki `role = 'member'` dan tidak bisa mengubah role miliknya sendiri (dilindungi oleh RLS policy `profiles_update_own_no_role_escalation`). Untuk mempromosikan akunmu menjadi `admin`:

1. Daftar/login terlebih dahulu di aplikasi KARCIS.
2. Buka **Supabase Dashboard → SQL Editor** dan jalankan query berikut (ganti dengan alamat email akunmu):

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'emailkamu@domain.id'
);
```
3. Setelah dijalankan, refresh halaman aplikasi—menu **Ruang Kendali (`/admin`)** akan muncul di Navbar dan kamu bisa mengakses seluruh fitur CRUD admin.

---

## Daftar Fitur Utama

1. **Eksplorasi & Penyaringan Berbasis URL (`searchParams`)**:
   - Filter acara berdasarkan kategori, kota, kata kunci pencarian, dan pagination langsung di Server Component (`/events`).
2. **Transaksi Anti-Overselling (`purchase_tickets`)**:
   - Pembelian mengunci baris `ticket_types` menggunakan `SELECT ... FOR UPDATE`, membatasi maksimal 5 tiket per transaksi, membuat `orders` (`paid`) + `tickets` berkode unik 8 karakter uppercase, dan mengurangi kuota dalam satu transaksi atomik.
3. **Kuota & Pesanan Real-time (Supabase Realtime)**:
   - Halaman detail acara (`/events/[slug]`) berlangganan perubahan tabel `ticket_types` secara langsung; angka sisa kuota beranimasi tanpa reload, memunculkan badge **HAMPIR HABIS** (`< 15%`) dan **SOLD OUT** (`0`).
   - Dashboard Admin (`/admin`) berlangganan `INSERT` pada tabel `orders` untuk menampilkan feed pembelian terbaru secara live.
4. **Dompet Karcis & Tiket Digital QR (`/my-tickets/[code]`)**:
   - Desain karcis kertas lengkap dengan perforasi kiri-kanan, stub tanggal vertikal, kode QR (`qrcode.react`), kode verifikasi 8 karakter monospace, ilustrasi barcode, animasi tiket keluar dari mesin cetak + confetti setelah pembelian, dan fitur cetak/simpan PDF.
5. **Ruang Kendali Admin (`/admin/*`)**:
   - Statistik total event, tiket terjual, total pendapatan, grafik tingkat keterisian kuota, tabel CRUD acara, toggle cepat status `published`/`draft`, pengelolaan jenis tiket (`ticket_types`), dan daftar pembeli per acara.
6. **Identitas Visual "Tiket Fisik Bertemu Poster Gigs"**:
   - Palet kertas (`#F4EFE6`), tinta (`#141210`), vermilion (`#FF4F1F`), mustard (`#F2B705`), dan pine (`#1F6F54`), serta mode gelap **"Malam di Venue"**.
   - Tipografi `Bricolage Grotesque`, `Instrument Serif` (italic accent), dan `Geist Mono`.

---

## Asumsi yang Diambil

1. **Mode Pratinjau Tanpa Kredensial (Graceful Fallback)**: Jika variabel `.env.local` belum diisi saat proyek pertama kali dijalankan atau di-build di CI/Vercel, aplikasi secara otomatis menampilkan data seed statis yang identik dengan `supabase/schema.sql` serta mengizinkan simulasi lihat tiket `#KRC26SIM` agar antarmuka dapat langsung dieksplorasi tanpa crash.
2. **Pembayaran Simulasi**: Sesuai spesifikasi, transaksi langsung berstatus `paid` di dalam fungsi RPC `purchase_tickets` tanpa payment gateway pihak ketiga.
3. **Bundler Build**: Skrip `npm run build` menggunakan `next build --webpack` untuk memastikan kestabilan pemrosesan worker PostCSS Tailwind v4 di lingkungan Windows maupun Linux/Vercel.
4. **Simpan Tiket**: Tombol *"Cetak / Simpan PDF"* pada halaman tiket digital (`/my-tickets/[code]`) memanggil dialog cetak native browser (`window.print()`) dengan stylesheet `@media print` yang menyembunyikan tombol navigasi sehingga hanya mencetak badan karcis fisik.

