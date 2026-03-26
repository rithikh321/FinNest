import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Clear session on every fresh app load
localStorage.removeItem("mf_token");
localStorage.removeItem("mf_user");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
