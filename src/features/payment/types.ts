export type Payment = {
  id: number;
  paymentId: string;
  customer: string;
  orderId: string;
  amount: number;
  paymentMethod: "UPI" | "Net Banking" | "Debit Card" | "Credit Card" | "Cash on Delivery" | "Gift Card";
  status: "Paid" | "Pending" | "Failed";
  date: string;
};
