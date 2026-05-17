/**
 * Application Entry Point
 *
 * Vite entry point. Creates React root and renders App component.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/app";
import { applyTypographySystem } from "@/styles/typography";
import "@/index.css";

// Get root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Apply DS-4 typography tokens globally before render
applyTypographySystem();

// Create and render app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
