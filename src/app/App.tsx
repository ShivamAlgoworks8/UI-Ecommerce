import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import Login from "@/pages/auth/Login/Login";
import AdminHeader from "@/components/admin/AdminHeader";
import Sidebar from "@/components/admin/Sidebar";
import Categories from "@/features/category/Categories";
import Customers from "@/features/customer/Customers";
import Dashboard from "@/features/dashboard/Dashboard";
import Merchant from "@/features/merchant/Merchant";
import Notifications from "@/features/notification/Notifications";
import Orders from "@/features/order/Orders";
import Payments from "@/features/payment/Payments";
import Products from "@/features/product/Products";
import type { Customer } from "@/features/customer/types";
import type { MerchantData } from "@/features/merchant/types";
import type { Notification } from "@/features/notification/types";
import type { Order } from "@/features/order/types";
import type { Payment } from "@/features/payment/types";
import type { ProductData } from "@/features/product/types";
import type { CreateRequest, ThemeMode } from "@/app/types";

const DEFAULT_CATEGORIES = ["Electronics", "Clothing", "Grocery", "Home & Living"];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [searchByPage, setSearchByPage] = useState<Record<string, string>>({});
  const searchTerm = searchByPage[currentPage] ?? "";
  const [createRequest, setCreateRequest] = useState<CreateRequest | null>(null);
  const createRequestId = useRef(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  useEffect(() => {
  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments`);

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data: Payment[] = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  fetchPayments();
}, []);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/customers`);

        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.status}`);
        }

        const data: Customer[] = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);
  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem("nexora_categories");
    if (!savedCategories) return DEFAULT_CATEGORIES;
    try {
      const parsed: unknown = JSON.parse(savedCategories);
      return Array.isArray(parsed) && parsed.every((category) => typeof category === "string")
        ? parsed
        : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
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

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

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
          onLogout={() => setIsLoggedIn(false)}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
        />
        <div className="page-content">
          <section hidden={currentPage !== "dashboard"}>
            <Dashboard
              onNavigate={setCurrentPage}
              orders={orders}
              orderCount={orders.length}
              productCount={products.length}
              totalPayments={payments.reduce((total, payment) => total + payment.paymentAmount, 0)}
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
              payments={payments}
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