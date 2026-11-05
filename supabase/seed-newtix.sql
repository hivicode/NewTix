-- =============================================================================
-- NEWTIX SEED DATA: NEWJEANS ARCHIVE & COMMUNITY FAN-MADE EVENTS
-- Idempotent script: menghapus data lama berurutan (tickets, orders, ticket_types, events, categories)
-- =============================================================================

-- 1. Bersihkan transaksi & tiket lama
delete from public.tickets;
delete from public.orders;

-- 2. Bersihkan master data acara lama
delete from public.ticket_types;
delete from public.events;
delete from public.categories;

-- =============================================================================
-- 3. KATEGORI (4 Kategori Resmi & Komunitas)
-- =============================================================================

insert into public.categories (id, name, slug, emoji)
values
  ('11111111-1111-4111-8111-111111111101', 'Fan Meeting', 'fan-meeting', '🐰'),
  ('11111111-1111-4111-8111-111111111102', 'Festival & Awards', 'festival-awards', '🏆'),
  ('11111111-1111-4111-8111-111111111103', 'Fan-made Event', 'fan-made-event', '💙'),
  ('11111111-1111-4111-8111-111111111104', 'Workshop Kreatif', 'workshop-kreatif', '✂️')
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  emoji = excluded.emoji;

-- =============================================================================
-- 4. EVENTS (4 Event Asli Status Ended + 3 Event Fiktif Komunitas Status Published)
-- =============================================================================

insert into public.events (
  id, category_id, organizer_id, title, slug, description, venue, city, starts_at, ends_at, cover_url, status
)
values
  -- Event Asli 1: Bunnies Camp
  (
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111101',
    null,
    'Bunnies Camp',
    'bunnies-camp',
    'Tanggal 1-2 Juli 2023, SK Olympic Handball Gymnasium, Seoul. Fan meeting pertama NewJeans. Tidak ada info harga terverifikasi, jangan menulis harga.',
    'SK Olympic Handball Gymnasium',
    'Seoul',
    '2023-07-01T18:00:00+09:00',
    '2023-07-02T21:00:00+09:00',
    '/covers/bunnies-camp-2023.svg',
    'ended'
  ),

  -- Event Asli 2: Bunnies Camp 2024 Tokyo Dome
  (
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111101',
    null,
    'Bunnies Camp 2024 Tokyo Dome',
    'bunnies-camp-2024-tokyo-dome',
    'Tanggal 26-27 Juni 2024, Tokyo Dome, Tokyo. Fan meeting kedua dan penampilan solo pertama di Jepang. Tiket sold out kedua hari. Bintang tamu: YOASOBI dan Rina Sawayama. Kursi pandangan terbatas dibuka karena permintaan tinggi.

Harga tiket resmi saat penyelenggaraan:
• PREMIUM: ¥22.000 (sudah termasuk pajak)
• SS: ¥15.000 (sudah termasuk pajak)
• S: ¥13.000 (sudah termasuk pajak)',
    'Tokyo Dome',
    'Tokyo',
    '2024-06-26T18:00:00+09:00',
    '2024-06-27T21:00:00+09:00',
    '/covers/bunnies-camp-2024-tokyo.svg',
    'ended'
  ),

  -- Event Asli 3: Music Bank Global Festival 2024
  (
    '22222222-2222-4222-8222-222222222203',
    '11111111-1111-4111-8111-111111111102',
    null,
    'Music Bank Global Festival 2024',
    'music-bank-global-festival-2024',
    '14 Desember 2024, Fukuoka Dome, Fukuoka. Penampilan sebagai bagian dari festival, bukan konser tunggal.',
    'Fukuoka Dome',
    'Fukuoka',
    '2024-12-14T17:00:00+09:00',
    '2024-12-14T22:00:00+09:00',
    '/covers/music-bank-2024.svg',
    'ended'
  ),

  -- Event Asli 4: The Fact Music Awards 2024
  (
    '22222222-2222-4222-8222-222222222204',
    '11111111-1111-4111-8111-111111111102',
    null,
    'The Fact Music Awards 2024',
    'the-fact-music-awards-2024',
    '8 September 2024, Kyocera Dome, Osaka. Penampilan sebagai bagian dari acara penghargaan.',
    'Kyocera Dome',
    'Osaka',
    '2024-09-08T18:00:00+09:00',
    '2024-09-08T22:00:00+09:00',
    '/covers/the-fact-2024.svg',
    'ended'
  ),

  -- Event Fiktif 5: Bunnies Gathering Jakarta (Fan-made)
  (
    '22222222-2222-4222-8222-222222222205',
    '11111111-1111-4111-8111-111111111103',
    null,
    'Bunnies Gathering Jakarta (Fan-made)',
    'bunnies-gathering-jakarta-fan-made',
    'Kumpul komunitas, games, photobooth. Acara ini bertanda Fan-made dan bersifat fiktif (bukan acara resmi). Mari bersenang-senang bareng sesama Bunnies!',
    'M Bloc Space',
    'Jakarta',
    '2027-02-14T13:00:00+07:00',
    '2027-02-14T18:00:00+07:00',
    '/covers/gathering-jakarta.svg',
    'published'
  ),

  -- Event Fiktif 6: Y2K Fit Check Market Bandung (Fan-made)
  (
    '22222222-2222-4222-8222-222222222206',
    '11111111-1111-4111-8111-111111111103',
    null,
    'Y2K Fit Check Market Bandung (Fan-made)',
    'y2k-fit-check-market-bandung-fan-made',
    'Bazaar thrift, aksesori, fashion denim. Acara ini bertanda Fan-made dan bersifat fiktif (bukan acara resmi). Temukan gaya Y2K unik dan seru!',
    'Laswee Creative Space',
    'Bandung',
    '2027-02-27T10:00:00+07:00',
    '2027-02-27T19:00:00+07:00',
    '/covers/fit-check-bandung.svg',
    'published'
  ),

  -- Event Fiktif 7: Photocard Swap & Craft Day Banyuwangi (Fan-made)
  (
    '22222222-2222-4222-8222-222222222207',
    '11111111-1111-4111-8111-111111111104',
    null,
    'Photocard Swap & Craft Day Banyuwangi (Fan-made)',
    'photocard-swap-craft-day-banyuwangi-fan-made',
    'Tukar koleksi, bikin stiker. Acara ini bertanda Fan-made dan bersifat fiktif (bukan acara resmi). Sesi santai kreasi toploader dan swap kartu favoritmu.',
    'Ruang Kreatif Banyuwangi',
    'Banyuwangi',
    '2027-03-07T11:00:00+07:00',
    '2027-03-07T17:00:00+07:00',
    '/covers/swap-craft-banyuwangi.svg',
    'published'
  )
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  description = excluded.description,
  venue = excluded.venue,
  city = excluded.city,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  cover_url = excluded.cover_url,
  status = excluded.status;

