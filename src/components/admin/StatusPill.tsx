type StatusPillProps = {
  status: string;
};

function getStatusClass(status: string) {
  const normalizedStatus = status.toLowerCase();
  if (["available", "paid", "success", "shipped", "info", "active", "delivered"].includes(normalizedStatus)) {
    return "admin-status-success";
  }
  if (["processing"].includes(normalizedStatus)) {
    return "admin-status-info";
  }
  if (["pending", "warning", "cancelled", "low stock", "returned"].includes(normalizedStatus)) {
    return "admin-status-warning";
  }
  if (["out of stock", "failed", "alert", "inactive"].includes(normalizedStatus)) {
    return "admin-status-danger";
  }
  return "admin-status-neutral";
}

function StatusPill({ status }: StatusPillProps) {
  const normalized = status.toLowerCase();
  const shouldPulse = ["processing", "pending", "active"].includes(normalized);

  return (
    <span className={`admin-status-pill ${getStatusClass(status)}`}>
      <span className={`admin-status-dot ${shouldPulse ? "pulse" : ""}`} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}

export default StatusPill;

