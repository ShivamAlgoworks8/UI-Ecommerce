export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role?: string;
  status?: "Active" | "Inactive";
};
