import { startTransition, useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Plus,
  Trash2,
} from "lucide-react";

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
import type { Order } from "@/features/order/types";
import type { CreateRequest } from "@/app/types";
import { formatINR } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";import {
  createOrder,
  deleteOrder,
  deleteOrders,
  getOrders,
  updateOrder,
} from "@/features/order/orderService";

type OrdersProps = {
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  searchTerm: string;
  createRequest: CreateRequest | null;
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
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<Order["orderStatus"] | "">("");
  
  // React Query - Fetch Orders
  // Load the current order list from the service.
  const { data: fetchedOrders, error } = useQuery({
  queryKey: ["orders"],
  queryFn: getOrders,
});
// Keep the shared order list in sync after creating an order.
const createOrderMutation = useMutation({
  mutationFn: createOrder,

  onSuccess: (newOrder) => {
    setOrders((previousOrders) => [...previousOrders, newOrder]);
    closeModal();
    setToastMessage("Order added successfully");
  },

  onError: (error) => {
    console.error("Order request failed:", error);
    setToastMessage("Failed to save order");
  },
});
// Persist edits and replace the matching order with the server response.
const updateOrderMutation = useMutation({
  mutationFn: ({ id, orderData }: { id: string; orderData: Omit<Order, "id"> }) =>
    updateOrder(id, orderData),

  onSuccess: (updatedOrder) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order,
      ),
    );
    closeModal();
    setToastMessage("Order updated successfully");
  },

  onError: (error) => {
    console.error("Order update failed:", error);
    setToastMessage("Failed to update order");
  },
});
useEffect(() => {
  if (fetchedOrders) {
    setOrders(fetchedOrders);
  }

  if (error) {
    console.error("Failed to fetch orders:", error);
    setToastMessage("Unable to load orders");
  }
}, [fetchedOrders, error, setOrders]);

    // Form state is reset whenever the drawer starts a new order or closes.
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

  // Validate the required fields, then create a new order or save the current edit.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!orderId.trim() || !customer.trim() || !product.trim() || !amount || !date) return;

    const orderData = {
      orderId: orderId.trim(),
      customer: customer.trim(),
      product: product.trim(),
      amount: Number(amount),
      paymentStatus,
      orderStatus,
      date,
    };
try {
 if (editingOrder) {
  updateOrderMutation.mutate({
    id: editingOrder.id,
    orderData,
  });
} else {
    createOrderMutation.mutate(orderData);
  }
} catch (error) {
  console.error("Order request failed:", error);
  setToastMessage("Failed to save order");
}
  };

  // Delete one order and remove it from the local list after the API succeeds.
  const deleteOrderMutation = useMutation({
  mutationFn: deleteOrder,

  onSuccess: (_, deletedId) => {
    setOrders((previousOrders) =>
      previousOrders.filter((order) => order.id !== deletedId),
    );

    setSelectedOrderIds((previous) =>
      previous.filter((selectedId) => selectedId !== deletedId),
    );

    setToastMessage("Order deleted successfully");
  },

  onError: (error) => {
    console.error("Delete order failed:", error);
    setToastMessage("Failed to delete order");
  },
});
// Bulk Delete Orders
// Delete multiple selected orders
const deleteSelectedOrdersMutation = useMutation({
  mutationFn: deleteOrders,

  onSuccess: (_, deletedIds) => {
    setOrders((previousOrders) =>
      previousOrders.filter((order) => !deletedIds.includes(order.id)),
    );

    setSelectedOrderIds([]);
    setToastMessage("Selected orders deleted successfully");
  },

  onError: (error) => {
    console.error("Bulk delete orders failed:", error);
    setToastMessage("Failed to delete selected orders");
  },
});

// Bulk Status Update: persist each selected order's status and apply server results.
const updateSelectedStatusesMutation = useMutation({
  mutationFn: async ({
    ids,
    status,
  }: {
    ids: string[];
    status: Order["orderStatus"];
  }) => {
    const updatedOrders = await Promise.all(
      ids.map((id) =>
        updateOrder(id, {
          ...orders.find((order) => order.id === id)!,
          orderStatus: status,
        }),
      ),
    );

    return updatedOrders;
  },

  onSuccess: (updatedOrders) => {
    setOrders((previousOrders) =>
      previousOrders.map(
        (order) =>
          updatedOrders.find((updated) => updated.id === order.id) || order,
      ),
    );

    setSelectedOrderIds([]);
    setBulkStatus("");
    setToastMessage("Selected order statuses updated");
  },

  onError: (error) => {
    console.error("Bulk status update failed:", error);
    setToastMessage("Failed to update selected order statuses");
  },
});

