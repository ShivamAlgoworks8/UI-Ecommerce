import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/contextValue";

export default function CheckoutPage({ cart, onClearCart }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Stores the customer's delivery address.
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  // Calculates the cart subtotal, shipping charge, and final amount.
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingCost = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shippingCost;

  // Updates the address field that the customer edits.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Validates checkout details and submits the order to the backend.
  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const { fullName, phone, street, city, state, pincode } = address;

    // Checks that every delivery address field is filled in.
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !street.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      setError("Please fill in all delivery address fields.");
      return;
    }

    // Validates the Indian mobile number and PIN code.
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    // Online payment requires a payment gateway, which is not integrated yet.
    if (paymentMethod === "ONLINE") {
      setError("Online payment is not available yet. Please select COD.");
      return;
    }

    // Get the logged-in customer's ID from AuthContext.
    const customerId = user?.id;

    if (!customerId) {
      setError("Customer details not found. Please log in again.");
      return;
    }

    // Converts the cart into the request format expected by the backend.
    const orderRequest = {
      customer: customerId,
      items: cart.map((item) => ({
        product: item.id || item._id || item.productId,
        quantity: item.quantity,
      })),
      deliveryAddress: address,
      paymentMethod,
      orderStatus: "Processing",
    };

    // Prevents submission if any cart item is missing its product ID.
    if (orderRequest.items.some((item) => !item.product)) {
      setError("Product ID is missing from your cart.");
      return;
    }

    try {
      setLoading(true);

      // Sends the order to the Spring Boot API.
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderRequest),
      });

      const data = await response.json().catch(() => null);

      // Displays the error returned by the backend if the request fails.
      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Unable to place your order."
        );
      }

      // Stores the created order so the confirmation screen can display it.
      // Clear the cart after the backend successfully creates the order.
      onClearCart();
      setSuccessOrder(data);
    } catch (err) {
      setError(
        err.message || "Something went wrong while placing your order."
      );
    } finally {
      // Re-enables the Place Order button after the request finishes.
      setLoading(false);
    }
  };

  // Displays the confirmation after the backend successfully creates the order.
  if (successOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Order placed successfully!
        </h2>

        <p className="text-gray-600 mb-2">
          Your order has been saved successfully.
        </p>

        <p className="mb-3">
          Order ID: <strong>{successOrder.orderId}</strong>
        </p>

        <p className="mb-5">
          Total: ₹{Number(successOrder.amount).toLocaleString("en-IN")}
        </p>

        <Link
          to="/products"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Shows a message and shopping link when the cart is empty.
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>

        <p className="text-gray-600 mb-5">
          Add products to your cart before checkout.
        </p>

        <Link
          to="/products"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>

      <p className="text-gray-600 mb-8">
        Enter your delivery details and review your order.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handlePlaceOrder}
          className="lg:col-span-2 space-y-8"
        >
          <section className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-5">
              Delivery Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                autoComplete="name"
                className="border rounded-lg p-3"
                required
              />

              <input
                name="phone"
                type="tel"
                value={address.phone}
                onChange={handleChange}
                placeholder="10-digit Mobile Number"
                autoComplete="tel"
                maxLength={10}
                className="border rounded-lg p-3"
                required
              />

              <input
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="House No., Street, Area"
                autoComplete="street-address"
                className="border rounded-lg p-3 md:col-span-2"
                required
              />

              <input
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="City"
                autoComplete="address-level2"
                className="border rounded-lg p-3"
                required
              />

              <input
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="State"
                autoComplete="address-level1"
                className="border rounded-lg p-3"
                required
              />

              <input
                name="pincode"
                value={address.pincode}
                onChange={handleChange}
                placeholder="6-digit PIN Code"
                autoComplete="postal-code"
                maxLength={6}
                className="border rounded-lg p-3"
                required
              />
            </div>
          </section>

          <section className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-5">
              Payment Method
            </h2>

            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <span>Cash on Delivery (COD)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="ONLINE"
                checked={paymentMethod === "ONLINE"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <span>Online Payment</span>
            </label>

            {paymentMethod === "ONLINE" && (
              <p className="text-sm text-gray-600 mt-4">
                Online payment is not available yet. Please select COD.
              </p>
            )}
          </section>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-60"
          >
            {loading
              ? "Placing Order..."
              : `Place Order · ₹${grandTotal.toLocaleString("en-IN")}`}
          </button>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="w-full border py-3 rounded-lg"
          >
            Back to Cart
          </button>
        </form>

        <aside className="border rounded-xl p-6 h-fit">
          <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.id || item._id || item.name}
                className="flex justify-between gap-4 text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span className="font-medium whitespace-nowrap">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shippingCost === 0
                  ? "Free"
                  : `₹${shippingCost.toLocaleString("en-IN")}`}
              </span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}