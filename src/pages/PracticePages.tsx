import { ArrowRight } from 'lucide-react';
import type { PracticeArea } from '@/lib/types';
import { navigateTo } from '@/lib/router';
import { PageHeader } from '@/components/PageHeader';

type PracticeProps = {
  practiceAreas: PracticeArea[];
};

export function PracticePage({ practiceAreas }: PracticeProps) {
  return (
    <main>
      <PageHeader badge="What we do" title="Practice Areas">
        <p>
          We provide specialist legal advice across the issues that shape businesses, institutions and individuals.
          Select an area to learn more about how we can help.
        </p>
      </PageHeader>

      <section className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {practiceAreas.map((area, i) => (
            <button
              key={area.id}
              onClick={() => navigateTo(`/practice-areas/${area.slug}`)}
              className="card-lift group relative overflow-hidden rounded-2xl border border-[#e7e9ea] bg-white p-8 text-left"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex items-start justify-between">
                <span className="font-serif text-3xl text-[#b90046]">
                  {String(area.display_order).padStart(2, '0')}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e9ea] transition-all duration-300 group-hover:border-[#b90046] group-hover:bg-[#b90046]">
                  <ArrowRight
                    size={16}
                    className="text-[#a5afb2] transition-all group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </div>
              </div>
              <h2 className="mt-8 font-serif text-3xl text-[#273237] transition-colors group-hover:text-[#b90046]">
                {area.title}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#687277]">{area.summary}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1a2e35] px-6 py-20 text-white lg:px-12">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
        <div className="relative mx-auto flex max-w-[1440px] flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#df8eae]">Need a clearer path?</p>
            <h2 className="mt-4 font-serif text-4xl">Talk to our team.</h2>
          </div>
          <button
            onClick={() => navigateTo('/contact')}
            className="btn-shine inline-flex items-center gap-2 self-start rounded-lg bg-[#b90046] px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/30"
          >
            Get in touch <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </main>
  );
}

type PracticeDetailProps = {
  area: PracticeArea;
  otherAreas: PracticeArea[];
};

export function PracticeDetailPage({ area, otherAreas }: PracticeDetailProps) {
  return (
    <main>
      <section className="page-header px-6 py-20 lg:px-12 lg:py-28">
        <div className="relative mx-auto max-w-[1440px]">
          <button
            onClick={() => navigateTo('/practice-areas')}
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#b90046] transition-opacity hover:opacity-70"
          >
            ← All practice areas
          </button>
          <p className="mt-8 font-serif text-2xl text-[#b90046]">
            {String(area.display_order).padStart(2, '0')}
          </p>
          <h1 className="mt-2 font-serif text-5xl text-[#273237] lg:text-6xl">{area.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#687277]">{area.summary}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12">
        <div className="prose-content mx-auto max-w-[800px] whitespace-pre-wrap text-[15px] leading-8 text-[#3b4246]">
          {area.body}
        </div>
      </section>

      <section className="border-t border-[#d9ddde] bg-[#f0f3f3] px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="font-serif text-3xl text-[#273237]">Other practice areas</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherAreas
              .filter((a) => a.id !== area.id)
              .slice(0, 3)
              .map((a) => (
                <button
                  key={a.id}
                  onClick={() => navigateTo(`/practice-areas/${a.slug}`)}
                  className="card-lift group rounded-xl border border-[#dde2e3] bg-white p-6 text-left transition-colors hover:border-[#b90046]/30"
                >
                  <h3 className="font-serif text-xl text-[#273237] transition-colors group-hover:text-[#b90046]">{a.title}</h3>
                  <p className="mt-2 text-sm text-[#687277] line-clamp-2">{a.summary}</p>
                </button>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