const handleDelete = (id: string) => {
  deleteOrderMutation.mutate(id);
};

  const [sortField, setSortField] = useState<"orderId" | "customer" | "date" | "amount" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Cycle the active column through ascending, descending, and unsorted.
  const handleSort = (field: "orderId" | "customer" | "date" | "amount") => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filtering and Sorting
  // Apply the search term and active status/date filters before sorting.
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

  // Sort a copy so the source order list remains unchanged.
  const sortedOrders = [...filteredOrders].sort((first, second) => {
    if (!sortField) return 0;
    const aVal = first[sortField];
    const bVal = second[sortField];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  });

  // Export the currently visible, sorted orders as a downloadable CSV.
  const exportCSV = () => {
    if (sortedOrders.length === 0) return;
    const headers = ["Order ID", "Customer", "Product", "Amount", "Payment Status", "Order Status", "Date"];
    const rows = sortedOrders.map((o) => [
      `"${o.orderId.replace(/"/g, '""')}"`,
      `"${o.customer.replace(/"/g, '""')}"`,
      `"${o.product.replace(/"/g, '""')}"`,
      o.amount,
      `"${o.paymentStatus}"`,
      `"${o.orderStatus}"`,
      `"${o.date}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nexora_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToastMessage("Orders exported to CSV");
  };

  // Order Selection
  // Keep selected IDs in step with individual and visible-row checkbox changes.
  const toggleOrder = (id: string) => {
    setSelectedOrderIds((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id],
    );
  };

  const toggleVisibleOrders = () => {
    const visibleIds = sortedOrders.map((order) => order.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedOrderIds.includes(id));
    setSelectedOrderIds((previous) => allSelected
      ? previous.filter((id) => !visibleIds.includes(id))
      : [...new Set([...previous, ...visibleIds])],
    );
  };

  const updateSelectedStatuses = () => {
    if (!bulkStatus || selectedOrderIds.length === 0) return;

    updateSelectedStatusesMutation.mutate({
      ids: selectedOrderIds,
      status: bulkStatus,
    });
  };

  const handleBulkStatusChange = (value: string) => {
    if (value === "none") {
      setBulkStatus("");
    } else if (value === "Delivered" || value === "Processing" || value === "Cancelled" || value === "Returned") {
      setBulkStatus(value);
    }
  };

  // Confirm and delete selected orders
  const deleteSelectedOrders = () => {
    if (selectedOrderIds.length === 0) return;

    if (
      !window.confirm(
        `Delete ${selectedOrderIds.length} selected order${
          selectedOrderIds.length === 1 ? "" : "s"
        }?`,
      )
    ) {
      return;
    }

    deleteSelectedOrdersMutation.mutate(selectedOrderIds);
  };

  const orderChips = [
    { id: "All", label: "All Orders" },
    { id: "Processing", label: "Processing" },
    { id: "Delivered", label: "Delivered" },
    { id: "Cancelled", label: "Cancelled" },
    { id: "Returned", label: "Returned" },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        title="Orders"
        description="Fulfill, filter, and track customer shipments and transaction orders."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5" disabled={sortedOrders.length === 0}>
              <Download className="size-4" />
              Export CSV
            </Button>
            <Button size="sm" onClick={openAddModal} className="gap-1.5 shadow-sm">
              <Plus className="size-4" />
              Add Order
            </Button>
          </div>
        }
      />

      {/* Quick Filter Chips */}
      <div className="filter-chips-bar" role="group" aria-label="Order status filters">
        {orderChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={`filter-chip ${statusFilter === chip.id ? "filter-chip-active" : ""}`}
            onClick={() => setStatusFilter(chip.id as any)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <DataTable
        title="Orders ledger"
        description="Live records of purchases placed across your storefront."
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
              <Button variant="outline" size="sm" disabled={!bulkStatus || selectedOrderIds.length === 0} onClick={updateSelectedStatuses}>Apply status</Button>
              <Button variant="outline" size="sm" disabled={selectedOrderIds.length === 0} onClick={deleteSelectedOrders}><Trash2 className="size-3.5" />Delete selected</Button>
            </div>
          </div>
        }
      >
        {sortedOrders.length === 0 ? (
          orders.length === 0
            ? <EmptyState title="No orders yet" description="Add an order to see it listed here." action={<Button onClick={openAddModal}><Plus className="size-4 mr-1.5" />Add Order</Button>} />
            : <EmptyState title="No orders match your filter" description="Try clearing dates or selecting a different status chip." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-12 px-4">
                  <input
                    type="checkbox"
                    aria-label="Select filtered orders"
                    checked={sortedOrders.length > 0 && sortedOrders.every((order) => selectedOrderIds.includes(order.id))}
                    onChange={toggleVisibleOrders}
                  />
                </TableHead>
                <TableHead
                  className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("orderId")}
                >
                  <div className="flex items-center gap-1">
                    <span>Order ID</span>
                    {sortField === "orderId" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("customer")}
                >
                  <div className="flex items-center gap-1">
                    <span>Customer</span>
                    {sortField === "customer" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</TableHead>
                <TableHead
                  className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center gap-1">
                    <span>Amount</span>
                    {sortField === "amount" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payment</TableHead>
                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order status</TableHead>
                <TableHead
                  className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    {sortField === "date" ? (
                      sortDirection === "asc" ? <ArrowUp className="size-3.5 text-primary" /> : <ArrowDown className="size-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="size-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow key={order.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select order ${order.orderId}`}
                      checked={selectedOrderIds.includes(order.id)}
                      onChange={() => toggleOrder(order.id)}
                    />
                  </TableCell>
                  <TableCell className="px-4 py-3 font-semibold text-sm">{order.orderId}</TableCell>
                  <TableCell className="px-4 py-3 text-sm">{order.customer}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">{order.product}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 font-medium text-sm">
                    {formatINR(order.amount)}
                  </TableCell>
                  <TableCell className="px-4 py-3"><StatusPill status={order.paymentStatus} /></TableCell>
                  <TableCell className="px-4 py-3"><StatusPill status={order.orderStatus} /></TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button type="button" className="text-xs font-semibold text-primary hover:underline" onClick={() => openEditModal(order)}>Edit</button>
                      <button type="button" className="text-xs font-semibold text-destructive hover:underline" onClick={() => handleDelete(order.id)}>Delete</button>
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