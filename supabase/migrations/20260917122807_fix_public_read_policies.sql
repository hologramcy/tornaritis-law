-- Fix: public read policies referenced is_admin() which anon can't execute,
-- causing 401 errors on every public page load.
-- Solution: split into a simple public policy (published only) and a
-- separate admin policy (all rows, via is_admin()).

-- ── practice_areas ──
DROP POLICY IF EXISTS "public_read_published_practice_areas" ON practice_areas;
DROP POLICY IF EXISTS "admins_read_practice_areas" ON practice_areas;

CREATE POLICY "public_read_published_practice_areas"
  ON practice_areas FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "admins_read_practice_areas"
  ON practice_areas FOR SELECT
  TO authenticated
  USING (is_admin());

-- ── newsroom_posts ──
DROP POLICY IF EXISTS "public_read_published_newsroom_posts" ON newsroom_posts;
DROP POLICY IF EXISTS "admins_read_newsroom_posts" ON newsroom_posts;

CREATE POLICY "public_read_published_newsroom_posts"
  ON newsroom_posts FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "admins_read_newsroom_posts"
  ON newsroom_posts FOR SELECT
  TO authenticated
  USING (is_admin());

-- ── team_members ──
DROP POLICY IF EXISTS "public_read_published_team_members" ON team_members;
DROP POLICY IF EXISTS "admins_read_team_members" ON team_members;

CREATE POLICY "public_read_published_team_members"
  ON team_members FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "admins_read_team_members"
  ON team_members FOR SELECT
  TO authenticated
  USING (is_admin());

-- ── site_content (same issue: was using "true" but also accessible to anon — leave as is) ──
