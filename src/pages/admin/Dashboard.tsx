import { useState } from "react";
import { AdminPage, EmptyState } from "@/components/admin/AdminPage";
import PageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import type { Order } from "@/features/order/Orders";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DashboardProps = {
  onNavigate: (page: string) => void;
  orders: Order[];
  orderCount: number;
  productCount: number;
  totalPayments: number;
  notificationCount: number;
};

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function Dashboard({
  onNavigate,
  orders,
  orderCount,
  productCount,
  totalPayments,
  notificationCount,
}: DashboardProps) {
  const [analyticsRange, setAnalyticsRange] = useState<"7" | "30">("7");
  const numberOfDays = Number(analyticsRange);
  const today = new Date();
  const chartStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - numberOfDays + 1);
  const chartKeys = Array.from({ length: numberOfDays }, (_, index) => {
    const date = new Date(chartStart.getFullYear(), chartStart.getMonth(), chartStart.getDate() + index);
    return localDateKey(date);
  });
  const chartValues = chartKeys.map((date) => ({
    date,
    sales: orders.filter((order) => order.date === date).reduce((total, order) => total + order.amount, 0),
    count: orders.filter((order) => order.date === date).length,
  }));
  const rangeOrders = orders.filter((order) => order.date >= chartKeys[0] && order.date <= chartKeys[chartKeys.length - 1]);
  const rangeSales = rangeOrders.reduce((total, order) => total + order.amount, 0);
  const maxSales = Math.max(...chartValues.map(({ sales }) => sales), 0);
  const recentOrders = [...orders].sort((first, second) => second.date.localeCompare(first.date)).slice(0, 5);
  const metrics = [
    { label: "Total orders", value: String(orderCount), page: "orders" },
    { label: "Total products", value: String(productCount), page: "products" },
    {
      label: "Total payments",
      value: totalPayments.toLocaleString("en-IN", { style: "currency", currency: "INR" }),
      page: "payments",
    },
    { label: "Notifications", value: String(notificationCount), page: "notifications" },
  ];

  return (
    <AdminPage>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Shivam. Here's an overview of your store."
      />

      <section aria-label="Store overview" className="dashboard-stats">
        {metrics.map(({ label, value, page }) => (
          <button
            key={label}
            type="button"
            className="dashboard-stat-card"
            onClick={() => onNavigate(page)}
            aria-label={`${label}: ${value}. View ${page}`}
          >
            <span>{label}</span>
            <strong>{value}</strong>
          </button>
        ))}
      </section>

      <section className="analytics-card" aria-labelledby="sales-analytics-title">
        <header className="analytics-header">
          <div>
            <h2 id="sales-analytics-title">Sales &amp; order analytics</h2>
            <p>Based on orders recorded in the selected period.</p>
          </div>
          <Select value={analyticsRange} onValueChange={(value: "7" | "30") => setAnalyticsRange(value)}>
            <SelectTrigger aria-label="Analytics date range" className="analytics-range"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </header>
        <div className="analytics-summary">
          <div><span>Sales</span><strong>{rangeSales.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</strong></div>
          <div><span>Orders</span><strong>{rangeOrders.length}</strong></div>
        </div>
        <div className="sales-chart" role="img" aria-label={`Sales per day for the last ${numberOfDays} days`}>
          {chartValues.map(({ date, sales, count }) => {
            const dayLabel = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
            const height = maxSales === 0 ? 2 : Math.max((sales / maxSales) * 100, 2);
            return (
              <div className="sales-chart-column" key={date} aria-label={`${dayLabel}: ${sales.toLocaleString("en-IN", { style: "currency", currency: "INR" })}, ${count} orders`}>
                <div className="sales-chart-track"><span style={{ height: `${height}%` }} /></div>
                <span className="sales-chart-label">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="data-card recent-orders-card" aria-labelledby="recent-orders-title">
        <header className="data-card-header recent-orders-header">
          <div>
            <h2 id="recent-orders-title">Recent orders</h2>
            <p>The latest orders in your store.</p>
          </div>
          <Button variant="outline" onClick={() => onNavigate("orders")}>View all</Button>
        </header>
        {recentOrders.length === 0 ? (
          <EmptyState title="No recent orders" description="Orders will appear here when they are added." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Order ID</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Customer</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Order status</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Date</TableHead>
                <TableHead className="h-12 px-[18px] text-right text-sm font-medium normal-case tracking-normal">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="border-t border-border">
                  <TableCell className="px-[18px] py-3 font-medium">{order.orderId}</TableCell>
                  <TableCell className="px-[18px] py-3">{order.customer}</TableCell>
                  <TableCell className="px-[18px] py-3"><StatusPill status={order.orderStatus} /></TableCell>
                  <TableCell className="whitespace-nowrap px-[18px] py-3">{order.date}</TableCell>
                  <TableCell className="whitespace-nowrap px-[18px] py-3 text-right">
                    {order.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </AdminPage>
  );
}

export default Dashboard;