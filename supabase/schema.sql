-- =============================================================================
-- KARCIS — Skema Database PostgreSQL & Supabase (Siap dijalankan di SQL Editor)
-- =============================================================================

-- 1. EKSTENSI
create extension if not exists "pgcrypto";

-- =============================================================================
-- 2. TABEL UTAMA (UUID Primary Keys, Foreign Keys, Constraints)
-- =============================================================================

-- Tabel profiles: terhubung 1:1 dengan auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

-- Tabel categories: kategori acara (Konser, Lokakarya, Festival, dll.)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  emoji text not null default '🎫'
);

-- Tabel events: daftar acara utama
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  organizer_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text not null,
  venue text not null,
  city text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  cover_url text,
  status text not null default 'published' check (status in ('draft', 'published', 'ended')),
  created_at timestamptz not null default now(),
  constraint events_dates_check check (ends_at >= starts_at)
);

-- Tabel ticket_types: jenis tiket per acara (Early Bird, Presale, Regular, VIP)
create table if not exists public.ticket_types (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  price integer not null check (price >= 0),
  quota integer not null check (quota > 0),
  remaining integer not null,
  created_at timestamptz not null default now(),
  constraint ticket_types_remaining_check check (remaining >= 0 and remaining <= quota)
);

-- Tabel orders: transaksi pembelian tiket oleh member
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete restrict,
  total_amount integer not null check (total_amount >= 0),
  status text not null default 'paid' check (status in ('paid', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Tabel tickets: karcis individu dengan kode unik 8 karakter uppercase
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  ticket_type_id uuid not null references public.ticket_types(id) on delete restrict,
  code text not null unique check (char_length(code) = 8 and code = upper(code)),
  checked_in_at timestamptz
);

-- =============================================================================
-- 3. INDEXES UNTUK PERFORMA QUERY
-- =============================================================================
create index if not exists idx_events_category_id on public.events(category_id);
create index if not exists idx_events_status_starts_at on public.events(status, starts_at);
create index if not exists idx_events_city on public.events(city);
create index if not exists idx_ticket_types_event_id on public.ticket_types(event_id);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_event_id on public.orders(event_id);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_tickets_order_id on public.tickets(order_id);
create index if not exists idx_tickets_code on public.tickets(code);

-- =============================================================================
-- 4. TRIGGER OTOMATIS MEMBUAT PROFILES SAAT USER SIGN UP DI AUTH.USERS
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper function cek apakah user saat ini adalah admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =============================================================================
-- 5. ATOMIC RPC FUNCTION: purchase_tickets (ANTI-OVERSELLING)
-- Mengunci baris ticket_types dengan SELECT ... FOR UPDATE, memvalidasi kuota
-- dan batas maksimal 5 tiket per order, lalu membuat order + tickets dalam 1 transaksi.
-- Mengembalikan kode tiket pertama agar bisa langsung redirect ke tiket digital.
-- =============================================================================
create or replace function public.generate_ticket_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$;

create or replace function public.purchase_tickets(
  p_ticket_type_id uuid,
  p_qty int
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_ticket_type record;
  v_event record;
  v_order_id uuid;
  v_total_amount int;
  v_code text;
  v_first_code text := null;
  v_codes text[] := array[]::text[];
  i int;
begin
  -- 1. Pastikan user sudah login
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'UNAUTHORIZED: Silakan masuk terlebih dahulu untuk membeli tiket.';
  end if;

  -- 2. Validasi jumlah tiket (1 s/d 5)
  if p_qty is null or p_qty < 1 or p_qty > 5 then
    raise exception 'INVALID_QTY: Jumlah pembelian harus antara 1 sampai 5 tiket per transaksi.';
  end if;

  -- 3. Kunci baris ticket_types menggunakan SELECT ... FOR UPDATE (mencegah race condition)
  select *
  into v_ticket_type
  from public.ticket_types
  where id = p_ticket_type_id
  for update;

  if not found then
    raise exception 'NOT_FOUND: Jenis tiket tidak ditemukan.';
  end if;

  -- 4. Pastikan event berstatus published
  select *
  into v_event
  from public.events
  where id = v_ticket_type.event_id;

  if not found or v_event.status <> 'published' then
    raise exception 'EVENT_UNAVAILABLE: Acara ini belum dibuka atau sudah berakhir.';
  end if;

  -- 5. Validasi sisa kuota
  if v_ticket_type.remaining < p_qty then
    if v_ticket_type.remaining = 0 then
      raise exception 'SOLD_OUT: Maaf, tiket kategori ini sudah habis terjual!';
    else
      raise exception 'INSUFFICIENT_QUOTA: Sisa kuota hanya % tiket.', v_ticket_type.remaining;
    end if;
  end if;

  -- 6. Hitung total harga & kurangi kuota remaining
  v_total_amount := v_ticket_type.price * p_qty;

  update public.ticket_types
  set remaining = remaining - p_qty
  where id = p_ticket_type_id;

  -- 7. Buat baris order (simulasi pembayaran langsung berstatus 'paid')
  insert into public.orders (user_id, event_id, total_amount, status)
  values (v_user_id, v_ticket_type.event_id, v_total_amount, 'paid')
  returning id into v_order_id;

  -- 8. Buat baris tiket sejumlah p_qty dengan kode unik 8 karakter
  for i in 1..p_qty loop
    loop
      v_code := public.generate_ticket_code();
      exit when not exists (select 1 from public.tickets where code = v_code);
    end loop;

    if v_first_code is null then
      v_first_code := v_code;
    end if;
    v_codes := array_append(v_codes, v_code);

    insert into public.tickets (order_id, ticket_type_id, code)
    values (v_order_id, p_ticket_type_id, v_code);
  end loop;

  return jsonb_build_object(
    'order_id', v_order_id,
    'first_ticket_code', v_first_code,
    'codes', v_codes,
    'total_amount', v_total_amount
  );
end;
$$;

-- =============================================================================
-- 6. ROW LEVEL SECURITY (RLS) DI SEMUA TABEL
-- =============================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.events enable row level security;
alter table public.ticket_types enable row level security;
alter table public.orders enable row level security;
alter table public.tickets enable row level security;

-- Policies untuk profiles:
-- Publik bisa membaca profil dasar (untuk menampilkan nama organizer/pembeli bagi admin)
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

-- User hanya bisa update profilnya sendiri dan TIDAK BOLEH mengubah kolom role
drop policy if exists "profiles_update_own_no_role_escalation" on public.profiles;
create policy "profiles_update_own_no_role_escalation"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- Policies untuk categories:
-- Publik boleh SELECT, admin boleh kelola
drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public"
  on public.categories for select
  using (true);

drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Policies untuk events:
-- Publik boleh SELECT event yang published (atau ended), admin boleh SELECT semua termasuk draft
drop policy if exists "events_select_public_or_admin" on public.events;
create policy "events_select_public_or_admin"
  on public.events for select
  using (status = 'published' or status = 'ended' or public.is_admin());

-- INSERT/UPDATE/DELETE events hanya untuk admin
drop policy if exists "events_insert_admin" on public.events;
create policy "events_insert_admin"
  on public.events for insert
  with check (public.is_admin());

drop policy if exists "events_update_admin" on public.events;
create policy "events_update_admin"
  on public.events for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "events_delete_admin" on public.events;
create policy "events_delete_admin"
  on public.events for delete
  using (public.is_admin());

-- Policies untuk ticket_types:
-- Publik boleh SELECT semua ticket_types
drop policy if exists "ticket_types_select_public" on public.ticket_types;
create policy "ticket_types_select_public"
  on public.ticket_types for select
  using (true);

-- INSERT/UPDATE/DELETE ticket_types hanya untuk admin
drop policy if exists "ticket_types_insert_admin" on public.ticket_types;
create policy "ticket_types_insert_admin"
  on public.ticket_types for insert
  with check (public.is_admin());

drop policy if exists "ticket_types_update_admin" on public.ticket_types;
create policy "ticket_types_update_admin"
  on public.ticket_types for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "ticket_types_delete_admin" on public.ticket_types;
create policy "ticket_types_delete_admin"
  on public.ticket_types for delete
  using (public.is_admin());

-- Policies untuk orders:
-- User hanya bisa membaca miliknya sendiri; admin bisa membaca semua
drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
  on public.orders for select
  using (auth.uid() = user_id or public.is_admin());

-- Policies untuk tickets:
-- User hanya bisa membaca tiket dari order miliknya sendiri; admin bisa membaca semua
drop policy if exists "tickets_select_own_or_admin" on public.tickets;
create policy "tickets_select_own_or_admin"
  on public.tickets for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = tickets.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- =============================================================================
-- 7. AKTIFKAN SUPABASE REALTIME UNTUK TABEL ticket_types DAN orders
-- =============================================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'ticket_types'
  ) then
    alter publication supabase_realtime add table public.ticket_types;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end;
$$;

-- =============================================================================
-- 8. SEED DATA: 5 KATEGORI & 8 EVENT REALISTIS BERTEMA INDONESIA (+ TICKET TYPES)
-- =============================================================================

insert into public.categories (id, name, slug, emoji)
values
  ('11111111-1111-4111-8111-111111111101', 'Gigs & Musik', 'musik', '🎸'),
  ('11111111-1111-4111-8111-111111111102', 'Temu Teknologi', 'teknologi', '⌨️'),
  ('11111111-1111-4111-8111-111111111103', 'Lokakarya Kreatif', 'lokakarya', '✂️'),
  ('11111111-1111-4111-8111-111111111104', 'Pasar & Kuliner', 'kuliner', '🍜'),
  ('11111111-1111-4111-8111-111111111105', 'Layar & Diskusi', 'diskusi', '🎞️')
on conflict (slug) do nothing;

insert into public.events (
  id, category_id, organizer_id, title, slug, description, venue, city, starts_at, ends_at, cover_url, status
)
values
  (
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111101',
    null,
    'Senandung Gudang Selatan: Malam Shoegaze & Post-Punk',
    'senandung-gudang-selatan-shoegaze',
    'Malam bising nan hangat di bekas gudang logistik Gudang Selatan. Menampilkan empat unit shoegaze dan post-punk independen lintas kota dari Bandung, Jakarta, dan Malang. Bawa penyumbat telinga, datang lebih awal untuk lapak rilisan fisik kaset dan zine independen.',
    'Gudang Selatan No. 22',
    'Bandung',
    '2026-11-21T19:00:00+07:00',
    '2026-11-21T23:30:00+07:00',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    'published'
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111101',
    null,
    'Suara Pesisir: Panggung Akustik & Folk Senja',
    'suara-pesisir-akustik-folk-senja',
    'Pertunjukan intim menghadap perbukitan Bantul saat matahari turun. Tiga musisi folk bercerita tentang perjalanan darat, ingatan rumah, dan kopi tubruk hangat. Kapasitas sangat terbatas agar suasana tetap hening dan khidmat.',
    'Amfiteater Tebing Breksi',
    'Yogyakarta',
    '2026-11-28T16:00:00+07:00',
    '2026-11-28T21:00:00+07:00',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
    'published'
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    '11111111-1111-4111-8111-111111111102',
    null,
    'Bedah Sistem Terdistribusi & Database Malam Jumat',
    'bedah-sistem-terdistribusi-jakarta',
    'Bukan seminar motivasi. Kita langsung buka terminal, membedah bagaimana menangani race condition pada transaksi tiket berkecepatan tinggi menggunakan PostgreSQL row-level locking, antrean asinkron, dan observabilitas produksi.',
    ' Pos Bloc — Ruang Filateli',
    'Jakarta',
    '2026-12-03T18:30:00+07:00',
    '2026-12-03T21:30:00+07:00',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    'published'
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    '11111111-1111-4111-8111-111111111103',
    null,
    'Cetak Risograph & Jilid Zine Manual Sehari Penuh',
    'cetak-risograph-jilid-zine-manual',
    'Lokakarya praktik langsung mengenal estetika cetak duplikator tinta kedelai (Risograph) dua warna. Peserta membawa pulang 15 eksemplar zine ukuran A5 karya sendiri lengkap dengan teknik jahit benang sadel.',
    'Studio Kertas Кolektif, Kemang',
    'Jakarta',
    '2026-12-06T10:00:00+07:00',
    '2026-12-06T16:00:00+07:00',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    'published'
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    '11111111-1111-4111-8111-111111111104',
    null,
    'Pasar Rempah & Kopi Sangrai Nusantara 2026',
    'pasar-rempah-kopi-sangrai-surabaya',
    'Festival akhir pekan yang mempertemukan 35 penyangrai kopi mikro, peracik teh artisan, dan penjaja kuliner warisan Jawa Timur. Tiket sudah termasuk kupon cicip 3 seduhan manual pilihan di stan kurasi.',
    'Pabrik Siropen Telasih',
    'Surabaya',
    '2026-12-12T09:00:00+07:00',
    '2026-12-12T20:00:00+07:00',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    'published'
  ),
  (
    '22222222-2222-4222-8222-222222222206',
    '11111111-1111-4111-8111-111111111103',
    null,
    'Merakit Synthesizer Modular Analog dari Nol',
    'merakit-synthesizer-modular-analog',
    'Belajar menyolder sirkuit osilator analog sederhana dalam format Eurorack bersama perancang instrumen eksperimental Yogyakarta. Tidak perlu latar belakang teknik elektro—semua PCB, komponen, dan solder disediakan.',
    'Kedai Kebun Forum',
    'Yogyakarta',
    '2026-12-15T13:00:00+07:00',
    '2026-12-15T18:00:00+07:00',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    'published'
  ),
  (
    '22222222-2222-4222-8222-222222222207',
    '11111111-1111-4111-8111-111111111105',
    null,
    'Layar Tancap Arsip Sinema Independen Asia Tenggara',
    'layar-tancap-arsip-sinema-denpasar',
    'Pemutaran 6 film pendek restorasi 16mm dari sutradara independen Indonesia, Filipina, dan Thailand, dilanjutkan diskusi terbuka bersama kurator arsip film di halaman terbuka.',
    'Taman Baca Kesiman',
    'Denpasar',
    '2026-12-19T18:30:00+07:00',
    '2026-12-19T22:30:00+07:00',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    'published'
  ),
  (
    '22222222-2222-4222-8222-222222222208',
    '11111111-1111-4111-8111-111111111102',
    null,
    'Temu Desainer Web & Tipografi Eksperimental',
    'temu-desainer-web-tipografi-bandung',
    'Sore santai membahas bagaimana membangun identitas visual web yang berkarakter tanpa terjebak template seragam. Studi kasus tipografi variabel, CSS modern, dan arah seni digital.',
    'Perpustakaan Bunga di Tembok',
    'Bandung',
    '2026-12-22T15:00:00+07:00',
    '2026-12-22T18:30:00+07:00',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    'published'
  )
on conflict (slug) do nothing;

-- Seed Ticket Types (2-3 jenis tiket per event, termasuk yang hampir habis & gratis)
insert into public.ticket_types (id, event_id, name, price, quota, remaining)
values
  -- Event 1: Senandung Gudang Selatan
  ('33333333-3333-4333-8333-333333333301', '22222222-2222-4222-8222-222222222201', 'Karcis Awal (Early Bird)', 85000, 50, 0),
  ('33333333-3333-4333-8333-333333333302', '22222222-2222-4222-8222-222222222201', 'Presale Gelombang 1', 125000, 120, 14),
  ('33333333-3333-4333-8333-333333333303', '22222222-2222-4222-8222-222222222201', 'Karcis Pintu + Bundel Zine & Kaset', 210000, 40, 28),

  -- Event 2: Suara Pesisir
  ('33333333-3333-4333-8333-333333333304', '22222222-2222-4222-8222-222222222202', 'Dudukkan Rumput (Regular)', 95000, 80, 9),
  ('33333333-3333-4333-8333-333333333305', '22222222-2222-4222-8222-222222222202', 'Tribun Kayu + Seduhan Hangat', 150000, 40, 22),

  -- Event 3: Bedah Sistem Terdistribusi
  ('33333333-3333-4333-8333-333333333306', '22222222-2222-4222-8222-222222222203', 'Karcis Komunitas (Gratis)', 0, 60, 7),
  ('33333333-3333-4333-8333-333333333307', '22222222-2222-4222-8222-222222222203', 'Pendukung Acara + Stiker Pack', 75000, 40, 31),

  -- Event 4: Cetak Risograph
  ('33333333-3333-4333-8333-333333333308', '22222222-2222-4222-8222-222222222204', 'Sesi Pagi (Termasuk Bahan & Kertas)', 285000, 20, 3),
  ('33333333-3333-4333-8333-333333333309', '22222222-2222-4222-8222-222222222204', 'Sesi Siang + Paket Kertas Khusus', 340000, 20, 12),

  -- Event 5: Pasar Rempah & Kopi
  ('33333333-3333-4333-8333-333333333310', '22222222-2222-4222-8222-222222222205', 'Pas Masuk Harian', 45000, 200, 142),
  ('33333333-3333-4333-8333-333333333311', '22222222-2222-4222-8222-222222222205', 'Pas Terusan + Gelas Keramik Cupping', 135000, 60, 8),

  -- Event 6: Synthesizer Modular
  ('33333333-3333-4333-8333-333333333312', '22222222-2222-4222-8222-222222222206', 'Peserta Merakit (Bawa Pulang Modul)', 450000, 15, 2),
  ('33333333-3333-4333-8333-333333333313', '22222222-2222-4222-8222-222222222206', 'Pengamat & Sesi Jamming Sore', 65000, 30, 19),

  -- Event 7: Layar Tancap Arsip Sinema
  ('33333333-3333-4333-8333-333333333314', '22222222-2222-4222-8222-222222222207', 'Tikar Reguler', 50000, 75, 44),
  ('33333333-3333-4333-8333-333333333315', '22222222-2222-4222-8222-222222222207', 'Kursi Lipat + Buklet Esai Film', 95000, 30, 4),

  -- Event 8: Temu Desainer Web
  ('33333333-3333-4333-8333-333333333316', '22222222-2222-4222-8222-222222222208', 'Karcis Masuk Umum', 60000, 50, 29),
  ('33333333-3333-4333-8333-333333333317', '22222222-2222-4222-8222-222222222208', 'Bundel Spesimen Huruf Cetak', 130000, 25, 3)
on conflict (id) do nothing;

