/**
 * main.jsx — Application Entry Point
 * ────────────────────────────────────
 * Renders the root App component into the DOM.
 * Imports the global CSS (Tailwind + custom styles).
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
