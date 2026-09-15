import "./Notifications.css";

function Notifications() {
  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Management</p>
          <h2>Notifications</h2>
          <p className="admin-page-description">
            View and manage store notifications.
          </p>
        </div>
      </div>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <div>
            <h3>Recent Notifications</h3>
            <p>Important store notifications will appear here.</p>
          </div>
        </div>

        <div className="empty-state">
          <strong>No notifications yet</strong>
          <span>
            When there are important updates or activities, they will appear
            here.
          </span>
        </div>
      </section>
    </main>
  );
}

export default Notifications;