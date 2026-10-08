import { useState } from "react";
import {
  ArrowRight,
  Bell,
  CreditCard,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { AdminPage, EmptyState } from "@/components/admin/AdminPage";
import PageHeader from "@/components/admin/PageHeader";
import StatusPill from "@/components/admin/StatusPill";
import type { Order } from "@/features/order/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatINR } from "@/lib/utils";

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
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const numberOfDays = Number(analyticsRange);
  const today = new Date();
  const chartStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - numberOfDays + 1);
  const chartKeys = Array.from({ length: numberOfDays }, (_, index) => {
    const date = new Date(chartStart.getFullYear(), chartStart.getMonth(), chartStart.getDate() + index);
    return localDateKey(date);
  });
  const chartValues = chartKeys.map((date) => {
    const dayOrders = orders.filter((order) => order.date === date);
    return {
      date,
      sales: dayOrders.reduce((total, order) => total + order.amount, 0),
      count: dayOrders.length,
    };
  });
  const rangeOrders = orders.filter((order) => order.date >= chartKeys[0] && order.date <= chartKeys[chartKeys.length - 1]);
  const rangeSales = rangeOrders.reduce((total, order) => total + order.amount, 0);
  const maxSales = Math.max(...chartValues.map(({ sales }) => sales), 0);
  const recentOrders = [...orders].sort((first, second) => second.date.localeCompare(first.date)).slice(0, 5);

  const metrics = [
    {
      label: "Total orders",
      value: String(orderCount),
      page: "orders",
      icon: ShoppingBag,
      color: "var(--nav-orders)",
      trend: "+12.8% vs last week",
      trendPositive: true,
    },
    {
      label: "Total products",
      value: String(productCount),
      page: "products",
      icon: Package,
      color: "var(--nav-products)",
      trend: "Active catalog",
      trendPositive: true,
    },
    {
      label: "Total payments",
      value: formatINR(totalPayments),
      page: "payments",
      icon: CreditCard,
      color: "var(--nav-payments)",
      trend: "+16.4% volume",
      trendPositive: true,
    },
    {
      label: "Notifications",
      value: String(notificationCount),
      page: "notifications",
      icon: Bell,
      color: "var(--nav-notifications)",
      trend: "System live",
      trendPositive: true,
    },
  ];

  return (
    <AdminPage>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Shivam. Here's a live overview of your store performance."
        action={
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => onNavigate("products")} className="gap-1.5 shadow-sm">
              <Plus className="size-4" />
              Add product
            </Button>
            <Button size="sm" variant="outline" onClick={() => onNavigate("orders")} className="gap-1.5">
              <ShoppingBag className="size-4" />
              New order
            </Button>
          </div>
        }
      />

      {/* KPI Stat Cards with Icons & Trend Badges */}
      <section aria-label="Store overview" className="dashboard-stats">
        {metrics.map(({ label, value, page, icon: Icon, color, trend, trendPositive }) => (
          <button
            key={label}
            type="button"
            className="dashboard-stat-card group"
            onClick={() => onNavigate(page)}
            aria-label={`${label}: ${value}. View ${page}`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="stat-label">{label}</span>
              <div
                className="stat-icon-wrapper"
                style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
              >
                <Icon className="size-4" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <strong className="stat-value">{value}</strong>
              <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
                <span className={`inline-flex items-center gap-1 font-medium ${trendPositive ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
                  <TrendingUp className="size-3" />
                  {trend}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary flex items-center gap-0.5 text-[11px] font-medium">
                  View <ArrowRight className="size-3" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </section>

      {/* Sales Analytics with Interactive Tooltips */}
      <section className="analytics-card" aria-labelledby="sales-analytics-title">
        <header className="analytics-header">
          <div>
            <h2 id="sales-analytics-title" className="text-base font-semibold">Sales &amp; revenue analytics</h2>
            <p className="text-sm text-muted-foreground">Order volume and gross sales across the selected timeframe.</p>
          </div>
          <Select value={analyticsRange} onValueChange={(value: "7" | "30") => setAnalyticsRange(value)}>
            <SelectTrigger aria-label="Analytics date range" className="analytics-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </header>

        <div className="analytics-summary">
          <div>
            <span>Gross revenue</span>
            <strong>{formatINR(rangeSales)}</strong>
          </div>
          <div>
            <span>Orders booked</span>
            <strong>{rangeOrders.length}</strong>
          </div>
          <div>
            <span>Avg. order value</span>
            <strong>
              {rangeOrders.length > 0
                ? formatINR(rangeSales / rangeOrders.length)
                : "₹0"}
            </strong>
          </div>
        </div>

        {/* Sales Chart with Tooltip Floating Box */}
        <div className="sales-chart-container relative">
          <div className="sales-chart" role="img" aria-label={`Sales per day for the last ${numberOfDays} days`}>
            {chartValues.map(({ date, sales, count }, index) => {
              const dayLabel = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
              const height = maxSales === 0 ? 2 : Math.max((sales / maxSales) * 100, 3);
              const isHovered = hoveredBarIndex === index;

              return (
                <div
                  className="sales-chart-column relative group cursor-pointer"
                  key={date}
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  aria-label={`${dayLabel}: ${formatINR(sales)}, ${count} orders`}
                >
                  {isHovered && (
                    <div className="sales-bar-tooltip">
                      <strong className="text-xs font-semibold">{formatINR(sales)}</strong>
                      <span className="text-[10px] text-muted-foreground">{count} order{count === 1 ? "" : "s"} · {dayLabel}</span>
                    </div>
                  )}
                  <div className="sales-chart-track">
                    <span
                      style={{ height: `${height}%` }}
                      className={isHovered ? "ring-2 ring-primary ring-offset-1" : ""}
                    />
                  </div>
                  <span className="sales-chart-label">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Orders with Status and Navigation */}
      <section className="data-card recent-orders-card" aria-labelledby="recent-orders-title">
        <header className="data-card-header recent-orders-header">
          <div>
            <h2 id="recent-orders-title" className="font-semibold text-base">Recent orders</h2>
            <p className="text-sm text-muted-foreground">The latest transactions and customer orders.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onNavigate("orders")}>
            View all orders
          </Button>
        </header>
        {recentOrders.length === 0 ? (
          <EmptyState
            title="No recent orders yet"
            description="Incoming orders will automatically populate here as they are created."
            action={
              <Button size="sm" onClick={() => onNavigate("orders")}>
                Create an order
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</TableHead>
                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</TableHead>
                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order status</TableHead>
                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                <TableHead className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="px-4 py-3 font-semibold text-sm">{order.orderId}</TableCell>
                  <TableCell className="px-4 py-3 text-sm">{order.customer}</TableCell>
                  <TableCell className="px-4 py-3">
                    <StatusPill status={order.orderStatus} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-3 text-right font-medium text-sm">
                    {formatINR(order.amount)}
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