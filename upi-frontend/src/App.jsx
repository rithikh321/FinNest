import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar        from "./components/Navbar";
import Login         from "./pages/Login";
import Dashboard     from "./pages/Dashboard";
import SendMoney     from "./pages/SendMoney";
import Transactions  from "./pages/Transactions";
import Wallet        from "./pages/Wallet";
import Settings      from "./pages/Settings";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
        }/>
        <Route path="/send" element={
          <ProtectedRoute><Layout><SendMoney /></Layout></ProtectedRoute>
        }/>
        <Route path="/transactions" element={
          <ProtectedRoute><Layout><Transactions /></Layout></ProtectedRoute>
        }/>
        <Route path="/wallet" element={
          <ProtectedRoute><Layout><Wallet /></Layout></ProtectedRoute>
        }/>
        <Route path="/settings" element={
          <ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>
        }/>
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}