-- =============================================================================
-- 5. TICKET TYPES
-- Event Asli: price 0, remaining 0 (Sold out)
-- Event Fiktif 5: sisa < 15% kuota untuk pemicu status "Hampir Habis"
-- =============================================================================

insert into public.ticket_types (id, event_id, name, price, quota, remaining)
values
  -- Event Asli 1: Bunnies Camp
  ('33333333-3333-4333-8333-333333333301', '22222222-2222-4222-8222-222222222201', 'Arsip - Sold Out', 0, 1, 0),

  -- Event Asli 2: Bunnies Camp 2024 Tokyo Dome
  ('33333333-3333-4333-8333-333333333302', '22222222-2222-4222-8222-222222222202', 'PREMIUM', 0, 1, 0),
  ('33333333-3333-4333-8333-333333333303', '22222222-2222-4222-8222-222222222202', 'SS', 0, 1, 0),
  ('33333333-3333-4333-8333-333333333304', '22222222-2222-4222-8222-222222222202', 'S', 0, 1, 0),

  -- Event Asli 3: Music Bank Global Festival 2024
  ('33333333-3333-4333-8333-333333333305', '22222222-2222-4222-8222-222222222203', 'Arsip - Tidak dijual', 0, 1, 0),

  -- Event Asli 4: The Fact Music Awards 2024
  ('33333333-3333-4333-8333-333333333306', '22222222-2222-4222-8222-222222222204', 'Arsip - Tidak dijual', 0, 1, 0),

  -- Event Fiktif 5: Bunnies Gathering Jakarta (Fan-made) -> Remaining < 15%
  ('33333333-3333-4333-8333-333333333307', '22222222-2222-4222-8222-222222222205', 'Early Bunny', 35000, 50, 4),
  ('33333333-3333-4333-8333-333333333308', '22222222-2222-4222-8222-222222222205', 'Regular', 60000, 150, 18),
  ('33333333-3333-4333-8333-333333333309', '22222222-2222-4222-8222-222222222205', 'VIP Photobooth', 120000, 30, 2),

  -- Event Fiktif 6: Y2K Fit Check Market Bandung (Fan-made)
  ('33333333-3333-4333-8333-333333333310', '22222222-2222-4222-8222-222222222206', 'Early Bird', 15000, 80, 50),
  ('33333333-3333-4333-8333-333333333311', '22222222-2222-4222-8222-222222222206', 'Regular', 25000, 200, 160),

  -- Event Fiktif 7: Photocard Swap & Craft Day Banyuwangi (Fan-made)
  ('33333333-3333-4333-8333-333333333312', '22222222-2222-4222-8222-222222222207', 'Regular', 30000, 60, 42),
  ('33333333-3333-4333-8333-333333333313', '22222222-2222-4222-8222-222222222207', 'Craft Kit', 55000, 40, 24)
on conflict (id) do update set
  name = excluded.name,
  price = excluded.price,
  quota = excluded.quota,
  remaining = excluded.remaining;

