type StatusPillProps = {
  status: string;
};

function getStatusClass(status: string) {
  const normalizedStatus = status.toLowerCase();
  if (["available", "paid", "success", "shipped", "info"].includes(normalizedStatus)) {
    return "admin-status-success";
  }
  if (normalizedStatus === "processing") {
    return "admin-status-info";
  }
  if (["pending", "warning", "cancelled", "low stock"].includes(normalizedStatus)) {
    return "admin-status-warning";
  }
  if (["out of stock", "failed", "alert"].includes(normalizedStatus)) {
    return "admin-status-danger";
  }
  return "admin-status-neutral";
}

function StatusPill({ status }: StatusPillProps) {
  return <span className={`admin-status-pill ${getStatusClass(status)}`}>{status}</span>;
}

export default StatusPill;
