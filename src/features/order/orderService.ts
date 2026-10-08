import type { Order } from "@/features/order/types";
import { API_BASE_URL } from "@/lib/api";

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/api/orders`);

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
};

// Create a new order
export const createOrder = async (
  orderData: Omit<Order, "id">,
): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return response.json();
};

// Update an existing order
export const updateOrder = async (
  id: string,
  orderData: Omit<Order, "id">,
): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error("Failed to update order");
  }

  return response.json();
};

// Delete a single order
export const deleteOrder = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete order");
  }
};

// Delete multiple orders
export const deleteOrders = async (ids: string[]): Promise<string[]> => {
  await Promise.all(ids.map((id) => deleteOrder(id)));

  return ids;
};