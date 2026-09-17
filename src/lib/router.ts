import type { AppRoute, Page } from '@/lib/types';

export function parseRoute(): AppRoute {
  const path = window.location.pathname.replace(/\/$/, '');
  const parts = path.split('/').filter(Boolean);
  const legacyPracticeSlugs = new Set([
    'banking-finance',
    'corporate-law',
    'funds',
    'due-diligence',
    'electronic-money-institution',
    'emi',
    'taxation',
    'fiduciary-services',
    'financial-services-regulatory',
    'litigation',
    'oil-gas',
    'payment-institutions',
    'real-estate',
    'shipping-admiralty-law',
    'technology-ecommerce',
    'immigration-law',
    'data-privacy',
  ]);
  const legalSlugs = new Set(['privacy-policy', 'disclaimer', 'careers']);

  if (parts.length === 0) return { page: 'home' as Page };
  if (parts[0] === 'about' || parts[0] === 'the-firm' || parts[0] === 'our-story' || parts[0] === 'the-difference') return { page: 'about' as Page };
  if (parts[0] === 'practice-areas' || parts[0] === 'expertise') {
    if (parts[1]) return { page: 'practice-detail' as Page, slug: parts[1] };
    return { page: 'practice' as Page };
  }
  if (parts[0] === 'newsroom' || parts[0] === 'insights') {
    if (parts[1]) return { page: 'news-detail' as Page, slug: parts[1] };
    return { page: 'newsroom' as Page };
  }
  if (legacyPracticeSlugs.has(parts[0])) return { page: 'practice-detail' as Page, slug: parts[0] === 'emi' ? 'electronic-money-institution' : parts[0] };
  if (parts[0] === 'team' || parts[0] === 'people' || parts[0] === 'the-team') return { page: 'team' as Page };
  if (parts[0] === 'contact') return { page: 'contact' as Page };
  if (legalSlugs.has(parts[0])) return { page: 'legal' as Page, slug: parts[0] };
  if (parts[0] === 'admin') return { page: 'admin' as Page };
  return { page: 'home' as Page };
}

export function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
