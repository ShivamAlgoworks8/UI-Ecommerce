import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminPage, AdminPageHeader, EmptyState } from "@/components/admin/AdminPage";
import DataTable from "@/components/admin/DataTable";
import FormDrawer from "@/components/admin/FormDrawer";
import Toast from "@/components/admin/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_BASE_URL } from "@/lib/api";
import type { Customer } from "@/features/customer/types";
import type { Order } from "@/features/order/types";
import type { Payment } from "@/features/payment/types";

type CustomersProps = {
  customers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[]>>;
  orders: Order[];
  payments: Payment[];
  loading: boolean;
  error: string;
  searchTerm: string;
};

type CustomerRow = {
  key: string;
  customer: Customer;
  orderCount: number;
  paymentCount: number;
};

function Customers({ customers, setCustomers, orders, payments, loading, error, searchTerm }: CustomersProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customerStatuses, setCustomerStatuses] = useState<Record<string, "Active" | "Inactive">>({});

  const handleStatusChange = async (id: string, newStatus: "Active" | "Inactive") => {
    setCustomerStatuses((previous) => ({ ...previous, [id]: newStatus }));
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setCustomers((previous) =>
          previous.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
        );
      } else {
        throw new Error("Failed to update status on server");
      }
    } catch (e) {
      console.error("Failed to update customer status:", e);
      setToastMessage("Failed to update customer status");
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCustomer(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  const openAddDrawer = () => {
    setEditingCustomer(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setAddress(customer.address);
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    if (!normalizedName) return;

    const normalizedEmail = email.trim();
    const normalizedPhone = phone.trim();

    const emailPattern =
      /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
    const phonePattern = /^[6-9]\d{9}$/;

    if (!emailPattern.test(normalizedEmail)) {
      setToastMessage("Please enter a valid email address");
      return;
    }

    if (!phonePattern.test(normalizedPhone)) {
      setToastMessage("Enter a valid 10-digit Indian mobile number");
      return;
    }

    const duplicate = customers.some(
      (customer) =>
        customer.name.toLowerCase() === normalizedName.toLowerCase() &&
        customer.id !== editingCustomer?.id,
    );

    if (duplicate) {
      setToastMessage("A customer with that name already exists");
      return;
    }

    try {
      const payload = {
        name: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone,
        address: address.trim(),
      };

      const response = await fetch(
        editingCustomer
          ? `${API_BASE_URL}/api/customers/${editingCustomer.id}`
          : `${API_BASE_URL}/api/customers`,
        {
          method: editingCustomer ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`Customer request failed: ${response.status}`);
      }

      const savedCustomer: Customer = await response.json();

      setCustomers((previous) =>
        editingCustomer
          ? previous.map((customer) =>
              customer.id === savedCustomer.id ? savedCustomer : customer,
            )
          : [...previous, savedCustomer],
      );

      closeDrawer();
      setToastMessage(
        editingCustomer ? "Customer updated successfully" : "Customer added successfully",
      );
    } catch (error) {
      console.error("Customer save error:", error);
      setToastMessage("Could not save customer. Please try again.");
    }
  };

  const customerRows: CustomerRow[] = customers.map((customer) => ({
    key: `saved-${customer.id}`,
    customer,
    orderCount: orders.filter((order) => order.customer === customer.name).length,
    paymentCount: payments.filter((payment) => payment.customerName === customer.name).length,
  }));
  const filteredCustomers = customerRows.filter(({ customer }) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleCustomer = (key: string) => {
    setSelectedKeys((previous) => previous.includes(key)
      ? previous.filter((selectedKey) => selectedKey !== key)
      : [...previous, key],
    );
  };

  const deleteSelected = async () => {
    const selected = customerRows.filter((row) =>
      selectedKeys.includes(row.key),
    );

    if (selected.length === 0) return;

    if (selected.some((row) => row.orderCount > 0 || row.paymentCount > 0)) {
      setToastMessage("Customers with orders or payments cannot be deleted");
      return;
    }

    const savedCustomers = selected.filter((row) => row.customer.id);

    if (savedCustomers.length === 0) {
      setToastMessage("Only saved customers can be deleted");
      return;
    }

    if (!window.confirm(`Delete ${savedCustomers.length} selected customer(s)?`)) {
      return;
    }

    try {
      for (const row of savedCustomers) {
        const response = await fetch(
          `${API_BASE_URL}/api/customers/${row.customer.id}`,
          { method: "DELETE" },
        );

        if (!response.ok) {
          throw new Error(`Delete failed: ${response.status}`);
        }
      }

      const deletedIds = savedCustomers.map((row) => row.customer.id);

      setCustomers((previous) =>
        previous.filter((customer) => !deletedIds.includes(customer.id)),
      );
      setSelectedKeys([]);
      setToastMessage("Selected customers deleted");
    } catch (error) {
      console.error("Customer delete error:", error);
      setToastMessage("Could not delete all customers. Refresh and verify the list.");
    }
  };

  return (
    <AdminPage>
      <AdminPageHeader
        title="Customers"
        description="Manage customer names in your store."
        action={<Button onClick={openAddDrawer}><Plus />Add Customer</Button>}
      />
      <DataTable
        title="Customer list"
        description="Customer records added to the admin workspace."
        toolbar={
          <div className="bulk-actions">
            <span>{selectedKeys.length} selected</span>
            <Button variant="outline" disabled={selectedKeys.length === 0} onClick={deleteSelected}>
              <Trash2 />Delete selected
            </Button>
          </div>
        }
      >
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading customers...</p>
        ) : error ? (
          <p className="p-6 text-sm text-destructive">{error}</p>
        ) : filteredCustomers.length === 0 ? (
          <EmptyState
            title={customerRows.length === 0 ? "No customers yet" : "No customers found"}
            description={customerRows.length === 0 ? "Add a customer to manage the customer list." : "Try a different search."}
            action={customerRows.length === 0 ? <Button onClick={openAddDrawer}><Plus />Add Customer</Button> : undefined}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <TableHead className="w-12 px-[18px]"><span className="sr-only">Select</span></TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Customer name</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Email</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Status</TableHead>
                {/* <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Orders</TableHead> */}
                {/* <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Payments</TableHead> */}
                <TableHead className="h-12 px-[18px] text-right text-sm font-medium normal-case tracking-normal">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map(({ key, customer, orderCount, paymentCount }) => (
                <TableRow key={key} className="border-t border-border">
                  <TableCell className="px-[18px] py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${customer.name}`}
                      checked={selectedKeys.includes(key)}
                      onChange={() => toggleCustomer(key)}
                    />
                  </TableCell>
                  <TableCell className="px-[18px] py-3 font-medium">{customer.name}</TableCell>
                  <TableCell className="px-[18px] py-3 text-sm text-muted-foreground">{customer.email}</TableCell>
                  <TableCell className="px-[18px] py-3">
                    <Select
                      value={customerStatuses[customer.id || key] ?? "Active"}
                      onValueChange={(value: "Active" | "Inactive") =>
                        handleStatusChange(customer.id || key, value)
                      }
                    >
                      <SelectTrigger className="w-[110px] h-8 text-xs" aria-label={`Status for ${customer.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  {/* <TableCell className="px-[18px] py-3">{orderCount}</TableCell> */}
                  {/* <TableCell className="px-[18px] py-3">{paymentCount}</TableCell> */}
                  <TableCell className="px-[18px] py-3">
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
                        onClick={() => openEditDrawer(customer)}
                        disabled={!customer.id}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-sm font-medium text-destructive hover:underline"
                        onClick={async () => {
                          if (orderCount > 0 || paymentCount > 0) {
                            setToastMessage("Customers with orders or payments cannot be deleted");
                            return;
                          }

                          if (!customer.id) {
                            setToastMessage("This customer is not saved in the backend");
                            return;
                          }

                          if (!window.confirm(`Delete ${customer.name}?`)) return;

                          try {
                            const response = await fetch(
                              `${API_BASE_URL}/api/customers/${customer.id}`,
                              { method: "DELETE" },
                            );

                            if (!response.ok) {
                              throw new Error(`Delete failed: ${response.status}`);
                            }

                            setCustomers((previous) =>
                              previous.filter((item) => item.id !== customer.id),
                            );
                            setSelectedKeys((previous) =>
                              previous.filter((selectedKey) => selectedKey !== key),
                            );
                            setToastMessage("Customer deleted successfully");
                          } catch (error) {
                            console.error("Customer delete error:", error);
                            setToastMessage("Could not delete customer");
                          }
                        }}
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
        open={isDrawerOpen}
        onOpenChange={(open) => !open && closeDrawer()}
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        description="Enter the customer's name."
        formId="customer-form"
        submitLabel={editingCustomer ? "Save changes" : "Save customer"}
      >
        <form id="customer-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="customer-name">Customer name</Label>
            <Input id="customer-name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="example@gmail.com"
              required
              maxLength={254}
              title="Please enter a valid email address, e.g. example@gmail.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customer-phone">Phone</Label>
            <Input
              id="customer-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="9876543210"
              required
              inputMode="numeric"
              maxLength={10}
              minLength={10}
              pattern="[6-9][0-9]{9}"
              title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customer-address">Address</Label>
            <Input id="customer-address" value={address} onChange={(event) => setAddress(event.target.value)} />
          </div>
        </form>
      </FormDrawer>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </AdminPage>
  );
}

export default Customers;
