import { useEffect, useRef, useState } from "react";
import AdminHeader from "./components/admin/AdminHeader";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./features/order/Orders";
import Payments from "./features/payment/Payments";
import Notifications from "./features/notification/Notifications";
import Products from "./features/product/Products";
import Merchant from "./features/merchant/Merchant";
import Customers from "./features/customer/Customers";
import Categories from "./features/category/Categories";
import Sidebar from "./components/admin/Sidebar";
import type { Order } from "./features/order/Orders";
import type { Payment } from "./features/payment/Payments";
import type { Notification } from "./features/notification/Notifications";
import type { ProductData } from "./features/product/Products";
import type { Customer } from "./features/customer/Customers";

export type ThemeMode = "light" | "dark" | "system";

export type MerchantData = {
  id: number;
  merchantName: string;
  brandName: string;
  productType: string;
  status: string;
  image: string;
};

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [searchByPage, setSearchByPage] = useState<Record<string, string>>({});
  const searchTerm = searchByPage[currentPage] ?? "";
  const [createRequest, setCreateRequest] = useState<{ page: string; id: number } | null>(null);
  const createRequestId = useRef(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const savedCustomers = localStorage.getItem("nexora_customers");
    if (!savedCustomers) return [];
    try {
      const parsed: unknown = JSON.parse(savedCustomers);
      return Array.isArray(parsed) && parsed.every((item) =>
        typeof item.id === "number" && typeof item.name === "string",
      ) ? parsed as Customer[] : [];
    } catch {
      return [];
    }
  });
  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem("nexora_categories");
    if (!savedCategories) return ["Electronics", "Clothing", "Grocery", "Home & Living"];
    try {
      const parsed: unknown = JSON.parse(savedCategories);
      return Array.isArray(parsed) && parsed.every((category) => typeof category === "string")
        ? parsed
        : ["Electronics", "Clothing", "Grocery", "Home & Living"];
    } catch {
      return ["Electronics", "Clothing", "Grocery", "Home & Living"];
    }
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem("nexora_theme");
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "system";
  });

  const [merchants, setMerchants] = useState<MerchantData[]>(() => {
    const savedMerchants = localStorage.getItem("nexora_merchants");

    if (!savedMerchants) {
      return [];
    }

    try {
      return JSON.parse(savedMerchants);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "nexora_merchants",
      JSON.stringify(merchants)
    );
  }, [merchants]);

  useEffect(() => {
    localStorage.setItem("nexora_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("nexora_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      const theme = themeMode === "system"
        ? (mediaQuery.matches ? "dark" : "light")
        : themeMode;
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    };

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [themeMode]);

  const handleThemeChange = (theme: ThemeMode) => {
    setThemeMode(theme);
    if (theme === "system") {
      localStorage.removeItem("nexora_theme");
    } else {
      localStorage.setItem("nexora_theme", theme);
    }
  };

  const handleSearchChange = (value: string) => {
    if (currentPage === "dashboard") return;
    setSearchByPage((previous) => ({ ...previous, [currentPage]: value }));
  };

  const handleCreate = (page: string) => {
    createRequestId.current += 1;
    setCurrentPage(page);
    setCreateRequest({ page, id: createRequestId.current });
  };

  const handleCreateRequestHandled = (id: number) => {
    setCreateRequest((request) => request?.id === id ? null : request);
  };

  const availableCategories = [...new Set([
    ...categories,
    ...products.map((product) => product.productType).filter(Boolean),
  ])];

  return (
    <div className="app-shell min-h-screen bg-background text-foreground">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="app-content">
        <AdminHeader
          currentPage={currentPage}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onNavigate={setCurrentPage}
          onCreate={handleCreate}
          themeMode={themeMode}
          onThemeChange={handleThemeChange}
        />
        <div className="page-content">
          <section hidden={currentPage !== "dashboard"}>
            <Dashboard
              onNavigate={setCurrentPage}
              orders={orders}
              orderCount={orders.length}
              productCount={products.length}
              totalPayments={payments.reduce((total, payment) => total + payment.amount, 0)}
              notificationCount={notifications.length}
            />
          </section>

          <section hidden={currentPage !== "orders"}>
            <Orders
              orders={orders}
              setOrders={setOrders}
              searchTerm={searchByPage.orders ?? ""}
              createRequest={createRequest}
              onCreateRequestHandled={handleCreateRequestHandled}
            />
          </section>

          <section hidden={currentPage !== "payments"}>
            <Payments
              payments={payments}
              setPayments={setPayments}
              searchTerm={searchByPage.payments ?? ""}
              createRequest={createRequest}
              onCreateRequestHandled={handleCreateRequestHandled}
            />
          </section>

          <section hidden={currentPage !== "notifications"}>
            <Notifications
              notifications={notifications}
              setNotifications={setNotifications}
              searchTerm={searchByPage.notifications ?? ""}
              createRequest={createRequest}
              onCreateRequestHandled={handleCreateRequestHandled}
            />
          </section>

          <section hidden={currentPage !== "products"}>
            <Products
              merchants={merchants}
              categories={availableCategories}
              products={products}
              setProducts={setProducts}
              searchTerm={searchByPage.products ?? ""}
              createRequest={createRequest}
              onCreateRequestHandled={handleCreateRequestHandled}
            />
          </section>

          <section hidden={currentPage !== "merchant"}>
            <Merchant
              merchants={merchants}
              setMerchants={setMerchants}
              searchTerm={searchByPage.merchant ?? ""}
              createRequest={createRequest}
              onCreateRequestHandled={handleCreateRequestHandled}
            />
          </section>

          <section hidden={currentPage !== "customers"}>
            <Customers
              customers={customers}
              setCustomers={setCustomers}
              orders={orders}
              setOrders={setOrders}
              payments={payments}
              setPayments={setPayments}
              searchTerm={searchByPage.customers ?? ""}
            />
          </section>

          <section hidden={currentPage !== "categories"}>
            <Categories
              categories={availableCategories}
              setCategories={setCategories}
              products={products}
              setProducts={setProducts}
              searchTerm={searchByPage.categories ?? ""}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;