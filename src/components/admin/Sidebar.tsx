import AdminNavigation from "./AdminNavigation";

type SidebarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="admin-sidebar" aria-label="Application sidebar">
      <div className="admin-brand">Nexora</div>
      <AdminNavigation currentPage={currentPage} onNavigate={onNavigate} />
    </aside>
  );
}

export default Sidebar;
