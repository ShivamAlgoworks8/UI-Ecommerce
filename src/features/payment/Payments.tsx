import { useState } from "react";
import "./Payments.css";

type Payment = {
  id: number;
  paymentId: string;
  customer: string;
  orderId: string;
  amount: number;
  paymentMethod: "Card" | "UPI" | "Net Banking" | "Cash";
  status: "Paid" | "Pending" | "Failed";
  date: string;
};

function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] =
    useState<Payment | null>(null);

  const [paymentId, setPaymentId] = useState("");
  const [customer, setCustomer] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<Payment["paymentMethod"]>("UPI");
  const [status, setStatus] =
    useState<Payment["status"]>("Paid");
  const [date, setDate] = useState("");

  const resetForm = () => {
    setPaymentId("");
    setCustomer("");
    setOrderId("");
    setAmount("");
    setPaymentMethod("UPI");
    setStatus("Paid");
    setDate("");
    setEditingPayment(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (payment: Payment) => {
    setEditingPayment(payment);

    setPaymentId(payment.paymentId);
    setCustomer(payment.customer);
    setOrderId(payment.orderId);
    setAmount(String(payment.amount));
    setPaymentMethod(payment.paymentMethod);
    setStatus(payment.status);
    setDate(payment.date);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !paymentId.trim() ||
      !customer.trim() ||
      !orderId.trim() ||
      !amount ||
      !date
    ) {
      return;
    }

    if (editingPayment) {
      setPayments((previousPayments) =>
        previousPayments.map((payment) =>
          payment.id === editingPayment.id
            ? {
                ...payment,
                paymentId: paymentId.trim(),
                customer: customer.trim(),
                orderId: orderId.trim(),
                amount: Number(amount),
                paymentMethod,
                status,
                date,
              }
            : payment
        )
      );
    } else {
      const newPayment: Payment = {
        id: Date.now(),
        paymentId: paymentId.trim(),
        customer: customer.trim(),
        orderId: orderId.trim(),
        amount: Number(amount),
        paymentMethod,
        status,
        date,
      };

      setPayments((previousPayments) => [
        ...previousPayments,
        newPayment,
      ]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    setPayments((previousPayments) =>
      previousPayments.filter((payment) => payment.id !== id)
    );
  };

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Management</p>

          <h2>Payments</h2>

          <p className="admin-page-description">
            View and manage customer payments.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddModal}
        >
          + Add Payment
        </button>
      </div>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <div>
            <h3>Payment List</h3>

            <p>
              Customer payment transactions will appear here.
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="empty-state">
            <strong>No payments yet</strong>

            <span>
              Add a payment to see it listed here.
            </span>
          </div>
        ) : (
          <div className="payments-table-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Customer</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <strong>{payment.paymentId}</strong>
                    </td>

                    <td>{payment.customer}</td>

                    <td>{payment.orderId}</td>

                    <td>
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>

                    <td>{payment.paymentMethod}</td>

                    <td>
                      <span
                        className={`payment-status payment-${payment.status.toLowerCase()}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td>{payment.date}</td>

                    <td>
                      <div className="payment-actions">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(payment)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-action"
                          onClick={() =>
                            handleDelete(payment.id)
                          }
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
                  {editingPayment
                    ? "Edit Payment"
                    : "Add Payment"}
                </h3>

                <p>
                  {editingPayment
                    ? "Update payment details."
                    : "Enter the payment details."}
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
                <div className="payment-form-grid">
                  <div className="payment-form-group">
                    <label>Payment ID</label>

                    <input
                      type="text"
                      value={paymentId}
                      onChange={(event) =>
                        setPaymentId(event.target.value)
                      }
                      placeholder="Enter payment ID"
                    />
                  </div>

                  <div className="payment-form-group">
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

                  <div className="payment-form-group">
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

                  <div className="payment-form-group">
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

                  <div className="payment-form-group">
                    <label>Payment Method</label>

                    <select
                      value={paymentMethod}
                      onChange={(event) =>
                        setPaymentMethod(
                          event.target.value as Payment["paymentMethod"]
                        )
                      }
                    >
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Net Banking">
                        Net Banking
                      </option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>

                  <div className="payment-form-group">
                    <label>Status</label>

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value as Payment["status"]
                        )
                      }
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>

                  <div className="payment-form-group">
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
                  {editingPayment
                    ? "Update Payment"
                    : "Add Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Payments;