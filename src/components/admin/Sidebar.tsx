import { Sparkles } from "lucide-react";
import AdminNavigation from "./AdminNavigation";

type SidebarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="admin-sidebar" aria-label="Application sidebar">
      <div className="admin-brand">
        <div className="admin-brand-icon" aria-hidden="true">
          <Sparkles className="size-4" />
        </div>
        <div className="admin-brand-info">
          <span className="admin-brand-name">Nexora</span>
          <span className="admin-brand-tag">PORTAL</span>
        </div>
      </div>
      <AdminNavigation currentPage={currentPage} onNavigate={onNavigate} />
      <div className="admin-sidebar-footer">
        <div className="admin-system-status">
          <span className="admin-status-dot pulse" aria-hidden="true" />
          <span>Store Live &amp; Synced</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

