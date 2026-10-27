import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import Login from "@/pages/auth/Login/Login";
import AdminHeader from "@/components/admin/AdminHeader";
import Sidebar from "@/components/admin/Sidebar";
import Categories from "@/features/category/Categories";
import Customers from "@/features/customer/Customers";
import Dashboard from "@/features/dashboard/Dashboard";
import Merchant from "@/features/merchant/Merchant";
// import Notifications from "@/features/notification/Notifications";
import Orders from "@/features/order/Orders";
import Payments from "@/features/payment/Payments";
import Products from "@/features/product/Products";
import type { Customer } from "@/features/customer/types";
import type { MerchantData } from "@/features/merchant/types";
// import type { Notification } from "@/features/notification/types";
import type { Order } from "@/features/order/types";
import type { Payment } from "@/features/payment/types";
import type { ProductData } from "@/features/product/types";
import type { CreateRequest, ThemeMode } from "@/app/types";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [searchByPage, setSearchByPage] = useState<Record<string, string>>({});
  const searchTerm = searchByPage[currentPage] ?? "";
  const [createRequest, setCreateRequest] = useState<CreateRequest | null>(null);
  const createRequestId = useRef(0);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let active = true;
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders`);
        if (!response.ok) return;
        const data: Order[] = await response.json();
        if (active && Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders in App:", error);
      }
    };
    fetchOrders();
    return () => {
      active = false;
    };
  }, []);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState("");
  useEffect(() => {
    let active = true;

    const fetchPayments = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/payments`);

        if (!response.ok) {
          throw new Error(`Failed to fetch payments: ${response.status}`);
        }

        const data: Payment[] = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected payments response");
        }
        if (active) setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        if (active) {
          setPaymentsError(error instanceof Error ? error.message : "Unable to load payments");
        }
      } finally {
        if (active) setPaymentsLoading(false);
      }
    };

    fetchPayments();
    return () => {
      active = false;
    };
  }, []);
  // const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) return;
        const data = await response.json();
        if (active && Array.isArray(data)) {
          setProducts(
            data.map((item: any) => ({
              id: item.id,
              merchant: item.merchantName ?? "",
              productName: item.name,
              price: item.price,
              stock: item.stock,
              description: item.description ?? "",
              productType: item.productType ?? "",
              status: item.stock > 0 ? "Available" : "NA",
              image: item.imageUrl ?? "",
            }))
          );
        }
      } catch (e) {
        console.error("Error loading products in App:", e);
      }
    };
    fetchProducts();
    return () => {
      active = false;
    };
  }, []);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState("");
  useEffect(() => {
    let active = true;

    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/customers`);

        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.status}`);
        }

        const data: Customer[] = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected customers response");
        }
        if (active) setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        if (active) {
          setCustomersError(error instanceof Error ? error.message : "Unable to load customers");
        }
      } finally {
        if (active) setCustomersLoading(false);
      }
    };

    fetchCustomers();

    const handleFocus = () => {
      fetchCustomers();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      active = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [currentPage]);
  const [categories, setCategories] = useState<string[]>([]);


  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem("nexora_theme");
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "system";
  });

  const [merchants, setMerchants] = useState<MerchantData[]>([]);

  useEffect(() => {
    let active = true;

    const fetchMerchants = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/merchants`);
        if (!response.ok) return;
        const data: MerchantData[] = await response.json();
        if (active && Array.isArray(data)) {
          setMerchants(data);
        }
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };

    fetchMerchants();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const dbCategories = [
      ...new Set([
        ...products.map((p) => p.productType).filter(Boolean),
        ...merchants.map((m) => m.productType).filter(Boolean),
      ]),
    ];
    if (dbCategories.length > 0) {
      setCategories((prev) => [...new Set([...prev, ...dbCategories])]);
    }
  }, [products, merchants]);

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
          {...{
            // notifications={notifications}
            // onClearNotifications={() => setNotifications([])}
          }}
        />
        <div className="page-content">
          <section hidden={currentPage !== "dashboard"}>
            <Dashboard
              onNavigate={setCurrentPage}
              orders={orders}
              orderCount={orders.length}
              productCount={products.length}
              totalPayments={payments.reduce((total, payment) => total + payment.paymentAmount, 0)}
              {...{
                // notificationCount={notifications.length}
              }}
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
              loading={paymentsLoading}
              error={paymentsError}
              searchTerm={searchByPage.payments ?? ""}
              createRequest={createRequest}
              onCreateRequestHandled={handleCreateRequestHandled}
            />
          </section>

          {/* <section hidden={currentPage !== "notifications"}>
            <Notifications
              notifications={notifications}
              setNotifications={setNotifications}
              searchTerm={searchByPage.notifications ?? ""}
              createRequest={createRequest}
              onCreateRequestHandled={handleCreateRequestHandled}
            />
          </section> */}

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
              categories={availableCategories}
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
              loading={customersLoading}
              error={customersError}
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