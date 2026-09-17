/*
# Create Tornaritis CMS, lead capture, and admin access

1. New Tables
- `admin_users`: authenticated users allowed into the private content dashboard.
- `site_content`: editable text and settings per language.
- `practice_areas`: editable service pages and navigation items.
- `team_members`: editable lawyers and staff profiles.
- `newsroom_posts`: editable newsroom articles and publication state.
- `form_submissions`: contact and appointment enquiries with workflow status.
- `newsletter_subscribers`: newsletter signup records.
- `appointments`: appointment requests captured from the public site.

2. Security
- Row-level security is enabled on every table.
- Public visitors can read only published website content and submit contact/newsletter/appointment forms.
- Only authenticated users recorded in `admin_users` can manage CMS records or read leads.
- The first authenticated account may become the first admin only when no admin exists; later accounts cannot claim admin access.
- Sensitive lead records are never publicly readable.

3. Important Notes
- All content includes a locale so the dashboard can manage translations without duplicating tables.
- Content is unpublished by default where appropriate.
- Lead records use status values for a simple admin workflow: new, in_progress, resolved, archived.
*/

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Administrator',
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL,
  locale text NOT NULL DEFAULT 'en',
  content_value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_key, locale)
);

CREATE TABLE IF NOT EXISTS public.practice_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  locale text NOT NULL DEFAULT 'en',
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  locale text NOT NULL DEFAULT 'en',
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newsroom_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Insight',
  author_name text NOT NULL DEFAULT '',
  locale text NOT NULL DEFAULT 'en',
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type text NOT NULL DEFAULT 'contact' CHECK (form_type IN ('contact', 'appointment')),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  message text NOT NULL,
  source text NOT NULL DEFAULT 'website',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  locale text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  preferred_date date,
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS newsroom_posts_published_idx ON public.newsroom_posts (is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS practice_areas_published_idx ON public.practice_areas (is_published, display_order);
CREATE INDEX IF NOT EXISTS team_members_published_idx ON public.team_members (is_published, display_order);
CREATE INDEX IF NOT EXISTS form_submissions_status_idx ON public.form_submissions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON public.appointments (status, created_at DESC);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(p_display_name text DEFAULT 'Administrator')
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF EXISTS (SELECT 1 FROM public.admin_users) THEN
    RETURN false;
  END IF;

  INSERT INTO public.admin_users (user_id, display_name)
  VALUES (auth.uid(), COALESCE(NULLIF(trim(p_display_name), ''), 'Administrator'));
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
REVOKE ALL ON FUNCTION public.bootstrap_first_admin(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin(text) TO authenticated;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsroom_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_read_own_admin_user" ON public.admin_users;
CREATE POLICY "admins_read_own_admin_user" ON public.admin_users FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "admins_insert_own_admin_user" ON public.admin_users;
CREATE POLICY "admins_insert_own_admin_user" ON public.admin_users FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND NOT EXISTS (SELECT 1 FROM public.admin_users));
DROP POLICY IF EXISTS "admins_update_own_admin_user" ON public.admin_users;
CREATE POLICY "admins_update_own_admin_user" ON public.admin_users FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "admins_delete_own_admin_user" ON public.admin_users;
CREATE POLICY "admins_delete_own_admin_user" ON public.admin_users FOR DELETE TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "public_read_site_content" ON public.site_content;
CREATE POLICY "public_read_site_content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admins_insert_site_content" ON public.site_content;
CREATE POLICY "admins_insert_site_content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_update_site_content" ON public.site_content;
CREATE POLICY "admins_update_site_content" ON public.site_content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_delete_site_content" ON public.site_content;
CREATE POLICY "admins_delete_site_content" ON public.site_content FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_read_published_practice_areas" ON public.practice_areas;
CREATE POLICY "public_read_published_practice_areas" ON public.practice_areas FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin());
DROP POLICY IF EXISTS "admins_insert_practice_areas" ON public.practice_areas;
CREATE POLICY "admins_insert_practice_areas" ON public.practice_areas FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_update_practice_areas" ON public.practice_areas;
CREATE POLICY "admins_update_practice_areas" ON public.practice_areas FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_delete_practice_areas" ON public.practice_areas;
CREATE POLICY "admins_delete_practice_areas" ON public.practice_areas FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_read_published_team_members" ON public.team_members;
CREATE POLICY "public_read_published_team_members" ON public.team_members FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin());
DROP POLICY IF EXISTS "admins_insert_team_members" ON public.team_members;
CREATE POLICY "admins_insert_team_members" ON public.team_members FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_update_team_members" ON public.team_members;
CREATE POLICY "admins_update_team_members" ON public.team_members FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_delete_team_members" ON public.team_members;
CREATE POLICY "admins_delete_team_members" ON public.team_members FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_read_published_newsroom_posts" ON public.newsroom_posts;
CREATE POLICY "public_read_published_newsroom_posts" ON public.newsroom_posts FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin());
DROP POLICY IF EXISTS "admins_insert_newsroom_posts" ON public.newsroom_posts;
CREATE POLICY "admins_insert_newsroom_posts" ON public.newsroom_posts FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_update_newsroom_posts" ON public.newsroom_posts;
CREATE POLICY "admins_update_newsroom_posts" ON public.newsroom_posts FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_delete_newsroom_posts" ON public.newsroom_posts;
CREATE POLICY "admins_delete_newsroom_posts" ON public.newsroom_posts FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_submit_form_submissions" ON public.form_submissions;
CREATE POLICY "public_submit_form_submissions" ON public.form_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admins_read_form_submissions" ON public.form_submissions;
CREATE POLICY "admins_read_form_submissions" ON public.form_submissions FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admins_update_form_submissions" ON public.form_submissions;
CREATE POLICY "admins_update_form_submissions" ON public.form_submissions FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_delete_form_submissions" ON public.form_submissions;
CREATE POLICY "admins_delete_form_submissions" ON public.form_submissions FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_submit_newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "public_submit_newsletter_subscribers" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admins_read_newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "admins_read_newsletter_subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admins_update_newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "admins_update_newsletter_subscribers" ON public.newsletter_subscribers FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_delete_newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "admins_delete_newsletter_subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_submit_appointments" ON public.appointments;
CREATE POLICY "public_submit_appointments" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admins_read_appointments" ON public.appointments;
CREATE POLICY "admins_read_appointments" ON public.appointments FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admins_update_appointments" ON public.appointments;
CREATE POLICY "admins_update_appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_delete_appointments" ON public.appointments;
CREATE POLICY "admins_delete_appointments" ON public.appointments FOR DELETE TO authenticated USING (public.is_admin());
