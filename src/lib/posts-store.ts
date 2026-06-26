import { seedPosts, type Post } from "@/lib/instagram";

/**
 * A tiny localStorage-backed store for Instagram posts, exposed through the
 * `useSyncExternalStore` contract. Keeping reads/writes here (rather than in
 * an effect) lets the UI stay in sync with persisted state without calling
 * setState inside effects.
 */

const STORAGE_KEY = "content-hub:instagram-posts";

let cache: Post[] | null = null;
const listeners = new Set<() => void>();

function createId() {
  return `post-${Math.random().toString(36).slice(2, 10)}`;
}

function load(): Post[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Post[]) : seedPosts;
  } catch {
    // Malformed or unavailable storage falls back to seed data.
    return seedPosts;
  }
}

function commit(next: Post[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (e.g. private mode); keep state in memory.
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): Post[] {
  if (cache === null) cache = load();
  return cache;
}

// During SSR and the initial hydration pass there is no localStorage, so we
// render the seed data; the client snapshot takes over once mounted.
export function getServerSnapshot(): Post[] {
  return seedPosts;
}

export function addPost(post: Omit<Post, "id">) {
  commit([{ ...post, id: createId() }, ...getSnapshot()]);
}

export function deletePost(id: string) {
  commit(getSnapshot().filter((p) => p.id !== id));
}
