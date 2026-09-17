import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';
import { parseRoute, navigateTo } from '@/lib/router';
import type { AppRoute, PracticeArea, NewsroomPost, TeamMember } from '@/lib/types';
import { SiteHeader, SiteFooter } from '@/components/SiteLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { PracticePage, PracticeDetailPage } from '@/pages/PracticePages';
import { NewsroomPage, NewsDetailPage } from '@/pages/NewsroomPages';
import { TeamPage } from '@/pages/TeamPage';
import { ContactPage } from '@/pages/ContactPage';
import { LegalPage } from '@/pages/LegalPage';
import { AdminAuthPanel } from '@/pages/admin/AdminAuthPanel';
import { AdminPanel } from '@/pages/admin/AdminPanel';
import { defaultPosts, defaultPracticeAreas, defaultTeamMembers } from '@/lib/defaultContent';

function App() {
  const { session, loading: authLoading, signOut } = useAuth();
  const [route, setRoute] = useState<AppRoute>(parseRoute());
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [newsroomPosts, setNewsroomPosts] = useState<NewsroomPost[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const handlePopState = () => setRoute(parseRoute());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const seedAndFetch = async () => {
      const { count: areaCount } = await supabase.from('practice_areas').select('*', { count: 'exact', head: true });
      if ((areaCount ?? 0) === 0) {
        await supabase.from('practice_areas').insert(defaultPracticeAreas);
      }

      const { count: postCount } = await supabase.from('newsroom_posts').select('*', { count: 'exact', head: true });
      if ((postCount ?? 0) === 0) {
        await supabase.from('newsroom_posts').insert(defaultPosts);
      }

      const { count: teamCount } = await supabase.from('team_members').select('*', { count: 'exact', head: true });
      if ((teamCount ?? 0) === 0) {
        await supabase.from('team_members').insert(defaultTeamMembers);
      }
      setSeeded(true);
    };

    seedAndFetch();
  }, []);

  useEffect(() => {
    if (!seeded || route.page === 'admin') return;
    const fetchAll = async () => {
      setDataLoading(true);
      const [areas, posts, team] = await Promise.all([
        supabase.from('practice_areas').select('*').eq('is_published', true).order('display_order'),
        supabase.from('newsroom_posts').select('*').eq('is_published', true).order('published_at', { ascending: false }),
        supabase.from('team_members').select('*').eq('is_published', true).order('display_order'),
      ]);
      setPracticeAreas(areas.data ?? []);
      setNewsroomPosts(posts.data ?? []);
      setTeamMembers(team.data ?? []);
      setDataLoading(false);
    };
    fetchAll();
  }, [seeded, route.page]);

  if (route.page === 'admin') {
    if (authLoading) {
      return <div className="flex min-h-screen items-center justify-center bg-[#0f1113] text-white"><p className="text-sm uppercase tracking-[0.2em] text-[#df8eae]">Loading...</p></div>;
    }
    if (!session) {
      return <AdminAuthPanel onSignedIn={() => window.location.reload()} />;
    }
    return <AdminPanel session={session} onSignOut={signOut} />;
  }

  if (dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm uppercase tracking-[0.2em] text-[#687277]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#15191c]">
      <SiteHeader currentPage={route.page} practiceAreas={practiceAreas} />
      {route.page === 'home' && <HomePage practiceAreas={practiceAreas} newsroomPosts={newsroomPosts} />}
      {route.page === 'about' && <AboutPage />}
      {route.page === 'practice' && <PracticePage practiceAreas={practiceAreas} />}
      {route.page === 'practice-detail' && (() => {
        const area = practiceAreas.find((a) => a.slug === route.slug);
        if (!area) {
          return <NotFound onHome={() => navigateTo('/')} />;
        }
        return <PracticeDetailPage area={area} otherAreas={practiceAreas} />;
      })()}
      {route.page === 'newsroom' && <NewsroomPage posts={newsroomPosts} />}
      {route.page === 'news-detail' && (() => {
        const post = newsroomPosts.find((p) => p.slug === route.slug);
        if (!post) {
          return <NotFound onHome={() => navigateTo('/newsroom')} />;
        }
        return <NewsDetailPage post={post} otherPosts={newsroomPosts} />;
      })()}
      {route.page === 'team' && <TeamPage members={teamMembers} />}
      {route.page === 'contact' && <ContactPage />}
      {route.page === 'legal' && <LegalPage slug={route.slug} />}
      <SiteFooter />
    </div>
  );
}

function NotFound({ onHome }: { onHome: () => void }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="font-serif text-6xl text-[#273237]">404</p>
        <p className="mt-4 text-sm text-[#687277]">This page could not be found.</p>
        <button
          onClick={onHome}
          className="mt-6 bg-[#b90046] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[#930038]"
        >
          Go back
        </button>
      </div>
    </main>
  );
}

export default App;
