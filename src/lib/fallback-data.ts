import type { Category, EventItem } from "@/types/database";

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    name: "Fan Meeting",
    slug: "fan-meeting",
    emoji: "🐰",
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    name: "Festival & Awards",
    slug: "festival-awards",
    emoji: "🏆",
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    name: "Fan-made Event",
    slug: "fan-made-event",
    emoji: "💙",
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    name: "Workshop Kreatif",
    slug: "workshop-kreatif",
    emoji: "✂️",
  },
];

export const FALLBACK_EVENTS: EventItem[] = [
  // 1. Bunnies Camp (Event Asli, Ended)
  {
    id: "22222222-2222-4222-8222-222222222201",
    category_id: "11111111-1111-4111-8111-111111111101",
    organizer_id: "00000000-0000-0000-0000-000000000000",
    title: "Bunnies Camp",
    slug: "bunnies-camp",
    description:
      "Tanggal 1-2 Juli 2023, SK Olympic Handball Gymnasium, Seoul. Fan meeting pertama NewJeans. Tidak ada info harga terverifikasi, jangan menulis harga.",
    venue: "SK Olympic Handball Gymnasium",
    city: "Seoul",
    starts_at: "2023-07-01T18:00:00+09:00",
    ends_at: "2023-07-02T21:00:00+09:00",
    cover_url: "/covers/bunnies-camp-2023.svg",
    status: "ended",
    created_at: "2023-07-01T10:00:00Z",
    categories: FALLBACK_CATEGORIES[0],
    ticket_types: [
      {
        id: "33333333-3333-4333-8333-333333333301",
        event_id: "22222222-2222-4222-8222-222222222201",
        name: "Arsip - Sold Out",
        price: 0,
        quota: 1,
        remaining: 0,
        created_at: "2023-07-01T10:00:00Z",
      },
    ],
  },

  // 2. Bunnies Camp 2024 Tokyo Dome (Event Asli, Ended)
  {
    id: "22222222-2222-4222-8222-222222222202",
    category_id: "11111111-1111-4111-8111-111111111101",
    organizer_id: "00000000-0000-0000-0000-000000000000",
    title: "Bunnies Camp 2024 Tokyo Dome",
    slug: "bunnies-camp-2024-tokyo-dome",
    description:
      "Tanggal 26-27 Juni 2024, Tokyo Dome, Tokyo. Fan meeting kedua dan penampilan solo pertama di Jepang. Tiket sold out kedua hari. Bintang tamu: YOASOBI dan Rina Sawayama. Kursi pandangan terbatas dibuka karena permintaan tinggi.\n\nHarga tiket resmi saat penyelenggaraan:\n• PREMIUM: ¥22.000 (sudah termasuk pajak)\n• SS: ¥15.000 (sudah termasuk pajak)\n• S: ¥13.000 (sudah termasuk pajak)",
    venue: "Tokyo Dome",
    city: "Tokyo",
    starts_at: "2024-06-26T18:00:00+09:00",
    ends_at: "2024-06-27T21:00:00+09:00",
    cover_url: "/covers/bunnies-camp-2024-tokyo.svg",
    status: "ended",
    created_at: "2024-06-26T10:00:00Z",
    categories: FALLBACK_CATEGORIES[0],
    ticket_types: [
      {
        id: "33333333-3333-4333-8333-333333333302",
        event_id: "22222222-2222-4222-8222-222222222202",
        name: "PREMIUM",
        price: 0,
        quota: 1,
        remaining: 0,
        created_at: "2024-06-26T10:00:00Z",
      },
      {
        id: "33333333-3333-4333-8333-333333333303",
        event_id: "22222222-2222-4222-8222-222222222202",
        name: "SS",
        price: 0,
        quota: 1,
        remaining: 0,
        created_at: "2024-06-26T10:00:00Z",
      },
      {
        id: "33333333-3333-4333-8333-333333333304",
        event_id: "22222222-2222-4222-8222-222222222202",
        name: "S",
        price: 0,
        quota: 1,
        remaining: 0,
        created_at: "2024-06-26T10:00:00Z",
      },
    ],
  },

  // 3. Music Bank Global Festival 2024 (Event Asli, Ended)
  {
    id: "22222222-2222-4222-8222-222222222203",
    category_id: "11111111-1111-4111-8111-111111111102",
    organizer_id: "00000000-0000-0000-0000-000000000000",
    title: "Music Bank Global Festival 2024",
    slug: "music-bank-global-festival-2024",
    description:
      "14 Desember 2024, Fukuoka Dome, Fukuoka. Penampilan sebagai bagian dari festival, bukan konser tunggal.",
    venue: "Fukuoka Dome",
    city: "Fukuoka",
    starts_at: "2024-12-14T17:00:00+09:00",
    ends_at: "2024-12-14T22:00:00+09:00",
    cover_url: "/covers/music-bank-2024.svg",
    status: "ended",
    created_at: "2024-12-14T10:00:00Z",
    categories: FALLBACK_CATEGORIES[1],
    ticket_types: [
      {
        id: "33333333-3333-4333-8333-333333333305",
        event_id: "22222222-2222-4222-8222-222222222203",
        name: "Arsip - Tidak dijual",
        price: 0,
        quota: 1,
        remaining: 0,
        created_at: "2024-12-14T10:00:00Z",
      },
    ],
  },

  // 4. The Fact Music Awards 2024 (Event Asli, Ended)
  {
    id: "22222222-2222-4222-8222-222222222204",
    category_id: "11111111-1111-4111-8111-111111111102",
    organizer_id: "00000000-0000-0000-0000-000000000000",
    title: "The Fact Music Awards 2024",
    slug: "the-fact-music-awards-2024",
    description:
      "8 September 2024, Kyocera Dome, Osaka. Penampilan sebagai bagian dari acara penghargaan.",
    venue: "Kyocera Dome",
    city: "Osaka",
    starts_at: "2024-09-08T18:00:00+09:00",
    ends_at: "2024-09-08T22:00:00+09:00",
    cover_url: "/covers/the-fact-2024.svg",
    status: "ended",
    created_at: "2024-09-08T10:00:00Z",
    categories: FALLBACK_CATEGORIES[1],
    ticket_types: [
      {
        id: "33333333-3333-4333-8333-333333333306",
        event_id: "22222222-2222-4222-8222-222222222204",
        name: "Arsip - Tidak dijual",
        price: 0,
        quota: 1,
        remaining: 0,
        created_at: "2024-09-08T10:00:00Z",
      },
    ],
  },

  // 5. Bunnies Gathering Jakarta (Fan-made) - Event Fiktif, Published
  {
    id: "22222222-2222-4222-8222-222222222205",
    category_id: "11111111-1111-4111-8111-111111111103",
    organizer_id: "00000000-0000-0000-0000-000000000000",
    title: "Bunnies Gathering Jakarta (Fan-made)",
    slug: "bunnies-gathering-jakarta-fan-made",
    description:
      "Kumpul komunitas, games, photobooth. Acara ini bertanda Fan-made dan bersifat fiktif (bukan acara resmi). Mari bersenang-senang bareng sesama Bunnies!",
    venue: "M Bloc Space",
    city: "Jakarta",
    starts_at: "2027-02-14T13:00:00+07:00",
    ends_at: "2027-02-14T18:00:00+07:00",
    cover_url: "/covers/gathering-jakarta.svg",
    status: "published",
    created_at: "2026-10-01T10:00:00Z",
    categories: FALLBACK_CATEGORIES[2],
    ticket_types: [
      {
        id: "33333333-3333-4333-8333-333333333307",
        event_id: "22222222-2222-4222-8222-222222222205",
        name: "Early Bunny",
        price: 35000,
        quota: 50,
        remaining: 4,
        created_at: "2026-10-01T10:00:00Z",
      },
      {
        id: "33333333-3333-4333-8333-333333333308",
        event_id: "22222222-2222-4222-8222-222222222205",
        name: "Regular",
        price: 60000,
        quota: 150,
        remaining: 18,
        created_at: "2026-10-01T10:00:00Z",
      },
      {
        id: "33333333-3333-4333-8333-333333333309",
        event_id: "22222222-2222-4222-8222-222222222205",
        name: "VIP Photobooth",
        price: 120000,
        quota: 30,
        remaining: 2,
        created_at: "2026-10-01T10:00:00Z",
      },
    ],
  },

  // 6. Y2K Fit Check Market Bandung (Fan-made) - Event Fiktif, Published
  {
    id: "22222222-2222-4222-8222-222222222206",
    category_id: "11111111-1111-4111-8111-111111111103",
    organizer_id: "00000000-0000-0000-0000-000000000000",
    title: "Y2K Fit Check Market Bandung (Fan-made)",
    slug: "y2k-fit-check-market-bandung-fan-made",
    description:
      "Bazaar thrift, aksesori, fashion denim. Acara ini bertanda Fan-made dan bersifat fiktif (bukan acara resmi). Temukan gaya Y2K unik dan seru!",
    venue: "Laswee Creative Space",
    city: "Bandung",
    starts_at: "2027-02-27T10:00:00+07:00",
    ends_at: "2027-02-27T19:00:00+07:00",
    cover_url: "/covers/fit-check-bandung.svg",
    status: "published",
    created_at: "2026-10-02T10:00:00Z",
    categories: FALLBACK_CATEGORIES[2],
    ticket_types: [
      {
        id: "33333333-3333-4333-8333-333333333310",
        event_id: "22222222-2222-4222-8222-222222222206",
        name: "Early Bird",
        price: 15000,
        quota: 80,
        remaining: 50,
        created_at: "2026-10-02T10:00:00Z",
      },
      {
        id: "33333333-3333-4333-8333-333333333311",
        event_id: "22222222-2222-4222-8222-222222222206",
        name: "Regular",
        price: 25000,
        quota: 200,
        remaining: 160,
        created_at: "2026-10-02T10:00:00Z",
      },
    ],
  },

  // 7. Photocard Swap & Craft Day Banyuwangi (Fan-made) - Event Fiktif, Published
  {
    id: "22222222-2222-4222-8222-222222222207",
    category_id: "11111111-1111-4111-8111-111111111104",
    organizer_id: "00000000-0000-0000-0000-000000000000",
    title: "Photocard Swap & Craft Day Banyuwangi (Fan-made)",
    slug: "photocard-swap-craft-day-banyuwangi-fan-made",
    description:
      "Tukar koleksi, bikin stiker. Acara ini bertanda Fan-made dan bersifat fiktif (bukan acara resmi). Sesi santai kreasi toploader dan swap kartu favoritmu.",
    venue: "Ruang Kreatif Banyuwangi",
    city: "Banyuwangi",
    starts_at: "2027-03-07T11:00:00+07:00",
    ends_at: "2027-03-07T17:00:00+07:00",
    cover_url: "/covers/swap-craft-banyuwangi.svg",
    status: "published",
    created_at: "2026-10-03T10:00:00Z",
    categories: FALLBACK_CATEGORIES[3],
    ticket_types: [
      {
        id: "33333333-3333-4333-8333-333333333312",
        event_id: "22222222-2222-4222-8222-222222222207",
        name: "Regular",
        price: 30000,
        quota: 60,
        remaining: 42,
        created_at: "2026-10-03T10:00:00Z",
      },
      {
        id: "33333333-3333-4333-8333-333333333313",
        event_id: "22222222-2222-4222-8222-222222222207",
        name: "Craft Kit",
        price: 55000,
        quota: 40,
        remaining: 24,
        created_at: "2026-10-03T10:00:00Z",
      },
    ],
  },
];
