import "./Payments.css";

function Payments() {
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Management</p>
          <h2>Payments</h2>
          <p className="admin-page-description">
            View and manage customer payments.
          </p>
        </div>
      </div>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <div>
            <h3>Recent Payments</h3>
            <p>Customer payment transactions will appear here.</p>
          </div>
        </div>

        <div className="empty-state">
          <strong>No payments yet</strong>
          <span>
            Once customers make payments, you will be able to view and manage
            them here.
          </span>
        </div>
      </section>
    </main>
  );
}

export default Payments;