import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PageShellProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Placeholder feature cards rendered in the section grid. */
  features?: { title: string; description: string }[];
  children?: ReactNode;
};

/**
 * Shared scaffold for every section page. Renders a consistent header plus
 * a grid of placeholder feature cards so each section has a recognisable
 * shape before the real functionality is built.
 */
export function PageShell({
  title,
  description,
  icon: Icon,
  features = [],
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="mb-8 flex items-start gap-4">
        <div className="bg-accent text-accent-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
          <Icon className="size-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <Badge variant="secondary">Coming soon</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        </div>
      </header>

      {features.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/40 text-muted-foreground flex h-24 items-center justify-center rounded-md border border-dashed text-xs">
                  Placeholder
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
