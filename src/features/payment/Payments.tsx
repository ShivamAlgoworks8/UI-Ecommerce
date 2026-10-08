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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Payment } from "@/features/payment/types";
import type { CreateRequest } from "@/app/types";
import { formatINR } from "@/lib/utils";

type PaymentsProps = {
  payments: Payment[];
  setPayments: Dispatch<SetStateAction<Payment[]>>;
  searchTerm: string;
  createRequest: CreateRequest | null;
  onCreateRequestHandled: (id: number) => void;
};

function Payments({ payments, setPayments, searchTerm, createRequest, onCreateRequestHandled }: PaymentsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [paymentId, setPaymentId] = useState("");
  const [customer, setCustomer] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<Payment["paymentMethod"]>("UPI");
  const [status, setStatus] = useState<Payment["status"]>("Paid");
  const [date, setDate] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!paymentId.trim() || !customer.trim() || !orderId.trim() || !amount || !date) return;

    const wasEditing = Boolean(editingPayment);
    if (editingPayment) {
      setPayments((previousPayments) => previousPayments.map((payment) =>
        payment.id === editingPayment.id
          ? { ...payment, paymentId: paymentId.trim(), customer: customer.trim(), orderId: orderId.trim(), amount: Number(amount), paymentMethod, status, date }
          : payment,
      ));
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
      setPayments((previousPayments) => [...previousPayments, newPayment]);
    }
    closeModal();
    setToastMessage(wasEditing ? "Payment updated successfully" : "Payment added successfully");
  };

  const handleDelete = (id: number) => {
    setPayments((previousPayments) => previousPayments.filter((payment) => payment.id !== id));
  };

  const filteredPayments = payments.filter((payment) => [
    payment.paymentId,
    payment.customer,
    payment.orderId,
    payment.paymentMethod,
    payment.status,
    payment.date,
  ].some((value) => value.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <AdminPage>
      <AdminPageHeader title="Payments" description="View and manage customer payments." action={<Button onClick={openAddModal}><Plus />Add Payment</Button>} />
      <DataTable title="Payment list" description="Customer payment transactions will appear here.">
        {filteredPayments.length === 0 ? (
          payments.length === 0
            ? <EmptyState title="No payments yet" description="Add a payment to see it listed here." action={<Button onClick={openAddModal}><Plus />Add Payment</Button>} />
            : <EmptyState title="No payments found" description="Try a different search." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Payment ID</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Customer</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Order ID</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Amount</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Method</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Status</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Date</TableHead>
                <TableHead className="h-12 px-[18px] text-right text-sm font-medium normal-case tracking-normal">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="border-t border-border">
                  <TableCell className="px-[18px] py-3 font-medium">{payment.paymentId}</TableCell>
                  <TableCell className="px-[18px] py-3">{payment.customer}</TableCell>
                  <TableCell className="px-[18px] py-3">{payment.orderId}</TableCell>
                  <TableCell className="whitespace-nowrap px-[18px] py-3">
                    {formatINR(payment.amount)}
                  </TableCell>
                  <TableCell className="px-[18px] py-3">{payment.paymentMethod}</TableCell>
                  <TableCell className="px-[18px] py-3"><StatusPill status={payment.status} /></TableCell>
                  <TableCell className="whitespace-nowrap px-[18px] py-3">{payment.date}</TableCell>
                  <TableCell className="px-[18px] py-3">
                    <div className="flex justify-end gap-4">
                      <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => openEditModal(payment)}>Edit</button>
                      <button type="button" className="text-sm font-medium text-destructive hover:underline" onClick={() => handleDelete(payment.id)}>Delete</button>
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
        description={editingPayment ? "Update payment details." : "Enter the payment details."}
        formId="payment-form"
        submitLabel={editingPayment ? "Save changes" : "Save payment"}
      >
          <form id="payment-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2"><Label htmlFor="payment-id">Payment ID</Label><Input id="payment-id" value={paymentId} onChange={(event) => setPaymentId(event.target.value)} placeholder="Enter payment ID" required /></div>
              <div className="grid gap-2"><Label htmlFor="payment-customer">Customer Name</Label><Input id="payment-customer" value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Enter customer name" required /></div>
              <div className="grid gap-2"><Label htmlFor="payment-order">Order ID</Label><Input id="payment-order" value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Enter order ID" required /></div>
              <div className="grid gap-2"><Label htmlFor="payment-amount">Amount</Label><Input id="payment-amount" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Enter amount" required /></div>
              <div className="grid gap-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value: Payment["paymentMethod"]) => setPaymentMethod(value)}>
                  <SelectTrigger id="payment-method"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Net Banking">Net Banking</SelectItem>
                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                    <SelectItem value="Gift Card">Gift Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-status">Status</Label>
                <Select value={status} onValueChange={(value: Payment["status"]) => setStatus(value)}>
                  <SelectTrigger id="payment-status"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Failed">Failed</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label htmlFor="payment-date">Date</Label><Input id="payment-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></div>
            </div>
          </form>
      </FormDrawer>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </AdminPage>
  );
}

export default Payments;