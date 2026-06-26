"use client";

import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { statusMeta, typeMeta, type Post } from "@/lib/instagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type PostCardProps = {
  post: Post;
  onDelete: (id: string) => void;
};

export function PostCard({ post, onDelete }: PostCardProps) {
  const type = typeMeta[post.type];
  const status = statusMeta[post.status];
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;

  return (
    <Card className="group gap-3 py-4">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="gap-1.5">
            <TypeIcon className="size-3" />
            {type.label}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete post"
            onClick={() => onDelete(post.id)}
            className="text-muted-foreground hover:text-destructive size-7 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <p className="text-foreground line-clamp-3 text-sm leading-relaxed">
          {post.caption}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-medium",
            status.accent
          )}
        >
          <StatusIcon className="size-3" />
          {status.label}
        </span>
        {post.scheduledDate ? (
          <span className="text-muted-foreground">
            {formatDate(post.scheduledDate)}
          </span>
        ) : (
          <span className="text-muted-foreground/60">No date</span>
        )}
      </CardFooter>
    </Card>
  );
}
