import { useState } from "react";
import "./Notifications.css";

type Notification = {
  id: number;
  title: string;
  message: string;
  type: "Info" | "Success" | "Warning" | "Alert";
  status: "Active" | "Inactive";
  date: string;
};

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] =
    useState<Notification["type"]>("Info");
  const [status, setStatus] =
    useState<Notification["status"]>("Active");
  const [date, setDate] = useState("");

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType("Info");
    setStatus("Active");
    setDate("");
    setEditingNotification(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (notification: Notification) => {
    setEditingNotification(notification);

    setTitle(notification.title);
    setMessage(notification.message);
    setType(notification.type);
    setStatus(notification.status);
    setDate(notification.date);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !message.trim() ||
      !date
    ) {
      return;
    }

    if (editingNotification) {
      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification.id === editingNotification.id
            ? {
                ...notification,
                title: title.trim(),
                message: message.trim(),
                type,
                status,
                date,
              }
            : notification
        )
      );
    } else {
      const newNotification: Notification = {
        id: Date.now(),
        title: title.trim(),
        message: message.trim(),
        type,
        status,
        date,
      };

      setNotifications((previousNotifications) => [
        ...previousNotifications,
        newNotification,
      ]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    setNotifications((previousNotifications) =>
      previousNotifications.filter(
        (notification) => notification.id !== id
      )
    );
  };

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Management</p>

          <h2>Notifications</h2>

          <p className="admin-page-description">
            View and manage system notifications.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddModal}
        >
          + Add Notification
        </button>
      </div>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <div>
            <h3>Notification List</h3>

            <p>
              Notifications will appear here.
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <strong>No notifications yet</strong>

            <span>
              Add a notification to see it listed here.
            </span>
          </div>
        ) : (
          <div className="notifications-table-wrapper">
            <table className="notifications-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification.id}>
                    <td>
                      <strong>{notification.title}</strong>
                    </td>

                    <td>{notification.message}</td>

                    <td>
                      <span
                        className={`notification-type type-${notification.type.toLowerCase()}`}
                      >
                        {notification.type}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`notification-status status-${notification.status.toLowerCase()}`}
                      >
                        {notification.status}
                      </span>
                    </td>

                    <td>{notification.date}</td>

                    <td>
                      <div className="notification-actions">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(notification)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-action"
                          onClick={() =>
                            handleDelete(notification.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div
          className="admin-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="admin-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <h3>
                  {editingNotification
                    ? "Edit Notification"
                    : "Add Notification"}
                </h3>

                <p>
                  {editingNotification
                    ? "Update notification details."
                    : "Enter the notification details."}
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="notification-form-grid">
                  <div className="notification-form-group">
                    <label>Title</label>

                    <input
                      type="text"
                      value={title}
                      onChange={(event) =>
                        setTitle(event.target.value)
                      }
                      placeholder="Enter notification title"
                    />
                  </div>

                  <div className="notification-form-group">
                    <label>Type</label>

                    <select
                      value={type}
                      onChange={(event) =>
                        setType(
                          event.target.value as Notification["type"]
                        )
                      }
                    >
                      <option value="Info">Info</option>
                      <option value="Success">Success</option>
                      <option value="Warning">Warning</option>
                      <option value="Alert">Alert</option>
                    </select>
                  </div>

                  <div className="notification-form-group full-width">
                    <label>Message</label>

                    <textarea
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      placeholder="Enter notification message"
                      rows={4}
                    />
                  </div>

                  <div className="notification-form-group">
                    <label>Status</label>

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value as Notification["status"]
                        )
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="notification-form-group">
                    <label>Date</label>

                    <input
                      type="date"
                      value={date}
                      onChange={(event) =>
                        setDate(event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {editingNotification
                    ? "Update Notification"
                    : "Add Notification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Notifications;