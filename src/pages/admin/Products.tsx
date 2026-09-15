import "./Products.css";

function Products() {
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Management</p>
          <h2>Products</h2>
          <p className="admin-page-description">
            View and manage products in your store.
          </p>
        </div>
      </div>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <div>
            <h3>Products</h3>
            <p>Products added to your store will appear here.</p>
          </div>
        </div>

        <div className="empty-state">
          <strong>No products yet</strong>
          <span>
            Once products are added, you will be able to view and manage them
            here.
          </span>
        </div>
      </section>
    </main>
  );
}

export default Products;