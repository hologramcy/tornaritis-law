import { ArrowRight, Quote } from 'lucide-react';
import { navigateTo } from '@/lib/router';
import { PageHeader } from '@/components/PageHeader';

const affiliations = [
  'Cyprus Bar Association',
  'International Bar Association',
  'American Bar Association',
  'Lexology',
  'The World Bank',
  'Cyprus Chamber of Commerce',
  'Cyprus-Russian Business Association',
  'Cyprus Oil & Gas Association',
  'DLA Piper',
  'The Legal 500',
  'HG.org',
  'Bloomberg',
];

export function AboutPage() {
  return (
    <main>
      <PageHeader badge="Established in 1924" title="Discover our story">
        <p>
          From its founding to its present-day status as a leading law firm, Tornaritis Law Firm has demonstrated a
          sustained commitment to excellence in the practice of law, public service and civil society.
        </p>
      </PageHeader>

      <section className="mx-auto max-w-[1050px] px-6 py-20 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[.95fr_1.05fr] lg:items-start">
          <div className="img-zoom relative overflow-hidden rounded-2xl">
            <img
              className="h-[480px] w-full object-cover"
              src="https://images.pexels.com/photos/5668792/pexels-photo-5668792.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Our heritage"
            />
            <div className="absolute bottom-6 left-6 glass rounded-xl px-6 py-4">
              <p className="font-serif text-2xl text-white">1902 – 1997</p>
              <p className="text-xs uppercase tracking-[0.12em] text-white/70">Our founder</p>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-[#b90046] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              Our founder
            </span>
            <h2 className="mt-5 font-serif text-4xl text-[#273237]">Criton Tornaritis</h2>
            <div className="mt-6 space-y-5 text-[15px] leading-7 text-[#687277]">
              <p>
                Criton Tornaritis (1902–1997) was one of the most important Cypriot legal scientists. He served the
                Cypriot legal system as a lawyer, a Judge and the first Attorney General of the Republic of Cyprus.
              </p>
              <p>
                His work helped shape the legal foundations of the Republic. His deep commitment to public service,
                scholarship and the practice of law remains part of our character today.
              </p>
              <p>
                We continue to build on that legacy with a modern outlook, specialist expertise and a clear sense of
                responsibility to our clients and our community.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 rounded-2xl bg-[#f0f3f3] p-10 lg:p-14">
          <Quote size={36} className="text-[#b90046]" />
          <h2 className="mt-6 max-w-3xl font-serif text-3xl leading-snug text-[#273237] lg:text-4xl">
            Without our people there would be no firm; they are the most important asset we have.
          </h2>
          <button
            onClick={() => navigateTo('/team')}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#b90046] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#930038] hover:shadow-lg hover:shadow-[#b90046]/20"
          >
            Meet the team <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <section className="bg-[#f0f3f3] px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-[1050px]">
          <p className="eyebrow">Our network</p>
          <h2 className="mt-4 font-serif text-4xl text-[#273237]">Affiliations, associations & awards</h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-[#687277]">
            We are active in a variety of national and international professional associations and business
            organizations, strengthening the perspective we bring to every matter.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {affiliations.map((name, i) => (
              <div
                key={name}
                className="card-lift flex min-h-28 items-center justify-center rounded-xl border border-[#dde2e3] bg-white p-5 text-center font-semibold text-[#738087] transition-colors hover:text-[#b90046] hover:border-[#b90046]/30"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <span className="text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
