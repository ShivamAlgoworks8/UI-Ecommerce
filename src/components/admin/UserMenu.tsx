import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  LogOut,
  Monitor,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";
import type { ThemeMode } from "@/app/types";

type UserMenuProps = {
  themeMode: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onLogout: () => void;
};

const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Match my device", icon: Monitor },
];

function UserMenu({ themeMode, onThemeChange, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
        setIsThemeExpanded(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsThemeExpanded(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((open) => !open);
    setIsThemeExpanded(false);
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="user-menu-trigger"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={toggleMenu}
      >
        <span className="user-avatar" aria-hidden="true">S</span>
        <span className="user-menu-identity">
          <strong>Shivam</strong>
          <span>Administrator</span>
        </span>
        <ChevronDown className="user-menu-chevron size-4 text-muted-foreground" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="user-menu-panel" role="menu" aria-label="User menu">
          <div className="user-menu-account">
            <CircleUserRound className="size-8 shrink-0 text-primary" aria-hidden="true" />
            <span className="grid gap-1">
              <strong className="text-sm font-semibold">Shivam</strong>
              <span className="text-xs text-muted-foreground">Administrator</span>
            </span>
          </div>
          <div className="user-menu-separator" />
          <button type="button" role="menuitem" className="user-menu-option">
            <UserRound className="size-4" aria-hidden="true" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className="user-menu-option"
            aria-expanded={isThemeExpanded}
            onClick={() => setIsThemeExpanded((expanded) => !expanded)}
          >
            <Sun className="size-4" aria-hidden="true" />
            <span className="flex-1 text-left">Theme</span>
            <ChevronRight className={`size-4 transition-transform ${isThemeExpanded ? "rotate-90" : ""}`} aria-hidden="true" />
          </button>
          {isThemeExpanded && (
            <div className="ml-4 border-l border-border pl-2" role="group" aria-label="Theme">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  className="user-menu-option text-sm"
                  role="menuitemradio"
                  aria-checked={themeMode === value}
                  onClick={() => onThemeChange(value)}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span className="flex-1 text-left">{label}</span>
                  {themeMode === value && <Check className="size-4 text-primary" aria-label="Active theme" />}
                </button>
              ))}
            </div>
          )}
          <div className="user-menu-separator" />
          <button
            type="button"
            role="menuitem"
            className="user-menu-option user-menu-option-danger"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
          >
            <LogOut className="size-4" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
