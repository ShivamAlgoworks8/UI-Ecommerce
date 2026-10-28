import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  formId: string;
  submitLabel: string;
  children: ReactNode;
};

function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  formId,
  submitLabel,
  children,
}: FormDrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="form-drawer-overlay" />
        <Dialog.Content className="form-drawer-content" aria-modal="true">
          <header className="form-drawer-header">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>{description}</Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button type="button" className="rounded-md p-1 text-muted-foreground" aria-label="Close drawer">
                  <X className="size-5" />
                </button>
              </Dialog.Close>
            </div>
          </header>
          <div className="form-drawer-body">{children}</div>
          <footer className="form-drawer-footer">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" form={formId}>{submitLabel}</Button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default FormDrawer;
