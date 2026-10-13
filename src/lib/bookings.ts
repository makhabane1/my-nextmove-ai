/** Bookings stored in Lovable Cloud. Visible to the person who booked and to the claimed mentor. */
import { supabase } from "@/integrations/supabase/client";

export type Booking = {
  id: string;
  mentorId: string;
  mentorName: string;
  slot: string;
  price: number;
  note: string;
  paymentStatus: "Pending payment" | "Paid (demo)";
  createdAt: string;
  review?: { rating: number; text: string };
};

type Row = {
  id: string;
  mentor_id: string;
  mentor_name: string;
  slot: string;
  price: number;
  note: string;
  payment_status: string;
  created_at: string;
  review_rating: number | null;
  review_text: string | null;
};

function map(r: Row): Booking {
  return {
    id: r.id,
    mentorId: r.mentor_id,
    mentorName: r.mentor_name,
    slot: r.slot,
    price: r.price,
    note: r.note,
    paymentStatus: r.payment_status === "Paid (demo)" ? "Paid (demo)" : "Pending payment",
    createdAt: r.created_at,
    review: r.review_rating ? { rating: r.review_rating, text: r.review_text ?? "" } : undefined,
  };
}

export async function readBookings(mentorId?: string): Promise<Booking[]> {
  let q = supabase.from("bookings").select("*").order("created_at", { ascending: false });
  if (mentorId) q = q.eq("mentor_id", mentorId);
  const { data, error } = await q;
  if (error) throw error;
  return (data as Row[]).map(map);
}

export async function addBooking(b: Omit<Booking, "id" | "createdAt" | "paymentStatus" | "review">) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Please sign in to book.");
  const { error } = await supabase.from("bookings").insert({
    user_id: u.user.id,
    mentor_id: b.mentorId,
    mentor_name: b.mentorName,
    slot: b.slot,
    price: b.price,
    note: b.note,
  });
  if (error) throw error;
}

export async function markPaid(id: string) {
  const { error } = await supabase.from("bookings").update({ payment_status: "Paid (demo)" }).eq("id", id);
  if (error) throw error;
}

export async function addReview(id: string, rating: number, text: string) {
  const { error } = await supabase
    .from("bookings")
    .update({ review_rating: rating, review_text: text })
    .eq("id", id);
  if (error) throw error;
}

export async function getMyMentorId(): Promise<string | null> {
  const { data } = await supabase.from("mentor_accounts").select("mentor_id").maybeSingle();
  return data?.mentor_id ?? null;
}

export async function claimMentor(mentorId: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Please sign in first.");
  await supabase.from("mentor_accounts").delete().eq("user_id", u.user.id);
  const { error } = await supabase.from("mentor_accounts").insert({ user_id: u.user.id, mentor_id: mentorId });
  if (error) throw new Error(error.code === "23505" ? "That mentor profile is already claimed." : error.message);
}
