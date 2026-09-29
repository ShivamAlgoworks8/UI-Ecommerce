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

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
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

function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
      <strong className="font-semibold">{title}</strong>
      <span className="mt-2 max-w-md text-sm text-muted-foreground">{description}</span>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export { AdminPage, AdminPageCard, AdminPageHeader, EmptyState };