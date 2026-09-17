import "./Orders.css";

function Orders() {
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Management</p>
          <h2>Orders</h2>
          <p className="admin-page-description">
            View and manage customer orders.
          </p>
        </div>
      </div>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <div>
            <h3>Recent Orders</h3>
            <p>Orders placed by customers will appear here.</p>
          </div>
        </div>

        <div className="empty-state">
          <strong>No orders yet</strong>
          <span>
            Once customers place orders, you will be able to manage them here.
          </span>
        </div>
      </section>
    </main>
  );
}

export default Orders;