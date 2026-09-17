import type { TeamMember } from '@/lib/types';
import { PageHeader } from '@/components/PageHeader';

type TeamProps = {
  members: TeamMember[];
};

export function TeamPage({ members }: TeamProps) {
  return (
    <main>
      <PageHeader badge="Our people" title="The team">
        <p>
          Without our people there would be no firm. Our lawyers combine deep expertise with a practical
          understanding of the world our clients operate in.
        </p>
      </PageHeader>

      <section className="mx-auto max-w-[1050px] px-6 py-20 lg:px-12">
        {members.length === 0 ? (
          <p className="py-20 text-center text-sm text-[#687277]">Team profiles will appear here soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, i) => (
              <article
                key={member.id}
                className="card-lift group overflow-hidden rounded-2xl border border-[#e7e9ea] bg-white"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="img-zoom relative h-[340px] overflow-hidden">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f0f3f3] to-[#e7ecec] text-5xl font-serif text-[#a5afb2]">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-[#273237] transition-colors group-hover:text-[#b90046]">{member.name}</h3>
                  <p className="mt-1 text-sm font-medium text-[#b90046]">{member.title}</p>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="mt-3 block text-sm text-[#687277] transition-colors hover:text-[#b90046]"
                    >
                      {member.email}
                    </a>
                  )}
                  {member.bio && <p className="mt-4 text-sm leading-6 text-[#687277] line-clamp-3">{member.bio}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
