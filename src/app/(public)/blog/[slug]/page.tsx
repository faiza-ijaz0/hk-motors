import { Calendar, ChevronLeft, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { BlogPostNav } from "@/features/blog/blog-post-nav";
import { RelatedPosts } from "@/features/blog/related-posts";
import { formatDate } from "@/lib/format";
import {
  getAdjacentPosts,
  getBlogPostBySlug,
  getRelatedPosts,
} from "@/services/blog";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

// Plain-text content — split on blank lines so multi-paragraph posts don't
// render as one dense block.
function ContentParagraphs({ content }: { content: string }) {
  const paragraphs = content.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <div className="text-muted-foreground space-y-4 text-base leading-relaxed sm:text-lg">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const related = getRelatedPosts(post);
  const { previous, next } = getAdjacentPosts(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <>
      {/* Static JSON-LD we construct ourselves, not user input. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-border border-b">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
          >
            <ChevronLeft className="size-4" />
            Back to Blogs
          </Link>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {post.categoryName && <Badge>{post.categoryName}</Badge>}
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <User className="size-4" />
            {post.author}
          </p>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <Calendar className="size-4" />
            {formatDate(post.date)}
          </p>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <Clock className="size-4" />
            {post.readTime}
          </p>
        </div>

        <h1 className="font-display mt-4 text-3xl sm:text-4xl">{post.title}</h1>

        <div className="bg-muted border-border relative mt-8 aspect-16/9 w-full overflow-hidden rounded-2xl border">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-8">
          <ContentParagraphs content={post.fullContent} />
        </div>

        <BlogPostNav previous={previous} next={next} />
      </article>

      <RelatedPosts posts={related} />
    </>
  );
}
