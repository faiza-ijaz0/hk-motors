import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

import type { BlogPostListItem } from "@/services/blog";

export function BlogPostCard({ post }: { post: BlogPostListItem }) {
  return (
    <Card variant="elevated" className="h-full overflow-hidden py-0">
      <Link href={`/blog/${post.slug}`} className="relative block">
        <div className="bg-muted relative aspect-16/9 w-full">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
          {post.categoryName && (
            <Badge className="absolute top-3 left-3">{post.categoryName}</Badge>
          )}
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col gap-2 py-4">
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {post.readTime}
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <p className="font-display hover:text-primary text-lg leading-snug transition-colors">
            {post.title}
          </p>
        </Link>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/blog/${post.slug}`}
          className="text-primary group inline-flex items-center gap-1.5 text-sm font-medium"
        >
          Read More
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
