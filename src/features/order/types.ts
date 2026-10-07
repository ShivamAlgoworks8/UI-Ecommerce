export type Order = {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  orderStatus: "Processing" | "Delivered" | "Cancelled" | "Returned";
  date: string;
};