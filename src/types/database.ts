export type UserRole = "member" | "admin";
export type EventStatus = "draft" | "published" | "ended";
export type OrderStatus = "paid" | "cancelled";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  price: number;
  quota: number;
  remaining: number;
  created_at: string;
}

export interface EventItem {
  id: string;
  category_id: string;
  organizer_id: string;
  title: string;
  slug: string;
  description: string;
  venue: string;
  city: string;
  starts_at: string;
  ends_at: string;
  cover_url: string | null;
  status: EventStatus;
  created_at: string;
  categories?: Category | null;
  profiles?: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
  ticket_types?: TicketType[];
}

export interface Order {
  id: string;
  user_id: string;
  event_id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  events?: EventItem | null;
  profiles?: Profile | null;
  tickets?: Ticket[];
}

export interface Ticket {
  id: string;
  order_id: string;
  ticket_type_id: string;
  code: string;
  checked_in_at: string | null;
  orders?: Order | null;
  ticket_types?: TicketType | null;
}

