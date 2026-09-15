import { useState } from "react";
import AdminHeader from "./components/admin/AdminHeader";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Payments from "./pages/admin/Payments";
import Notifications from "./pages/admin/Notifications";
import Products from "./pages/admin/Products";
import Merchant from "./pages/admin/Merchant";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <>
      <AdminHeader
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "orders" && <Orders />}
      {currentPage === "payments" && <Payments />}
      {currentPage === "notifications" && <Notifications />}
      {currentPage === "products" && <Products />}
      {currentPage === "merchant" && <Merchant />}
    </>
  );
}

export default App;