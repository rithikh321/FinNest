import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "../store/useAuthStore";

const navLinks = [
  { to: "/dashboard",    label: "Home"      },
  { to: "/send",         label: "Pay"       },
  { to: "/transactions", label: "History"   },
  { to: "/wallet",       label: "Wallet 🪣" },
  { to: "/settings",     label: "Settings"  },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="font-bold text-lg text-blue-600 tracking-tight">
          FinNest <span className="text-slate-500 font-normal text-sm">Pay</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}>
              <Button
                variant={location.pathname === l.to ? "default" : "ghost"}
                size="sm"
                className="text-sm"
              >
                {l.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              style={{ backgroundColor: user?.avatar_color || "#6366f1" }}
              className="text-white text-xs font-bold"
            >
              {user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-slate-700 hidden md:block">
            {user?.name}
          </span>
          <Separator orientation="vertical" className="h-5" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </Button>
        </div>

      </div>
    </nav>
  );
}
