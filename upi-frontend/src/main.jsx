import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Clear session on every fresh app load
localStorage.removeItem("token");
localStorage.removeItem("upi_user");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
