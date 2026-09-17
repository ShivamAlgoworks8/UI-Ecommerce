import "./AdminNavigation.css";

type AdminNavigationProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

function AdminNavigation({
  currentPage,
  onNavigate,
}: AdminNavigationProps) {
  return (
    <nav className="admin-navigation">
      <button
        className={`admin-nav-item ${
          currentPage === "dashboard" ? "active" : ""
        }`}
        onClick={() => onNavigate("dashboard")}
      >
        Dashboard
      </button>

      <button
        className={`admin-nav-item ${
          currentPage === "orders" ? "active" : ""
        }`}
        onClick={() => onNavigate("orders")}
      >
        Orders
      </button>

      <button
        className={`admin-nav-item ${
          currentPage === "payments" ? "active" : ""
        }`}
        onClick={() => onNavigate("payments")}
      >
        Payments
      </button>

      <button
        className={`admin-nav-item ${
          currentPage === "notifications" ? "active" : ""
        }`}
        onClick={() => onNavigate("notifications")}
      >
        Notifications
      </button>

      <button
        className={`admin-nav-item ${
          currentPage === "products" ? "active" : ""
        }`}
        onClick={() => onNavigate("products")}
      >
        Products
      </button>

      <button
        className={`admin-nav-item ${
          currentPage === "merchant" ? "active" : ""
        }`}
        onClick={() => onNavigate("merchant")}
      >
        Merchant
      </button>
    </nav>
  );
}

export default AdminNavigation;