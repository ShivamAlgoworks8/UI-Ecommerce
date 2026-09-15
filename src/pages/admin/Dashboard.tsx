import "./Dashboard.css";

function Dashboard() {
  return (
    <main className="admin-dashboard">
      <div className="dashboard-header">
        <p className="dashboard-eyebrow">Overview</p>

        <h2>Dashboard</h2>

        <p className="dashboard-description">
          Welcome back, Shivam. Here's an overview of your store.
        </p>
      </div>

      <section className="dashboard-stats">
        <div className="dashboard-card">
          <span>Total Orders</span>
          <strong>0</strong>
        </div>

        <div className="dashboard-card">
          <span>Total Products</span>
          <strong>0</strong>
        </div>

        <div className="dashboard-card">
          <span>Total Payments</span>
          <strong>₹0</strong>
        </div>

        <div className="dashboard-card">
          <span>Notifications</span>
          <strong>0</strong>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;