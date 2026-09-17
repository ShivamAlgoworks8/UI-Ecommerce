import { useState } from "react";
import AdminHeader from "./components/admin/AdminHeader";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./features/order/Orders";
import Payments from "./features/payment/Payments";
import Notifications from "./features/notification/Notifications";
import Products from "./features/product/Products";
import Merchant from "./features/merchant/Merchant";
import "./styles/admin-ui.css";

export type MerchantData = {
  id: number;
  merchantName: string;
  brandName: string;
  productType: string;
  status: string;
  image: string;
};

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [merchants, setMerchants] = useState<MerchantData[]>([]);

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

      {currentPage === "products" && (
        <Products merchants={merchants} />
      )}

      {currentPage === "merchant" && (
        <Merchant
          merchants={merchants}
          setMerchants={setMerchants}
        />
      )}
    </>
  );
}

export default App;