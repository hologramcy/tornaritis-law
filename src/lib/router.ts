import type { AppRoute, Page } from '@/lib/types';

export function parseRoute(): AppRoute {
  const path = window.location.pathname.replace(/\/$/, '');
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) return { page: 'home' as Page };
  if (parts[0] === 'about' || parts[0] === 'the-firm') return { page: 'about' as Page };
  if (parts[0] === 'practice-areas' || parts[0] === 'expertise') {
    if (parts[1]) return { page: 'practice-detail' as Page, slug: parts[1] };
    return { page: 'practice' as Page };
  }
  if (parts[0] === 'newsroom' || parts[0] === 'insights') {
    if (parts[1]) return { page: 'news-detail' as Page, slug: parts[1] };
    return { page: 'newsroom' as Page };
  }
  if (parts[0] === 'team' || parts[0] === 'people') return { page: 'team' as Page };
  if (parts[0] === 'contact') return { page: 'contact' as Page };
  if (parts[0] === 'admin') return { page: 'admin' as Page };
  return { page: 'home' as Page };
}

export function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
