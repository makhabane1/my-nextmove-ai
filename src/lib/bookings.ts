/** Local-only booking store so the flow works end-to-end before a backend exists. */

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

const KEY = "nextmove.bookings.v1";

export function readBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

function write(list: Booking[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function addBooking(b: Omit<Booking, "id" | "createdAt">): Booking {
  const booking: Booking = {
    ...b,
    id: `bk-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  write([booking, ...readBookings()]);
  return booking;
}

export function markPaid(id: string) {
  write(
    readBookings().map((b) => (b.id === id ? { ...b, paymentStatus: "Paid (demo)" as const } : b)),
  );
}

export function addReview(id: string, rating: number, text: string) {
  write(readBookings().map((b) => (b.id === id ? { ...b, review: { rating, text } } : b)));
}
