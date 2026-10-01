import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import PageHeader from "./PageHeader";

type AdminPageProps = {
  children: ReactNode;
  className?: string;
};

type AdminPageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

type AdminPageCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

import { PackageOpen } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
};

function AdminPage({ children, className }: AdminPageProps) {
  return (
    <main className={cn("admin-page", className)}>
      {children}
    </main>
  );
}

function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return <PageHeader title={title} description={description} action={action} />;
}

function AdminPageCard({ title, description, children, className }: AdminPageCardProps) {
  return (
    <section className={cn("data-card", className)}>
      <header className="data-card-header border-b border-border">
        <h3 className="font-semibold">{title}</h3>
        <p>{description}</p>
      </header>
      {children}
    </section>
  );
}

function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center animate-in fade-in-50 duration-300">
      <div className="mb-3.5 flex size-12 items-center justify-center rounded-full bg-muted/80 ring-8 ring-muted/30">
        {icon ?? <PackageOpen className="size-6 text-muted-foreground" aria-hidden="true" />}
      </div>
      <strong className="text-base font-semibold tracking-tight text-foreground">{title}</strong>
      <span className="mt-1.5 max-w-sm text-sm text-muted-foreground leading-relaxed">{description}</span>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export { AdminPage, AdminPageCard, AdminPageHeader, EmptyState };