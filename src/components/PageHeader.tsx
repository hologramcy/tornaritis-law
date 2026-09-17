import type { ReactNode } from 'react';

type PageHeaderProps = {
  badge: string;
  title: string;
  children?: ReactNode;
};

export function PageHeader({ badge, title, children }: PageHeaderProps) {
  return (
    <section className="page-header px-6 py-24 lg:px-12 lg:py-32">
      <div className="relative mx-auto max-w-[1440px] text-center">
        <span className="inline-flex animate-fade-up items-center rounded-full bg-[#b90046] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
          {badge}
        </span>
        <h1 className="mt-6 animate-fade-up font-serif text-5xl text-[#273237] delay-1 sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {children && (
          <div className="mx-auto mt-7 max-w-3xl animate-fade-up text-[15px] leading-7 text-[#687277] delay-2">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
