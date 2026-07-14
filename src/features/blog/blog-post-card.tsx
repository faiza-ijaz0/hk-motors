import { Calendar, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

import type { BlogPostListItem } from "@/services/blog";

export function BlogPostCard({ post }: { post: BlogPostListItem }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card variant="elevated" className="h-full overflow-hidden py-0">
        <div className="bg-muted relative aspect-16/9 w-full">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Newspaper className="text-muted-foreground size-10" />
            </div>
          )}
          {post.categoryName && (
            <Badge className="absolute top-3 left-3">{post.categoryName}</Badge>
          )}
        </div>
        <CardContent className="space-y-2 py-4">
          {post.publishedAt && (
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Calendar className="size-3.5" />
              {formatDate(post.publishedAt)}
            </p>
          )}
          <p className="font-display text-lg leading-snug">{post.title}</p>
          {post.excerpt && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {post.excerpt}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
