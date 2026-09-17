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
import { AdminAuthPanel } from '@/pages/admin/AdminAuthPanel';
import { AdminPanel } from '@/pages/admin/AdminPanel';

const defaultPracticeAreas = [
  { slug: 'corporate-commercial', title: 'Corporate & Commercial', summary: 'Practical legal counsel for companies, shareholders and directors at every stage of growth.', body: 'We advise on company formation, shareholder agreements, mergers and acquisitions, joint ventures, corporate governance and regulatory compliance. Our approach is commercial and pragmatic, helping clients navigate complex transactions with confidence.', display_order: 1, is_published: true, locale: 'en' },
  { slug: 'banking-finance', title: 'Banking & Finance', summary: 'Clear, commercially focused advice for lenders, borrowers, funds and financial institutions.', body: 'Our banking and finance practice covers loan agreements, security documentation, project finance, debt restructuring and regulatory matters. We act for major banks, financial institutions and corporate borrowers.', display_order: 2, is_published: true, locale: 'en' },
  { slug: 'dispute-resolution', title: 'Dispute Resolution', summary: 'Strategic representation for complex disputes, investigations and high-stakes litigation.', body: 'We represent clients in commercial litigation, arbitration, mediation and regulatory investigations. Our lawyers combine courtroom experience with a strategic approach aimed at resolving disputes efficiently and effectively.', display_order: 3, is_published: true, locale: 'en' },
  { slug: 'insolvency-restructuring', title: 'Insolvency & Restructuring', summary: 'Calm guidance through financial difficulty, restructuring and recovery.', body: 'We advise insolvency practitioners, creditors, directors and companies on all aspects of insolvency, restructuring and recovery, including administrations, liquidations and schemes of arrangement.', display_order: 4, is_published: true, locale: 'en' },
  { slug: 'real-estate', title: 'Real Estate', summary: 'Confident support for acquisitions, developments, leases and property disputes.', body: 'Our real estate practice covers commercial and residential property transactions, development agreements, leasing, planning and property disputes. We act for developers, investors, landlords and tenants.', display_order: 5, is_published: true, locale: 'en' },
  { slug: 'employment', title: 'Employment', summary: 'Thoughtful advice for employers, executives and the changing world of work.', body: 'We advise on employment contracts, policies, dismissals, redundancies, discrimination claims and workplace investigations. We act for employers and senior executives, helping navigate the complexities of employment law.', display_order: 6, is_published: true, locale: 'en' },
];

const defaultPosts = [
  { slug: 'building-resilient-business', title: 'Building a resilient business in an uncertain world', excerpt: 'Good advice is not only about resolving problems but about seeing them early enough to choose a better path.', body: 'In an era of rapid regulatory change and economic uncertainty, businesses need legal partners who can help them anticipate risks before they materialise. This article explores practical strategies for building legal resilience into your business operations, from contract management to regulatory monitoring.', category: 'Perspective', author_name: 'Tornaritis Law Firm', is_published: true, published_at: new Date('2024-09-12').toISOString(), locale: 'en' },
  { slug: 'regulatory-changes-employers', title: 'What the latest regulatory changes mean for employers', excerpt: 'A practical summary of the key regulatory developments affecting employers and what they should do now.', body: 'Recent regulatory changes have introduced new obligations for employers across several areas. This update summarises the key developments and outlines the practical steps employers should take to ensure compliance.', category: 'Legal update', author_name: 'Tornaritis Law Firm', is_published: true, published_at: new Date('2024-08-28').toISOString(), locale: 'en' },
  { slug: 'clear-strategy-before-dispute', title: 'The value of a clear strategy before a dispute begins', excerpt: 'How early strategic planning can prevent disputes from escalating and deliver better outcomes.', body: 'The most effective dispute resolution often happens before a dispute formally begins. This case study examines how early strategic planning and proactive legal advice helped a client achieve a favourable outcome without costly litigation.', category: 'Case study', author_name: 'Tornaritis Law Firm', is_published: true, published_at: new Date('2024-07-04').toISOString(), locale: 'en' },
];

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
      setSeeded(true);
    };

    seedAndFetch();
  }, []);

  useEffect(() => {
    if (!seeded) return;
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
  }, [seeded]);

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
