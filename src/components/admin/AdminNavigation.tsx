import {
  Bell,
  CreditCard,
  Ellipsis,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AdminNavigationProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

const pages = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "products", label: "Products", icon: Package },
  { id: "merchant", label: "Merchant", icon: Store },
] as const;

function AdminNavigation({
  currentPage,
  onNavigate,
}: AdminNavigationProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const isMoreActive = currentPage === "customers" || currentPage === "categories";

  useEffect(() => {
    if (!isMoreOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !moreRef.current?.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMoreOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMoreOpen]);

  return (
    <nav aria-label="Main navigation" className="admin-navigation">
      {pages.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          data-page={id}
          aria-current={currentPage === id ? "page" : undefined}
          className="admin-nav-item"
          onClick={() => onNavigate(id)}
        >
          <Icon aria-hidden="true" />
          <span className="admin-nav-label">{label}</span>
        </button>
      ))}
      <div className="admin-nav-more" ref={moreRef}>
        <button
          type="button"
          className="admin-nav-item"
          aria-current={isMoreActive ? "page" : undefined}
          aria-expanded={isMoreOpen}
          aria-haspopup="menu"
          aria-label="More management pages"
          onClick={() => setIsMoreOpen((open) => !open)}
        >
          <Ellipsis aria-hidden="true" />
          <span className="admin-nav-label">More</span>
        </button>
        {isMoreOpen && (
          <div className="admin-nav-more-menu" role="menu" aria-label="More management pages">
            <button type="button" role="menuitem" onClick={() => { setIsMoreOpen(false); onNavigate("customers"); }}>
              Customers
            </button>
            <button type="button" role="menuitem" onClick={() => { setIsMoreOpen(false); onNavigate("categories"); }}>
              Categories
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default AdminNavigation;