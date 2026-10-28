export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "Info" | "Success" | "Warning" | "Alert";
  status: "Active" | "Inactive";
  date: string;
  read?: boolean;
  createdAt?: string;
};