import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, ChevronRight, Search } from "lucide-react";
import type { ThemeMode } from "@/app/types";
import type { Notification } from "@/features/notification/types";
import { Button } from "@/components/ui/button";
import CreateMenu from "./CreateMenu";
import UserMenu from "./UserMenu";

type AdminHeaderProps = {
  currentPage: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNavigate: (page: string) => void;
  onCreate: (page: string) => void;
  themeMode: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onLogout: () => void;
  notifications?: Notification[];
  onClearNotifications?: () => void;
};

const pageSectionMap: Record<string, { section: string; title: string }> = {
  dashboard: { section: "Overview", title: "Dashboard" },
  notifications: { section: "Overview", title: "Notifications" },
  products: { section: "Store", title: "Products" },
  categories: { section: "Store", title: "Categories" },
  orders: { section: "Store", title: "Orders" },
  payments: { section: "Store", title: "Payments" },
  customers: { section: "Network", title: "Customers" },
  merchant: { section: "Network", title: "Merchants" },
};

const searchLabels: Record<string, string> = {
  products: "products",
  orders: "orders",
  payments: "payments",
  notifications: "notifications",
  merchant: "merchants",
  customers: "customers",
  categories: "categories",
};

function AdminHeader({
  currentPage,
  searchTerm,
  onSearchChange,
  onNavigate,
  onCreate,
  themeMode,
  onThemeChange,
  onLogout,
  notifications = [],
  onClearNotifications,
}: AdminHeaderProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const currentInfo = pageSectionMap[currentPage] ?? { section: "Admin", title: currentPage };

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        if (!searchRef.current) return;
        event.preventDefault();
        searchRef.current.focus();
      }
    };

    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    if (!isNotifOpen) return;
    const closeOnOutside = (event: MouseEvent) => {
      if (event.target instanceof Node && !notifRef.current?.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    const closeOnEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEsc);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEsc);
    };
  }, [isNotifOpen]);

  const activeCount = notifications.filter((n) => n.status === "Active").length;

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button type="button" className="admin-header-brand" onClick={() => onNavigate("dashboard")}>
          Nexora
        </button>

        <nav aria-label="Breadcrumb" className="admin-breadcrumbs">
          <button type="button" className="admin-breadcrumb-root" onClick={() => onNavigate("dashboard")}>
            Home
          </button>
          <ChevronRight className="admin-breadcrumb-separator" aria-hidden="true" />
          <span className="admin-breadcrumb-section">{currentInfo.section}</span>
          <ChevronRight className="admin-breadcrumb-separator" aria-hidden="true" />
          <span className="admin-breadcrumb-current">{currentInfo.title}</span>
        </nav>
      </div>

      <div className="admin-topbar-center">
        {currentPage !== "dashboard" && (
          <label className="admin-global-search">
            <Search className="admin-global-search-icon" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              aria-label={`Search in ${searchLabels[currentPage] ?? "items"}`}
              placeholder={`Search in ${searchLabels[currentPage] ?? "items"}...`}
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <kbd aria-hidden="true">{navigator.platform.includes("Mac") ? "⌘K" : "Ctrl+K"}</kbd>
          </label>
        )}
      </div>

      <div className="admin-header-actions">
        <CreateMenu onCreate={onCreate} />

        {/* Notifications Popover Trigger */}
        <div className="admin-notification-wrapper" ref={notifRef}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="admin-notification-link"
            aria-label="View notifications"
            aria-expanded={isNotifOpen}
            onClick={() => setIsNotifOpen((prev) => !prev)}
          >
            <Bell aria-hidden="true" />
            {activeCount > 0 && (
              <span className="admin-notification-badge" aria-label={`${activeCount} unread notifications`}>
                {activeCount > 9 ? "9+" : activeCount}
              </span>
            )}
          </Button>

          {isNotifOpen && (
            <div className="admin-notif-popover" role="dialog" aria-label="Notifications popover">
              <header className="admin-notif-header">
                <div>
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  <p className="text-xs text-muted-foreground">
                    {activeCount} active alert{activeCount === 1 ? "" : "s"}
                  </p>
                </div>
                {onClearNotifications && notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      onClearNotifications();
                      setIsNotifOpen(false);
                    }}
                  >
                    <CheckCheck className="size-3" />
                    Clear all
                  </Button>
                )}
              </header>

              <div className="admin-notif-list">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No notifications right now
                  </div>
                ) : (
                  notifications.slice(0, 4).map((notification) => (
                    <article key={notification.id} className="admin-notif-item">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-xs font-semibold text-foreground line-clamp-1">
                          {notification.title}
                        </strong>
                        <span className="text-[10px] text-muted-foreground shrink-0">{notification.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                    </article>
                  ))
                )}
              </div>

              <footer className="admin-notif-footer">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setIsNotifOpen(false);
                    onNavigate("notifications");
                  }}
                >
                  View all notifications
                </Button>
              </footer>
            </div>
          )}
        </div>

        <UserMenu themeMode={themeMode} onThemeChange={onThemeChange} onLogout={onLogout} />
      </div>
    </header>
  );
}

export default AdminHeader;