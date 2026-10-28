export type DeliveryAddress = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
};

export type OrderItem = {
  product: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type Order = {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  quantity?: number;
  items?: OrderItem[];
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  paymentMethod?: "COD" | "ONLINE";
  orderStatus: "Processing" | "Delivered" | "Cancelled" | "Returned";
  date: string;
  deliveryAddress?: DeliveryAddress;
};