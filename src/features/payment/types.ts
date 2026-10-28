export type Payment = {
  id: string;
  paymentId: string;
  orderId: string;
  paymentStatus: string;
  paymentType: string;
  paymentDate: string;
  paymentTime: string;
  paymentAmount: number;
  customerId: string;
  customerName: string;
};

export type PaymentFormMethod =
  | "UPI"
  | "Net Banking"
  | "Debit Card"
  | "Credit Card"
  | "Cash on Delivery"
  | "Gift Card";

export type PaymentFormStatus = "Paid" | "Pending" | "Failed";