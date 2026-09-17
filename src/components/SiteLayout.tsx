import { useState, useEffect } from 'react';
import { ChevronDown, Menu, Search, X, ArrowRight, Linkedin, Twitter, Mail } from 'lucide-react';
import type { Page, PracticeArea } from '@/lib/types';
import { navigateTo } from '@/lib/router';
import { supabase } from '@/lib/supabase';

type NavItem = {
  label: string;
  page: Page;
  path: string;
  children?: { label: string; path: string }[];
};

type HeaderProps = {
  currentPage: Page;
  practiceAreas: PracticeArea[];
};

export function SiteHeader({ currentPage, practiceAreas }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: 'About Us', page: 'about', path: '/about' },
    {
      label: 'Practice Areas',
      page: 'practice',
      path: '/practice-areas',
      children: practiceAreas.map((area) => ({ label: area.title, path: `/practice-areas/${area.slug}` })),
    },
    { label: 'The Newsroom', page: 'newsroom', path: '/newsroom' },
    { label: 'The Team', page: 'team', path: '/team' },
    { label: 'Contact', page: 'contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[#e7e9ea] bg-white/90 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-white'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-6 transition-all duration-300 lg:px-12">
        <button onClick={() => navigateTo('/')} className="shrink-0 transition-transform hover:scale-[1.02]" aria-label="Tornaritis Law Firm home">
          <img src="/Tornaritis-Law-Firm-Logo-Revised.png" alt="Tornaritis Law Firm" className="h-auto w-[175px] sm:w-[230px]" />
        </button>

        <nav className="hidden items-center gap-1 text-[13px] font-medium text-[#252a2d] lg:flex">
          {navItems.map((item) => (
            <div
              key={item.path}
              className="relative"
              onMouseEnter={() => item.children && setDropdownOpen(true)}
              onMouseLeave={() => item.children && setDropdownOpen(false)}
            >
              <button
                onClick={() => navigateTo(item.path)}
                className={`group flex items-center gap-1 rounded-md px-3 py-2 transition-colors ${
                  currentPage === item.page || (item.page === 'practice' && currentPage === 'practice-detail')
                    ? 'text-[#b90046]'
                    : 'hover:text-[#b90046]'
                }`}
              >
                {item.label}
                {item.children && <ChevronDown size={13} className={`text-[#6b7377] transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />}
              </button>
              {item.children && dropdownOpen && (
                <div className="absolute left-0 top-full z-50 w-72 overflow-hidden rounded-lg border border-[#e7e9ea] bg-white py-2 shadow-2xl shadow-black/5 animate-scale-in origin-top-left">
                  {item.children.map((child) => (
                    <button
                      key={child.path}
                      onClick={() => {
                        navigateTo(child.path);
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-5 py-2.5 text-left text-sm text-[#3b4246] transition-colors hover:bg-[#fdf0f5] hover:text-[#b90046]"
                    >
                      {child.label}
                      <ArrowRight size={13} className="opacity-0 transition-opacity hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Search" className="hidden rounded-md p-2 text-[#3b4246] transition-colors hover:bg-[#f0f3f3] hover:text-[#b90046] sm:block">
            <Search size={18} strokeWidth={1.6} />
          </button>
          <button
            onClick={() => navigateTo('/contact')}
            className="btn-shine hidden rounded-md bg-[#b90046] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/20 sm:block"
          >
            Get in touch
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 transition-colors hover:bg-[#f0f3f3] lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-[#e7e9ea] bg-white px-6 py-4 animate-fade-in lg:hidden">
          {navItems.map((item) => (
            <div key={item.path}>
              <button
                onClick={() => {
                  navigateTo(item.path);
                  setMobileOpen(false);
                }}
                className={`block w-full rounded-md px-3 py-3 text-left text-sm font-medium transition-colors ${
                  currentPage === item.page ? 'bg-[#fdf0f5] text-[#b90046]' : 'hover:bg-[#f7f8f8]'
                }`}
              >
                {item.label}
              </button>
              {item.children && (
                <div className="ml-3 mb-1">
                  {item.children.map((child) => (
                    <button
                      key={child.path}
                      onClick={() => {
                        navigateTo(child.path);
                        setMobileOpen(false);
                      }}
                      className="block w-full rounded-md px-3 py-2.5 text-left text-sm text-[#6b7377] transition-colors hover:bg-[#f7f8f8] hover:text-[#b90046]"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email, locale: 'en' });
      if (error) {
        if (error.code === '23505') {
          setStatus('success');
          setEmail('');
        } else {
          setStatus('error');
        }
      } else {
        setStatus('success');
        setEmail('');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Newsletter</p>
      <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
        Insights and legal updates from our team, straight to your inbox.
      </p>
      {status === 'success' ? (
        <p className="mt-4 text-sm text-[#df8eae]">Thank you for subscribing.</p>
      ) : (
        <form onSubmit={submit} className="mt-4 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full border-b border-white/20 bg-transparent py-2 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#df8eae]"
          />
          <button type="submit" className="shrink-0 rounded-md bg-[#b90046] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#930038]">
            Join
          </button>
        </form>
      )}
      {status === 'error' && <p className="mt-2 text-xs text-red-400">Could not subscribe. Please try again.</p>}
    </div>
  );
}

export function SiteFooter() {
  const footerLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Practice Areas', path: '/practice-areas' },
    { label: 'The Newsroom', path: '/newsroom' },
    { label: 'The Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Disclaimer', path: '/disclaimer' },
    { label: 'Careers', path: '/careers' },
  ];

  return (
    <footer className="bg-[#0f1113] px-6 py-16 text-white lg:px-12">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <div>
          <button onClick={() => navigateTo('/')}>
            <img src="/Tornaritis-Law-Firm-Logo-Revised.png" alt="Tornaritis Law Firm" className="h-auto w-[200px] brightness-0 invert" />
          </button>
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/50">
            We conduct our work with a high degree of professionalism and dedication, and provide an expert, sensitive service.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#b90046] hover:text-[#b90046]" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#b90046] hover:text-[#b90046]" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href="mailto:office@tornaritislaw.com" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#b90046] hover:text-[#b90046]" aria-label="Email">
              <Mail size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Navigation</p>
          <div className="mt-4 space-y-3">
            {footerLinks.map((link) => (
              <button
                key={link.path}
                className="block text-left text-sm text-white/60 transition-colors hover:text-[#df8eae]"
                onClick={() => navigateTo(link.path)}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Nicosia Office</p>
          <div className="mt-4 space-y-2 text-sm text-white/60">
            <p>16 Stasikratous<br />1065 Nicosia, Cyprus</p>
            <p>office@tornaritislaw.com</p>
            <p>+357 22 456 056</p>
            <p>Fax: +357 22 664 056</p>
            <p className="pt-2 text-white/40">Mon–Thu 08:30–13:00 & 14:00–17:30<br />Fri 08:30–14:00</p>
          </div>
        </div>

        <NewsletterSignup />
      </div>

      <div className="mx-auto mt-14 flex max-w-[1600px] flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.14em] text-white/40 sm:flex-row">
        <span>© 2025 Tornaritis & Co LLC. All rights reserved.</span>
        <span>Nicosia · Cyprus</span>
      </div>
    </footer>
  );
}
