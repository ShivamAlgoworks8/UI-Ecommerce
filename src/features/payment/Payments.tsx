
import { startTransition, useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Plus } from "lucide-react";

import { AdminPage, AdminPageHeader, EmptyState } from "@/components/admin/AdminPage";
import DataTable from "@/components/admin/DataTable";
import FormDrawer from "@/components/admin/FormDrawer";
import StatusPill from "@/components/admin/StatusPill";
import Toast from "@/components/admin/Toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  Payment,
  PaymentFormMethod,
  PaymentFormStatus,
} from "@/features/payment/types";
import type { CreateRequest } from "@/app/types";
import { API_BASE_URL } from "@/lib/api";
import { formatINR } from "@/lib/utils";

type PaymentsProps = {
  payments: Payment[];
  setPayments: Dispatch<SetStateAction<Payment[]>>;
  searchTerm: string;
  createRequest: CreateRequest | null;
  onCreateRequestHandled: (id: number) => void;
};

function Payments({
  payments,
  setPayments,
  searchTerm,
  createRequest,
  onCreateRequestHandled,
}: PaymentsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const [paymentId, setPaymentId] = useState("");
  const [customer, setCustomer] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentFormMethod>("UPI");
  const [status, setStatus] = useState<PaymentFormStatus>("Paid");
  const [date, setDate] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (createRequest?.page !== "payments") return;

    startTransition(() => {
      openAddModal();
      onCreateRequestHandled(createRequest.id);
    });
  }, [createRequest, onCreateRequestHandled]);

  const openEditModal = (payment: Payment) => {
    setEditingPayment(payment);
    setPaymentId(payment.paymentId ?? "");
    setCustomer(payment.customerName ?? "");
    setOrderId(payment.orderId ?? "");
    setAmount(payment.paymentAmount == null ? "" : String(payment.paymentAmount));
    setPaymentMethod((payment.paymentType ?? "UPI") as PaymentFormMethod);
    setStatus(
      (payment.paymentStatus == null
        ? "Paid"
        : payment.paymentStatus === "Completed"
        ? "Paid"
        : payment.paymentStatus) as PaymentFormStatus,
    );
    setDate(payment.paymentDate ?? "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    setIsSaving(true);

    const paymentRequest = {
      paymentId: paymentId.trim(),
      orderId: orderId.trim(),
      paymentStatus: status === "Paid" ? "Completed" : status,
      paymentType: paymentMethod,
      paymentDate: date,
      paymentTime: editingPayment?.paymentTime || "12:00:00",
      paymentAmount: Number(amount),
      customerId: editingPayment?.customerId || "CUST-ADMIN",
      customerName: customer.trim(),
    };

    try {
      const url = editingPayment
        ? `${API_BASE_URL}/api/payments/${editingPayment.id}`
        : `${API_BASE_URL}/api/payments`;

      const response = await fetch(url, {
        method: editingPayment ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        throw new Error(`Payment request failed: ${response.status}`);
      }

      const savedPayment: Payment = await response.json();

      if (editingPayment) {
        setPayments((previous) =>
          previous.map((payment) =>
            payment.id === savedPayment.id ? savedPayment : payment,
          ),
        );
      } else {
        setPayments((previous) => [...previous, savedPayment]);
      }

      closeModal();
      setToastMessage(
        editingPayment
          ? "Payment updated successfully"
          : "Payment added successfully",
      );
    } catch (error) {
      console.error("Payment save error:", error);
      setToastMessage("Could not save payment. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      setPayments((previous) =>
        previous.filter((payment) => payment.id !== id),
      );
      setToastMessage("Payment deleted successfully");
    } catch (error) {
      console.error("Payment delete error:", error);
      setToastMessage("Could not delete payment. Please try again.");
    }
  };

  const normalizedSearchTerm = searchTerm.toLowerCase();
  const filteredPayments = payments.filter((payment) =>
    [
      payment.paymentId,
      payment.customerName,
      payment.orderId,
      payment.paymentType,
      payment.paymentStatus,
      payment.paymentDate,
    ].some((value) =>
      (value ?? "").toLowerCase().includes(normalizedSearchTerm),
    ),
  );

  return (
    <AdminPage>
      <AdminPageHeader
        title="Payments"
        description="View and manage customer payments."
        action={
          <Button onClick={openAddModal}>
            <Plus /> Add Payment
          </Button>
        }
      />

      <DataTable
        title="Payment list"
        description="Customer payment transactions will appear here."
      >
        {filteredPayments.length === 0 ? (
          payments.length === 0 ? (
            <EmptyState
              title="No payments yet"
              description="Add a payment to see it listed here."
              action={
                <Button onClick={openAddModal}>
                  <Plus /> Add Payment
                </Button>
              }
            />
          ) : (
            <EmptyState
              title="No payments found"
              description="Try a different search."
            />
          )
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.paymentId}
                  </TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatINR(payment.paymentAmount ?? 0)}
                  </TableCell>
                  <TableCell>{payment.paymentType}</TableCell>
                  <TableCell>
                    <StatusPill
                      status={
                        payment.paymentStatus == null
                          ? ""
                          : payment.paymentStatus === "Completed"
                          ? "Paid"
                          : payment.paymentStatus
                      }
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {payment.paymentDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-primary hover:underline"
                        onClick={() => openEditModal(payment)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-sm font-medium text-destructive hover:underline"
                        onClick={() => handleDelete(payment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>

      <FormDrawer
        open={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        title={editingPayment ? "Edit Payment" : "Add Payment"}
        description={
          editingPayment
            ? "Update payment details."
            : "Enter the payment details."
        }
        formId="payment-form"
        submitLabel={
          isSaving
            ? "Saving..."
            : editingPayment
              ? "Save changes"
              : "Save payment"
        }
      >
        <form
          id="payment-form"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="payment-id">Payment ID</Label>
              <Input
                id="payment-id"
                value={paymentId}
                onChange={(event) => setPaymentId(event.target.value)}
                placeholder="Enter payment ID"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment-customer">Customer Name</Label>
              <Input
                id="payment-customer"
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment-order">Order ID</Label>
              <Input
                id="payment-order"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="Enter order ID"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment-amount">Amount</Label>
              <Input
                id="payment-amount"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) =>
                  setPaymentMethod(value as PaymentFormMethod)
                }
              >
                <SelectTrigger id="payment-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Net Banking">Net Banking</SelectItem>
                  <SelectItem value="Debit Card">Debit Card</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Cash on Delivery">
                    Cash on Delivery
                  </SelectItem>
                  <SelectItem value="Gift Card">Gift Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as PaymentFormStatus)
                }
              >
                <SelectTrigger id="payment-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payment-date">Date</Label>
              <Input
                id="payment-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </FormDrawer>

      <Toast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </AdminPage>
  );
}

export default Payments;
