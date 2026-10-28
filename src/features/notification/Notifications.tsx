import { startTransition, useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Plus } from "lucide-react";
import { AdminPage, AdminPageHeader, EmptyState } from "@/components/admin/AdminPage";
import DataTable from "@/components/admin/DataTable";
import FormDrawer from "@/components/admin/FormDrawer";
import StatusPill from "@/components/admin/StatusPill";
import Toast from "@/components/admin/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Notification } from "@/features/notification/types";
import type { CreateRequest } from "@/app/types";
import { API_BASE_URL } from "@/lib/api";

type NotificationsProps = {
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  searchTerm: string;
  createRequest: CreateRequest | null;
  onCreateRequestHandled: (id: number) => void;
};

function Notifications({ notifications, setNotifications, searchTerm, createRequest, onCreateRequestHandled }: NotificationsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<Notification["type"]>("Info");
  const [status, setStatus] = useState<Notification["status"]>("Active");
  const [date, setDate] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/notifications`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data: Array<{
          id: string;
          title: string;
          message: string;
          type: Notification["type"];
          status?: Notification["status"];
          date?: string;
          read?: boolean;
          createdAt?: string;
        }> = await response.json();

        setNotifications(
          data.map((item) => ({
            id: item.id,
            title: item.title,
            message: item.message,
            type: item.type,
            status: item.status ?? "Active",
            date:
              item.date ??
              item.createdAt?.slice(0, 10) ??
              new Date().toISOString().slice(0, 10),
            read: item.read ?? false,
            createdAt: item.createdAt,
          })),
        );
      } catch (error) {
        console.error("Notification fetch failed:", error);
        setToastMessage("Failed to load notifications");
      }
    };

    void fetchNotifications();
  }, [setNotifications]);

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType("Info");
    setStatus("Active");
    setDate("");
    setEditingNotification(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (createRequest?.page !== "notifications") return;
    startTransition(() => {
      openAddModal();
      onCreateRequestHandled(createRequest.id);
    });
  }, [createRequest, onCreateRequestHandled]);

  const openEditModal = (notification: Notification) => {
    setEditingNotification(notification);
    setTitle(notification.title);
    setMessage(notification.message);
    setType(notification.type);
    setStatus(notification.status);
    setDate(notification.date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !message.trim() || !date) {
      return;
    }

    const payload = {
      title: title.trim(),
      message: message.trim(),
      type,
      status,
      date,
    };

    try {
      const wasEditing = Boolean(editingNotification);
      const response = await fetch(
        editingNotification
          ? `${API_BASE_URL}/api/notifications/${editingNotification.id}`
          : `${API_BASE_URL}/api/notifications`,
        {
          method: wasEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save notification");
      }

      const saved: {
        id: string;
        title: string;
        message: string;
        type: Notification["type"];
        status?: Notification["status"];
        date?: string;
        read?: boolean;
        createdAt?: string;
      } = await response.json();

      const savedNotification: Notification = {
        id: saved.id,
        title: saved.title,
        message: saved.message,
        type: saved.type,
        status: saved.status ?? "Active",
        date:
          saved.date ??
          saved.createdAt?.slice(0, 10) ??
          date,
        read: saved.read ?? false,
        createdAt: saved.createdAt,
      };

      setNotifications((previous) =>
        wasEditing
          ? previous.map((item) =>
              item.id === savedNotification.id
                ? savedNotification
                : item,
            )
          : [...previous, savedNotification],
      );

      closeModal();
      setToastMessage(
        wasEditing
          ? "Notification updated successfully"
          : "Notification added successfully",
      );
    } catch (error) {
      console.error("Notification save failed:", error);
      setToastMessage("Failed to save notification");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((previous) =>
        previous.filter((item) => item.id !== id),
      );

      setToastMessage("Notification deleted successfully");
    } catch (error) {
      console.error("Notification delete failed:", error);
      setToastMessage("Failed to delete notification");
    }
  };

  const filteredNotifications = notifications.filter((notification) => [
    notification.title,
    notification.message,
    notification.type,
    notification.status,
    notification.date,
  ].some((value) => value.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <AdminPage>
      <AdminPageHeader
        title="Notifications"
        description="View and manage system notifications."
        action={<Button onClick={openAddModal}><Plus />Add Notification</Button>}
      />

      <DataTable title="Notification list" description="Notifications will appear here.">
        {filteredNotifications.length === 0 ? (
          notifications.length === 0
            ? <EmptyState title="No notifications yet" description="Add a notification to see it listed here." action={<Button onClick={openAddModal}><Plus />Add Notification</Button>} />
            : <EmptyState title="No notifications found" description="Try a different search." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Title</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Message</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Type</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Status</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Date</TableHead>
                <TableHead className="h-12 px-[18px] text-right text-sm font-medium normal-case tracking-normal">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id} className="border-t border-border">
                  <TableCell className="px-[18px] py-3 font-medium">{notification.title}</TableCell>
                  <TableCell className="max-w-xs truncate px-[18px] py-3">{notification.message}</TableCell>
                  <TableCell className="px-[18px] py-3"><StatusPill status={notification.type} /></TableCell>
                  <TableCell className="px-[18px] py-3"><StatusPill status={notification.status} /></TableCell>
                  <TableCell className="whitespace-nowrap px-[18px] py-3">{notification.date}</TableCell>
                  <TableCell className="px-[18px] py-3">
                    <div className="flex justify-end gap-4">
                      <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => openEditModal(notification)}>Edit</button>
                      <button type="button" className="text-sm font-medium text-destructive hover:underline" onClick={() => handleDelete(notification.id)}>Delete</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>

      <FormDrawer
        open={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        title={editingNotification ? "Edit Notification" : "Add Notification"}
        description={editingNotification ? "Update notification details." : "Enter the notification details."}
        formId="notification-form"
        submitLabel={editingNotification ? "Save changes" : "Save notification"}
      >
          <form id="notification-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="notification-title">Title</Label>
                <Input id="notification-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter notification title" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notification-type">Type</Label>
                <Select value={type} onValueChange={(value: Notification["type"]) => setType(value)}>
                  <SelectTrigger id="notification-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Info">Info</SelectItem>
                    <SelectItem value="Success">Success</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
                    <SelectItem value="Alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="notification-message">Message</Label>
                <Textarea id="notification-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Enter notification message" rows={4} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notification-status">Status</Label>
                <Select value={status} onValueChange={(value: Notification["status"]) => setStatus(value)}>
                  <SelectTrigger id="notification-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notification-date">Date</Label>
                <Input id="notification-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
              </div>
            </div>
          </form>
      </FormDrawer>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </AdminPage>
  );
}

export default Notifications;