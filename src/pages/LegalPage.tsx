import { legalPages } from '@/lib/defaultContent';
import { PageHeader } from '@/components/PageHeader';

type LegalPageProps = {
  slug?: string;
};

export function LegalPage({ slug }: LegalPageProps) {
  const page = slug && slug in legalPages ? legalPages[slug as keyof typeof legalPages] : legalPages.disclaimer;

  return (
    <main>
      <PageHeader badge={page.badge} title={page.title}>
        <p>Tornaritis Law Firm information and policies.</p>
      </PageHeader>

      <section className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12">
        <div className="prose-content mx-auto max-w-[800px] whitespace-pre-wrap text-[15px] leading-8 text-[#3b4246]">
          {page.body}
        </div>
      </section>
    </main>
  );
}
