import {
  Bell,
  CreditCard,
  Ellipsis,
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AdminNavigationProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

const navGroups = [
  {
    title: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Store Management",
    items: [
      { id: "products", label: "Products", icon: Package },
      { id: "categories", label: "Categories", icon: FolderTree },
      { id: "orders", label: "Orders", icon: ShoppingBag },
      { id: "payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    title: "Network & Users",
    items: [
      { id: "customers", label: "Customers", icon: Users },
      { id: "merchant", label: "Merchants", icon: Store },
    ],
  },
] as const;

// Flattened list for mobile bar
const mobilePages = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "products", label: "Products", icon: Package },
  { id: "notifications", label: "Alerts", icon: Bell },
] as const;

function AdminNavigation({
  currentPage,
  onNavigate,
}: AdminNavigationProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const isMoreActive = currentPage === "customers" || currentPage === "categories" || currentPage === "merchant";

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
    <>
      {/* Desktop Grouped Sidebar Navigation */}
      <nav aria-label="Desktop navigation" className="admin-navigation-desktop">
        {navGroups.map((group) => (
          <div key={group.title} className="admin-nav-group">
            <span className="admin-nav-group-title">{group.title}</span>
            <div className="admin-nav-group-items">
              {group.items.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  data-page={id}
                  aria-current={currentPage === id ? "page" : undefined}
                  className="admin-nav-item"
                  onClick={() => onNavigate(id)}
                >
                  <Icon className="admin-nav-icon" aria-hidden="true" />
                  <span className="admin-nav-label">{label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Mobile navigation" className="admin-navigation admin-navigation-mobile">
        {mobilePages.map(({ id, label, icon: Icon }) => (
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
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMoreOpen(false);
                  onNavigate("customers");
                }}
              >
                Customers
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMoreOpen(false);
                  onNavigate("categories");
                }}
              >
                Categories
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMoreOpen(false);
                  onNavigate("merchant");
                }}
              >
                Merchants
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default AdminNavigation;