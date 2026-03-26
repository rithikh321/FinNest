import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster }       from "sonner";
import ProtectedRoute    from "./components/ProtectedRoute";
import Navbar            from "./components/Navbar";
import Login             from "./pages/Login";
import Dashboard         from "./pages/Dashboard";
import Portfolio         from "./pages/Portfolio";
import FundList          from "./pages/FundList";
import FundDetail        from "./pages/FundDetail";
import InvestmentHistory from "./pages/InvestmentHistory";
import AutoInvestLog     from "./pages/AutoInvestLog";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/"      element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
        }/>
        <Route path="/portfolio" element={
          <ProtectedRoute><Layout><Portfolio /></Layout></ProtectedRoute>
        }/>
        <Route path="/funds" element={
          <ProtectedRoute><Layout><FundList /></Layout></ProtectedRoute>
        }/>
        <Route path="/funds/:id" element={
          <ProtectedRoute><Layout><FundDetail /></Layout></ProtectedRoute>
        }/>
        <Route path="/history" element={
          <ProtectedRoute><Layout><InvestmentHistory /></Layout></ProtectedRoute>
        }/>
        <Route path="/autoinvest" element={
          <ProtectedRoute><Layout><AutoInvestLog /></Layout></ProtectedRoute>
        }/>
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}
