"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { statusMeta, statusOrder, type Post, type PostStatus } from "@/lib/instagram";
import {
  addPost,
  deletePost,
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/posts-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddPostDialog } from "@/components/instagram/add-post-dialog";
import { PostCard } from "@/components/instagram/post-card";

export function InstagramManager() {
  const posts = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const byStatus = React.useMemo(() => {
    const groups: Record<PostStatus, Post[]> = {
      backlog: [],
      draft: [],
      scheduled: [],
      published: [],
    };
    for (const post of posts) groups[post.status].push(post);
    return groups;
  }, [posts]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          {posts.length} {posts.length === 1 ? "post" : "posts"} across the
          board
        </p>
        <AddPostDialog onCreate={addPost} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statusOrder.map((status) => {
          const meta = statusMeta[status];
          const Icon = meta.icon;
          return (
            <div
              key={status}
              className="bg-card flex items-center gap-3 rounded-xl border p-4"
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg border",
                  meta.accent
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-2xl leading-none font-semibold">
                  {byStatus[status].length}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {meta.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Board */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {statusOrder.map((status) => {
          const meta = statusMeta[status];
          const Icon = meta.icon;
          const items = byStatus[status];

          return (
            <section
              key={status}
              className="bg-muted/30 flex flex-col gap-3 rounded-xl border p-3"
            >
              <header className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md border",
                      meta.accent
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <h2 className="text-sm font-semibold">{meta.label}</h2>
                  <span className="text-muted-foreground text-xs">
                    {items.length}
                  </span>
                </div>
                <AddPostDialog
                  onCreate={addPost}
                  defaultStatus={status}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Add to ${meta.label}`}
                      className="text-muted-foreground hover:text-foreground size-7"
                    >
                      <Plus className="size-4" />
                    </Button>
                  }
                />
              </header>

              <p className="text-muted-foreground px-1 text-xs">
                {meta.description}
              </p>

              <div className="flex flex-col gap-3">
                {items.length === 0 ? (
                  <div className="text-muted-foreground/70 rounded-lg border border-dashed p-6 text-center text-xs">
                    Nothing here yet
                  </div>
                ) : (
                  items.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onDelete={deletePost}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
