import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DataTableProps = {
  title: string;
  description: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
};

function DataTable({ title, description, toolbar, children, className }: DataTableProps) {
  return (
    <section className={cn("data-card", className)}>
      <header className="data-card-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {toolbar && <div className="data-card-toolbar">{toolbar}</div>}
      {children}
    </section>
  );
}

export default DataTable;
