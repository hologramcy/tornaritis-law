import { ArrowRight, Award, Building2, Scale, Users } from 'lucide-react';
import type { PracticeArea, NewsroomPost } from '@/lib/types';
import { navigateTo } from '@/lib/router';

type HomeProps = {
  practiceAreas: PracticeArea[];
  newsroomPosts: NewsroomPost[];
};

export function HomePage({ practiceAreas, newsroomPosts }: HomeProps) {
  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-[680px] overflow-hidden bg-[#1a2e35]">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity"
          src="https://images.pexels.com/photos/7876155/pexels-photo-7876155.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt="Legal counsel"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,17,19,.95)_0%,rgba(26,46,53,.78)_50%,rgba(26,46,53,.1)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a2e35]/80 to-transparent" />

        <div className="relative mx-auto flex min-h-[680px] max-w-[1440px] items-center px-6 lg:px-12">
          <div className="max-w-2xl">
            <p className="mb-7 flex animate-fade-up items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-[#df8eae]">
              <span className="h-px w-12 bg-[#b90046]" /> Three generations of lawyers
            </p>
            <h1 className="animate-fade-up font-serif text-5xl leading-[.98] text-white delay-1 sm:text-6xl lg:text-[88px]">
              A leading Cyprus<br /><span className="text-gradient">law firm.</span>
            </h1>
            <p className="mt-8 max-w-lg animate-fade-up text-base leading-7 text-white/70 delay-2">
              Tornaritis provides high-stakes international legal services to local and international clients, with
              premier-quality work product and sophisticated legal counsel.
            </p>
            <div className="mt-10 flex animate-fade-up items-center gap-4 delay-3">
              <button
                onClick={() => navigateTo('/about')}
                className="btn-shine group flex items-center gap-3 rounded-lg bg-[#b90046] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/30"
              >
                Discover our story
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigateTo('/contact')}
                className="text-xs font-bold uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
              >
                Contact us →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-[#e7e9ea] bg-white">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Award, value: '100+', label: 'Years of practice' },
            { icon: Users, value: '11', label: 'Committed professionals' },
            { icon: Building2, value: String(practiceAreas.length || 16), label: 'Practice areas' },
            { icon: Scale, value: '01', label: 'Uncompromising standard' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`group flex items-center gap-4 px-6 py-7 transition-colors hover:bg-[#fafbfb] ${
                i < 3 ? 'border-b lg:border-b-0 lg:border-r border-[#e7e9ea]' : ''
              } ${i < 2 ? 'border-r lg:border-r' : ''} ${i === 2 ? 'lg:border-r' : ''}`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fdf0f5] transition-colors group-hover:bg-[#b90046]">
                <stat.icon size={22} className="text-[#b90046] transition-colors group-hover:text-white" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-serif text-3xl text-[#273237]">{stat.value}</div>
                <div className="text-xs uppercase tracking-[0.12em] text-[#687277]">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice areas */}
      <section className="mx-auto max-w-[1200px] px-6 py-24 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow">Our expertise</p>
            <h2 className="mt-5 font-serif text-5xl leading-none text-[#273237] lg:text-6xl">Focused on what matters.</h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[#687277]">
            From banking and finance to dispute resolution, our lawyers bring a depth of experience and a practical
            mindset to the work that matters most to businesses, institutions and individuals.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.slice(0, 6).map((area, i) => (
            <button
              onClick={() => navigateTo(`/practice-areas/${area.slug}`)}
              key={area.id}
              className="card-lift group relative overflow-hidden rounded-2xl border border-[#e7e9ea] bg-white p-7 text-left"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[#fdf0f5] transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <span className="font-serif text-2xl text-[#b90046]">{String(area.display_order).padStart(2, '0')}</span>
                <h3 className="mt-4 font-serif text-2xl text-[#273237] transition-colors group-hover:text-[#b90046]">
                  {area.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#687277] line-clamp-3">{area.summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b90046]">
                  Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-[#f0f3f3] px-6 py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-2 lg:items-center">
          <div className="img-zoom relative overflow-hidden rounded-2xl">
            <img
              className="h-[440px] w-full object-cover"
              src="https://images.pexels.com/photos/5668792/pexels-photo-5668792.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Our heritage"
            />
            <div className="absolute bottom-6 left-6 glass rounded-xl px-6 py-4">
              <p className="font-serif text-3xl text-white">1924</p>
              <p className="text-xs uppercase tracking-[0.12em] text-white/70">Year established</p>
            </div>
          </div>
          <div>
            <p className="eyebrow">A long view</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#273237] lg:text-5xl">
              Established in 1924.<br />Still moving forward.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#687277]">
              From its founding to its present-day status as a leading law firm, Tornaritis Law Firm has demonstrated a
              sustained commitment to excellence in the practice of law, public service and civil society.
            </p>
            <button
              onClick={() => navigateTo('/about')}
              className="mt-8 inline-flex items-center gap-2 rounded-lg border border-[#b90046] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#b90046] transition-all duration-300 hover:bg-[#b90046] hover:text-white hover:shadow-lg hover:shadow-[#b90046]/20"
            >
              Our story <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Newsroom preview */}
      {newsroomPosts.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-6 py-24 lg:px-12">
          <div className="flex items-end justify-between border-b border-[#d9ddde] pb-6">
            <div>
              <p className="eyebrow">Latest insights</p>
              <h2 className="mt-4 font-serif text-4xl text-[#273237] lg:text-5xl">Thinking ahead.</h2>
            </div>
            <button
              onClick={() => navigateTo('/newsroom')}
              className="text-xs font-bold uppercase tracking-[0.14em] text-[#b90046] transition-opacity hover:opacity-70"
            >
              See all →
            </button>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {newsroomPosts.slice(0, 3).map((post, i) => (
              <article key={post.id} className="card-lift group cursor-pointer rounded-2xl border border-[#e7e9ea] bg-white p-7" onClick={() => navigateTo(`/newsroom/${post.slug}`)} style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="inline-block rounded-full bg-[#fdf0f5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#b90046]">
                  {post.category}
                </span>
                <h3 className="mt-5 font-serif text-2xl leading-tight text-[#273237] transition-colors group-hover:text-[#b90046]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#687277] line-clamp-2">{post.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b90046]">
                  Read more <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#0f1113] px-6 py-24 text-white lg:px-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#b90046]/15" />
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border border-[#b90046]/15" />
        <div className="relative mx-auto flex max-w-[1200px] flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#df8eae]">Let's talk</p>
            <h2 className="mt-4 font-serif text-4xl lg:text-5xl">Your next move starts here.</h2>
            <p className="mt-4 max-w-md text-base text-white/50">Our specialists will gladly assist you with your inquiries.</p>
          </div>
          <button
            onClick={() => navigateTo('/contact')}
            className="btn-shine inline-flex items-center gap-2 self-start rounded-lg bg-[#b90046] px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/30"
          >
            Get in touch <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </main>
  );
}
