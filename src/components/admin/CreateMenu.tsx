import { useEffect, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const createOptions = [
  { page: "products", label: "Product" },
  { page: "orders", label: "Order" },
  { page: "merchant", label: "Merchant" },
  { page: "payments", label: "Payment" },
  { page: "notifications", label: "Notification" },
] as const;

type CreateMenuProps = {
  onCreate: (page: string) => void;
};

function CreateMenu({ onCreate }: CreateMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className="create-menu" ref={menuRef}>
      <Button
        type="button"
        className="create-menu-trigger"
        aria-label="Create"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <Plus aria-hidden="true" />
        <span className="create-menu-label">Create</span>
        <ChevronDown className="create-menu-chevron" aria-hidden="true" />
      </Button>
      {isOpen && (
        <div className="create-menu-panel" role="menu" aria-label="Create new">
          {createOptions.map(({ page, label }) => (
            <button
              key={page}
              type="button"
              role="menuitem"
              className="create-menu-item"
              onClick={() => {
                setIsOpen(false);
                onCreate(page);
              }}
            >
              <Plus className="size-4 text-muted-foreground" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreateMenu;
