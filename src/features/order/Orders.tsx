import { startTransition, useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Plus, Trash2 } from "lucide-react";
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

export type Order = {
  id: number;
  orderId: string;
  customer: string;
  product: string;
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  orderStatus: "Processing" | "Delivered" | "Cancelled" | "Returned";
  date: string;
};

type OrdersProps = {
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  searchTerm: string;
  createRequest: { page: string; id: number } | null;
  onCreateRequestHandled: (id: number) => void;
};

function Orders({ orders, setOrders, searchTerm, createRequest, onCreateRequestHandled }: OrdersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderId, setOrderId] = useState("");
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<Order["paymentStatus"]>("Paid");
  const [orderStatus, setOrderStatus] = useState<Order["orderStatus"]>("Processing");
  const [date, setDate] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | Order["orderStatus"]>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState<Order["orderStatus"] | "">("");

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

  useEffect(() => {
    if (createRequest?.page !== "orders") return;
    startTransition(() => {
      openAddModal();
      onCreateRequestHandled(createRequest.id);
    });
  }, [createRequest, onCreateRequestHandled]);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!orderId.trim() || !customer.trim() || !product.trim() || !amount || !date) return;

    const wasEditing = Boolean(editingOrder);
    if (editingOrder) {
      setOrders((previousOrders) => previousOrders.map((order) =>
        order.id === editingOrder.id
          ? { ...order, orderId: orderId.trim(), customer: customer.trim(), product: product.trim(), amount: Number(amount), paymentStatus, orderStatus, date }
          : order,
      ));
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
      setOrders((previousOrders) => [...previousOrders, newOrder]);
    }
    closeModal();
    setToastMessage(wasEditing ? "Order updated successfully" : "Order added successfully");
  };

  const handleDelete = (id: number) => {
    setOrders((previousOrders) => previousOrders.filter((order) => order.id !== id));
    setSelectedOrderIds((previous) => previous.filter((selectedId) => selectedId !== id));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = [
      order.orderId,
      order.customer,
      order.product,
      order.paymentStatus,
      order.orderStatus,
      order.date,
    ].some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "All" || order.orderStatus === statusFilter;
    const matchesDateFrom = !dateFrom || order.date >= dateFrom;
    const matchesDateTo = !dateTo || order.date <= dateTo;
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const toggleOrder = (id: number) => {
    setSelectedOrderIds((previous) => previous.includes(id)
      ? previous.filter((selectedId) => selectedId !== id)
      : [...previous, id],
    );
  };

  const toggleVisibleOrders = () => {
    const visibleIds = filteredOrders.map((order) => order.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedOrderIds.includes(id));
    setSelectedOrderIds((previous) => allSelected
      ? previous.filter((id) => !visibleIds.includes(id))
      : [...new Set([...previous, ...visibleIds])],
    );
  };

  const updateSelectedStatuses = () => {
    if (!bulkStatus || selectedOrderIds.length === 0) return;
    setOrders((previous) => previous.map((order) => selectedOrderIds.includes(order.id)
      ? { ...order, orderStatus: bulkStatus }
      : order,
    ));
    setSelectedOrderIds([]);
    setBulkStatus("");
    setToastMessage("Selected order statuses updated");
  };

  const handleBulkStatusChange = (value: string) => {
    if (value === "none") {
      setBulkStatus("");
    } else if (value === "Delivered" || value === "Processing" || value === "Cancelled" || value === "Returned") {
      setBulkStatus(value);
    }
  };

  const deleteSelectedOrders = () => {
    if (selectedOrderIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedOrderIds.length} selected order${selectedOrderIds.length === 1 ? "" : "s"}?`)) return;
    setOrders((previous) => previous.filter((order) => !selectedOrderIds.includes(order.id)));
    setSelectedOrderIds([]);
    setToastMessage("Selected orders deleted");
  };

  return (
    <AdminPage>
      <AdminPageHeader title="Orders" description="View and manage customer orders." action={<Button onClick={openAddModal}><Plus />Add Order</Button>} />
      <DataTable
        title="Order list"
        description="Orders placed by customers will appear here."
        toolbar={
          <div className="order-toolbar">
            <Select value={statusFilter} onValueChange={(value: "All" | Order["orderStatus"]) => setStatusFilter(value)}>
              <SelectTrigger aria-label="Filter by order status" className="order-status-filter"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <Input aria-label="Orders from date" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
            <Input aria-label="Orders through date" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
            <div className="bulk-actions">
              <span>{selectedOrderIds.length} selected</span>
              <Select value={bulkStatus || "none"} onValueChange={handleBulkStatusChange}>
                <SelectTrigger aria-label="Set selected order status" className="bulk-status-select"><SelectValue placeholder="Set status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" disabled>Set status</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" disabled={!bulkStatus || selectedOrderIds.length === 0} onClick={updateSelectedStatuses}>Apply status</Button>
              <Button variant="outline" disabled={selectedOrderIds.length === 0} onClick={deleteSelectedOrders}><Trash2 />Delete selected</Button>
            </div>
          </div>
        }
      >
        {filteredOrders.length === 0 ? (
          orders.length === 0
            ? <EmptyState title="No orders yet" description="Add an order to see it listed here." action={<Button onClick={openAddModal}><Plus />Add Order</Button>} />
            : <EmptyState title="No orders found" description="Try a different search." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <TableHead className="w-12 px-[18px]">
                  <input
                    type="checkbox"
                    aria-label="Select filtered orders"
                    checked={filteredOrders.length > 0 && filteredOrders.every((order) => selectedOrderIds.includes(order.id))}
                    onChange={toggleVisibleOrders}
                  />
                </TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Order ID</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Customer</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Product</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Amount</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Payment</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Order status</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Date</TableHead>
                <TableHead className="h-12 px-[18px] text-right text-sm font-medium normal-case tracking-normal">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-t border-border">
                  <TableCell className="px-[18px] py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select order ${order.orderId}`}
                      checked={selectedOrderIds.includes(order.id)}
                      onChange={() => toggleOrder(order.id)}
                    />
                  </TableCell>
                  <TableCell className="px-[18px] py-3 font-medium">{order.orderId}</TableCell>
                  <TableCell className="px-[18px] py-3">{order.customer}</TableCell>
                  <TableCell className="px-[18px] py-3">{order.product}</TableCell>
                  <TableCell className="whitespace-nowrap px-[18px] py-3">
                    {order.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                  </TableCell>
                  <TableCell className="px-[18px] py-3"><StatusPill status={order.paymentStatus} /></TableCell>
                  <TableCell className="px-[18px] py-3"><StatusPill status={order.orderStatus} /></TableCell>
                  <TableCell className="whitespace-nowrap px-[18px] py-3">{order.date}</TableCell>
                  <TableCell className="px-[18px] py-3">
                    <div className="flex justify-end gap-4">
                      <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => openEditModal(order)}>Edit</button>
                      <button type="button" className="text-sm font-medium text-destructive hover:underline" onClick={() => handleDelete(order.id)}>Delete</button>
                  </div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>

      <FormDrawer
        open={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        title={editingOrder ? "Edit Order" : "Add Order"}
        description={editingOrder ? "Update order details." : "Enter the order details."}
        formId="order-form"
        submitLabel={editingOrder ? "Save changes" : "Save order"}
      >
          <form id="order-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2"><Label htmlFor="order-id">Order ID</Label><Input id="order-id" value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Enter order ID" required /></div>
              <div className="grid gap-2"><Label htmlFor="order-customer">Customer Name</Label><Input id="order-customer" value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Enter customer name" required /></div>
              <div className="grid gap-2"><Label htmlFor="order-product">Product</Label><Input id="order-product" value={product} onChange={(event) => setProduct(event.target.value)} placeholder="Enter product name" required /></div>
              <div className="grid gap-2"><Label htmlFor="order-amount">Amount</Label><Input id="order-amount" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Enter amount" required /></div>
              <div className="grid gap-2">
                <Label htmlFor="order-payment-status">Payment Status</Label>
                <Select value={paymentStatus} onValueChange={(value: Order["paymentStatus"]) => setPaymentStatus(value)}>
                  <SelectTrigger id="order-payment-status"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Failed">Failed</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order-status">Order Status</Label>
                <Select value={orderStatus} onValueChange={(value: Order["orderStatus"]) => setOrderStatus(value)}>
                  <SelectTrigger id="order-status"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Delivered">Delivered</SelectItem><SelectItem value="Processing">Processing</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem><SelectItem value="Returned">Returned</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label htmlFor="order-date">Date</Label><Input id="order-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></div>
            </div>
          </form>
      </FormDrawer>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </AdminPage>
  );
}

export default Orders;