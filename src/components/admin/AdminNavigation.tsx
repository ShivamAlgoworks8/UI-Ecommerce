import "./AdminNavigation.css";

function AdminNavigation() {
  return (
    <nav className="admin-navigation">
      <a href="#" className="admin-nav-item active">
        Dashboard
      </a>

      <a href="#" className="admin-nav-item">
        Orders
      </a>

      <a href="#" className="admin-nav-item">
        Payments
      </a>

      <a href="#" className="admin-nav-item">
        Notifications
      </a>

      <a href="#" className="admin-nav-item">
        Products
      </a>

      <a href="#" className="admin-nav-item">
        Merchant
      </a>
    </nav>
  );
}

export default AdminNavigation;