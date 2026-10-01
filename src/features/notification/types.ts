export type Notification = {
  id: number;
  title: string;
  message: string;
  type: "Info" | "Success" | "Warning" | "Alert";
  status: "Active" | "Inactive";
  date: string;
};
