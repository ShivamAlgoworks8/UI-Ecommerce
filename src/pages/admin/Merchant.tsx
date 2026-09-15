import "./Merchant.css";

function Merchant() {
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Management</p>
          <h2>Merchant</h2>
          <p className="admin-page-description">
            View and manage merchants connected to your store.
          </p>
        </div>
      </div>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <div>
            <h3>Merchants</h3>
            <p>Merchants connected to your platform will appear here.</p>
          </div>
        </div>

        <div className="empty-state">
          <strong>No merchants yet</strong>
          <span>
            Once merchants are added, you will be able to view and manage them
            here.
          </span>
        </div>
      </section>
    </main>
  );
}

export default Merchant;