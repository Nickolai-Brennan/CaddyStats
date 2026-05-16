/**
 * Application Entry Point
 *
 * Vite entry point. Creates React root and renders App component.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/app";
import "@/index.css";

// Get root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Create and render app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
