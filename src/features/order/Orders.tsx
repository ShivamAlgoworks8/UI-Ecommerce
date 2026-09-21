import { useState } from "react";
import "./Orders.css";

type Order = {
  id: number;
  orderId: string;
  customer: string;
  product: string;
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
};

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [orderId, setOrderId] = useState("");
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] =
    useState<Order["paymentStatus"]>("Paid");
  const [orderStatus, setOrderStatus] =
    useState<Order["orderStatus"]>("Processing");
  const [date, setDate] = useState("");

  const resetForm = () => {
    setOrderId("");
    setCustomer("");
    setProduct("");
    setAmount("");
    setPaymentStatus("Paid");
    setOrderStatus("Processing");
    setDate("");
    setEditingOrder(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (order: Order) => {
    setEditingOrder(order);

    setOrderId(order.orderId);
    setCustomer(order.customer);
    setProduct(order.product);
    setAmount(String(order.amount));
    setPaymentStatus(order.paymentStatus);
    setOrderStatus(order.orderStatus);
    setDate(order.date);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !orderId.trim() ||
      !customer.trim() ||
      !product.trim() ||
      !amount ||
      !date
    ) {
      return;
    }

    if (editingOrder) {
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === editingOrder.id
            ? {
                ...order,
                orderId: orderId.trim(),
                customer: customer.trim(),
                product: product.trim(),
                amount: Number(amount),
                paymentStatus,
                orderStatus,
                date,
              }
            : order
        )
      );
    } else {
      const newOrder: Order = {
        id: Date.now(),
        orderId: orderId.trim(),
        customer: customer.trim(),
        product: product.trim(),
        amount: Number(amount),
        paymentStatus,
        orderStatus,
        date,
      };

      setOrders((previousOrders) => [
        ...previousOrders,
        newOrder,
      ]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    setOrders((previousOrders) =>
      previousOrders.filter((order) => order.id !== id)
    );
  };

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Management</p>

          <h2>Orders</h2>

          <p className="admin-page-description">
            View and manage customer orders.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddModal}
        >
          + Add Order
        </button>
      </div>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <div>
            <h3>Order List</h3>

            <p>
              Orders placed by customers will appear here.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <strong>No orders yet</strong>

            <span>
              Add an order to see it listed here.
            </span>
          </div>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.orderId}</strong>
                    </td>

                    <td>{order.customer}</td>

                    <td>{order.product}</td>

                    <td>
                      ₹{order.amount.toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={`order-status payment-${order.paymentStatus.toLowerCase()}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`order-status order-${order.orderStatus.toLowerCase()}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td>{order.date}</td>

                    <td>
                      <div className="order-actions">
                        <button
                          type="button"
                          onClick={() => openEditModal(order)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-action"
                          onClick={() => handleDelete(order.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="admin-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <h3>
                  {editingOrder ? "Edit Order" : "Add Order"}
                </h3>

                <p>
                  {editingOrder
                    ? "Update order details."
                    : "Enter the order details."}
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="order-form-grid">
                  <div className="order-form-group">
                    <label>Order ID</label>

                    <input
                      type="text"
                      value={orderId}
                      onChange={(event) =>
                        setOrderId(event.target.value)
                      }
                      placeholder="Enter order ID"
                    />
                  </div>

                  <div className="order-form-group">
                    <label>Customer Name</label>

                    <input
                      type="text"
                      value={customer}
                      onChange={(event) =>
                        setCustomer(event.target.value)
                      }
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div className="order-form-group">
                    <label>Product</label>

                    <input
                      type="text"
                      value={product}
                      onChange={(event) =>
                        setProduct(event.target.value)
                      }
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="order-form-group">
                    <label>Amount</label>

                    <input
                      type="number"
                      min="0"
                      value={amount}
                      onChange={(event) =>
                        setAmount(event.target.value)
                      }
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="order-form-group">
                    <label>Payment Status</label>

                    <select
                      value={paymentStatus}
                      onChange={(event) =>
                        setPaymentStatus(
                          event.target.value as Order["paymentStatus"]
                        )
                      }
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>

                  <div className="order-form-group">
                    <label>Order Status</label>

                    <select
                      value={orderStatus}
                      onChange={(event) =>
                        setOrderStatus(
                          event.target.value as Order["orderStatus"]
                        )
                      }
                    >
                      <option value="Processing">
                        Processing
                      </option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">
                        Delivered
                      </option>
                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>

                  <div className="order-form-group">
                    <label>Date</label>

                    <input
                      type="date"
                      value={date}
                      onChange={(event) =>
                        setDate(event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {editingOrder ? "Update Order" : "Add Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Orders;