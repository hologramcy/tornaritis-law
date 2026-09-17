import { ArrowRight, Clock } from 'lucide-react';
import type { NewsroomPost } from '@/lib/types';
import { navigateTo } from '@/lib/router';
import { PageHeader } from '@/components/PageHeader';

type NewsroomProps = {
  posts: NewsroomPost[];
};

export function NewsroomPage({ posts }: NewsroomProps) {
  return (
    <main>
      <PageHeader badge="Knowledge & perspective" title="The Newsroom">
        <p>
          Ideas, updates and practical observations from our lawyers on the issues shaping businesses and society.
        </p>
      </PageHeader>

      <section className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
        {posts.length === 0 ? (
          <p className="py-20 text-center text-sm text-[#687277]">No articles have been published yet.</p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <article
              className="card-lift group cursor-pointer overflow-hidden rounded-2xl border border-[#e7e9ea] bg-white"
              onClick={() => navigateTo(`/newsroom/${posts[0].slug}`)}
            >
              <div className="p-8 lg:p-10">
                <span className="inline-block rounded-full bg-[#fdf0f5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#b90046]">
                  Featured · {posts[0].category}
                </span>
                <h2 className="mt-6 max-w-xl font-serif text-4xl leading-tight text-[#273237] transition-colors group-hover:text-[#b90046] lg:text-5xl">
                  {posts[0].title}
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[#687277]">{posts[0].excerpt}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b90046]">
                  Read article <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
            <div className="space-y-4">
              {posts.slice(1).map((post) => (
                <article
                  key={post.id}
                  className="card-lift group cursor-pointer rounded-xl border border-[#e7e9ea] bg-white p-6"
                  onClick={() => navigateTo(`/newsroom/${post.slug}`)}
                >
                  <span className="inline-block rounded-full bg-[#fdf0f5] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#b90046]">
                    {post.category}
                  </span>
                  <h3 className="mt-3 font-serif text-xl leading-tight text-[#273237] transition-colors group-hover:text-[#b90046]">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#879195]">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
        </div>
      </section>
    </main>
  );
}

type NewsDetailProps = {
  post: NewsroomPost;
  otherPosts: NewsroomPost[];
};

export function NewsDetailPage({ post, otherPosts }: NewsDetailProps) {
  return (
    <main>
      <section className="page-header px-6 py-20 lg:px-12 lg:py-28">
        <div className="relative mx-auto max-w-[1600px]">
          <button
            onClick={() => navigateTo('/newsroom')}
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#b90046] transition-opacity hover:opacity-70"
          >
            ← The Newsroom
          </button>
          <span className="mt-8 inline-block rounded-full bg-[#fdf0f5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#b90046]">
            {post.category}
          </span>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-[#273237] lg:text-5xl">{post.title}</h1>
          <div className="mt-5 flex items-center gap-4 text-sm text-[#687277]">
            {post.author_name && (
              <span className="flex items-center gap-2">
                <Clock size={14} /> By {post.author_name}
              </span>
            )}
            <span>
              {post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-12">
        <div className="prose-content mx-auto max-w-[1600px] w-full whitespace-pre-wrap text-[15px] leading-8 text-[#3b4246]">{post.body}</div>
      </section>

      <section className="border-t border-[#d9ddde] bg-[#f0f3f3] px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <h2 className="font-serif text-3xl text-[#273237]">More from the Newsroom</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {otherPosts
              .filter((p) => p.id !== post.id)
              .slice(0, 2)
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigateTo(`/newsroom/${p.slug}`)}
                  className="card-lift group rounded-xl border border-[#dde2e3] bg-white p-6 text-left transition-colors hover:border-[#b90046]/30"
                >
                  <span className="inline-block rounded-full bg-[#fdf0f5] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#b90046]">
                    {p.category}
                  </span>
                  <h3 className="mt-3 font-serif text-xl text-[#273237] transition-colors group-hover:text-[#b90046]">{p.title}</h3>
                </button>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
