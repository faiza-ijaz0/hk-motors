import { createClient } from "@/lib/supabase/server";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogPostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  tags: string[];
  publishedAt: string | null;
};

export type BlogPostDetail = BlogPostListItem & {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

// Public readers have no RLS access to `users`, so author name can't be
// joined in for anonymous display — bylines are intentionally omitted.
const LIST_SELECT = `id, title, slug, excerpt, cover_image_path, tags, published_at, created_at,
   blog_categories ( name, slug )`;

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_categories")
      .select("id, name, slug")
      .order("name");

    if (error || !data) {
      if (error) console.error("getBlogCategories failed", error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("getBlogCategories: unexpected failure", err);
    return [];
  }
}

export async function getBlogPosts(
  categorySlug?: string,
): Promise<BlogPostListItem[]> {
  try {
    const supabase = createClient();

    let categoryId: string | undefined;
    if (categorySlug) {
      // Resolve slug -> id first rather than filtering on the embedded
      // resource's column directly: PostgREST only supports `.eq()` on a
      // joined table's column when the join is declared `!inner`, and a
      // plain left-embed (what LIST_SELECT uses) silently ignores it.
      const { data: category } = await supabase
        .from("blog_categories")
        .select("id")
        .eq("slug", categorySlug)
        .maybeSingle();
      if (!category) return [];
      categoryId = category.id;
    }

    let query = supabase
      .from("blog_posts")
      .select(LIST_SELECT)
      .eq("status", "published");

    if (categoryId) query = query.eq("category_id", categoryId);

    const { data, error } = await query.order("published_at", {
      ascending: false,
      nullsFirst: false,
    });

    if (error || !data) {
      if (error) console.error("getBlogPosts failed", error);
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      coverImageUrl: row.cover_image_path
        ? supabase.storage.from("blogs").getPublicUrl(row.cover_image_path).data
            .publicUrl
        : null,
      categoryName: row.blog_categories?.name ?? null,
      categorySlug: row.blog_categories?.slug ?? null,
      tags: row.tags ?? [],
      publishedAt: row.published_at ?? row.created_at,
    }));
  } catch (err) {
    console.error("getBlogPosts: unexpected failure", err);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `id, title, slug, excerpt, content, cover_image_path, tags,
         published_at, created_at, seo_title, seo_description,
         blog_categories ( name, slug )`,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getBlogPostBySlug failed", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImageUrl: data.cover_image_path
        ? supabase.storage.from("blogs").getPublicUrl(data.cover_image_path)
            .data.publicUrl
        : null,
      categoryName: data.blog_categories?.name ?? null,
      categorySlug: data.blog_categories?.slug ?? null,
      tags: data.tags ?? [],
      publishedAt: data.published_at ?? data.created_at,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
    };
  } catch (err) {
    console.error("getBlogPostBySlug: unexpected failure", err);
    return null;
  }
}

// Lightweight — for the sitemap only, no joins/images.
export async function getAllPublishedBlogSlugs(): Promise<
  { slug: string; updatedAt: string }[]
> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("status", "published");

    if (error || !data) return [];
    return data.map((row) => ({ slug: row.slug, updatedAt: row.updated_at }));
  } catch (err) {
    console.error("getAllPublishedBlogSlugs: unexpected failure", err);
    return [];
  }
}
