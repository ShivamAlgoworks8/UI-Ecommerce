import { useEffect, useRef } from "react";
import { Bell, Search } from "lucide-react";
import type { ThemeMode } from "../../App";
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
}: AdminHeaderProps) {
  const searchRef = useRef<HTMLInputElement>(null);

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

  return (
    <header className="admin-topbar">
      <button type="button" className="admin-header-brand" onClick={() => onNavigate("dashboard")}>
        Nexora
      </button>
      {currentPage !== "dashboard" && (
        <label className="admin-global-search">
          <Search className="admin-global-search-icon" aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            aria-label={`Search in ${searchLabels[currentPage] ?? "products"}`}
            placeholder={`Search in ${searchLabels[currentPage] ?? "products"}...`}
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <kbd aria-hidden="true">{navigator.platform.includes("Mac") ? "⌘K" : "Ctrl+K"}</kbd>
        </label>
      )}
      <div className="admin-header-actions">
        <CreateMenu onCreate={onCreate} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="admin-notification-link"
          aria-label="View notifications"
          onClick={() => onNavigate("notifications")}
        >
          <Bell aria-hidden="true" />
        </Button>
        <UserMenu themeMode={themeMode} onThemeChange={onThemeChange} />
      </div>
    </header>
  );
}

export default AdminHeader;