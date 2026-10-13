CREATE TABLE public.mentor_accounts (
  user_id uuid PRIMARY KEY,
  mentor_id text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.mentor_accounts TO authenticated;
GRANT ALL ON public.mentor_accounts TO service_role;
ALTER TABLE public.mentor_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own mentor link read" ON public.mentor_accounts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own mentor link insert" ON public.mentor_accounts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own mentor link delete" ON public.mentor_accounts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  mentor_id text NOT NULL,
  mentor_name text NOT NULL,
  slot text NOT NULL,
  price integer NOT NULL,
  note text NOT NULL DEFAULT '',
  payment_status text NOT NULL DEFAULT 'Pending payment',
  review_rating integer,
  review_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_mentor_for(_mentor_id text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.mentor_accounts WHERE user_id = auth.uid() AND mentor_id = _mentor_id)
$$;

CREATE POLICY "booker or mentor reads" ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_mentor_for(mentor_id));
CREATE POLICY "booker inserts" ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND payment_status = 'Pending payment' AND review_rating IS NULL);
CREATE POLICY "booker updates" ON public.bookings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "booker deletes" ON public.bookings FOR DELETE TO authenticated USING (auth.uid() = user_id);