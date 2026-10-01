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
import type { Customer } from "@/features/customer/types";
import type { Order } from "@/features/order/types";
import type { Payment } from "@/features/payment/types";

type CustomersProps = {
  customers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[]>>;
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  payments: Payment[];
  setPayments: Dispatch<SetStateAction<Payment[]>>;
  searchTerm: string;
};

type CustomerRow = {
  key: string;
  customer: Customer;
  orderCount: number;
  paymentCount: number;
};

function Customers({ customers, setCustomers, orders, setOrders, payments, setPayments, searchTerm }: CustomersProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingOriginalName, setEditingOriginalName] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCustomer(null);
    setEditingOriginalName(null);
    setName("");
  };

  const openAddDrawer = () => {
    setEditingCustomer(null);
    setName("");
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditingOriginalName(customer.name);
    setName(customer.name);
    setIsDrawerOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = name.trim();
    if (!normalizedName) return;
    if ([...orders.map((order) => order.customer), ...payments.map((payment) => payment.customer)]
      .some((customerName) => customerName.toLowerCase() === normalizedName.toLowerCase()
        && customerName !== editingOriginalName)) {
      setToastMessage("A customer with that name already exists");
      return;
    }
    if (editingCustomer) {
      if (editingCustomer.id === 0) {
        setCustomers((previous) => [...previous, { id: Date.now(), name: normalizedName }]);
      } else {
        setCustomers((previous) => previous.map((customer) =>
          customer.id === editingCustomer.id ? { ...customer, name: normalizedName } : customer,
        ));
      }
      if (editingOriginalName) {
        setOrders((previous) => previous.map((order) => order.customer === editingOriginalName
          ? { ...order, customer: normalizedName }
          : order,
        ));
        setPayments((previous) => previous.map((payment) => payment.customer === editingOriginalName
          ? { ...payment, customer: normalizedName }
          : payment,
        ));
      }
    } else {
      setCustomers((previous) => [...previous, { id: Date.now(), name: normalizedName }]);
    }
    setToastMessage(editingCustomer ? "Customer updated" : "Customer added");
    closeDrawer();
  };

  const observedNames = [...new Set([
    ...orders.map((order) => order.customer),
    ...payments.map((payment) => payment.customer),
  ].filter(Boolean))];
  const customerRows: CustomerRow[] = [
    ...customers.map((customer) => ({
      key: `saved-${customer.id}`,
      customer,
      orderCount: orders.filter((order) => order.customer === customer.name).length,
      paymentCount: payments.filter((payment) => payment.customer === customer.name).length,
    })),
    ...observedNames
      .filter((customerName) => !customers.some((customer) => customer.name === customerName))
      .map((customerName) => ({
        key: `observed-${customerName}`,
        customer: { id: 0, name: customerName },
        orderCount: orders.filter((order) => order.customer === customerName).length,
        paymentCount: payments.filter((payment) => payment.customer === customerName).length,
      })),
  ];
  const filteredCustomers = customerRows.filter(({ customer }) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleCustomer = (key: string) => {
    setSelectedKeys((previous) => previous.includes(key)
      ? previous.filter((selectedKey) => selectedKey !== key)
      : [...previous, key],
    );
  };

  const deleteSelected = () => {
    const selected = customerRows.filter((row) => selectedKeys.includes(row.key));
    if (selected.length === 0) return;
    if (selected.some((row) => row.orderCount > 0 || row.paymentCount > 0)) {
      setToastMessage("Customers with orders or payments cannot be deleted");
      return;
    }
    if (!window.confirm(`Delete ${selected.length} selected customer${selected.length === 1 ? "" : "s"}?`)) return;
    const selectedIds = selected.map((row) => row.customer.id);
    setCustomers((previous) => previous.filter((customer) => !selectedIds.includes(customer.id)));
    setSelectedKeys([]);
    setToastMessage("Selected customers deleted");
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
        {filteredCustomers.length === 0 ? (
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
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Orders</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Payments</TableHead>
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
                  <TableCell className="px-[18px] py-3">{orderCount}</TableCell>
                  <TableCell className="px-[18px] py-3">{paymentCount}</TableCell>
                  <TableCell className="px-[18px] py-3">
                    <div className="flex justify-end gap-4">
                      <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => openEditDrawer(customer)}>Edit</button>
                      <button
                        type="button"
                        className="text-sm font-medium text-destructive hover:underline"
                        onClick={() => {
                          if (orderCount > 0 || paymentCount > 0) {
                            setToastMessage("Customers with orders or payments cannot be deleted");
                            return;
                          }
                          if (!window.confirm(`Delete ${customer.name}?`)) return;
                          setCustomers((previous) => previous.filter((item) => item.id !== customer.id));
                          setSelectedKeys((previous) => previous.filter((selectedKey) => selectedKey !== key));
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
        </form>
      </FormDrawer>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </AdminPage>
  );
}

export default Customers;
