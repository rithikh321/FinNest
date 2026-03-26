import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button }    from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useAuthStore  from "../store/useAuthStore";

const navLinks = [
  { to: "/dashboard", label: "Overview"        },
  { to: "/portfolio", label: "Portfolio"       },
  { to: "/funds",     label: "Funds"           },
  { to: "/history",   label: "History"         },
  { to: "/autoinvest",label: "Auto-Invest 🔄"  },
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
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        <Link to="/dashboard" className="font-bold text-lg text-emerald-600 tracking-tight">
          FinNest <span className="text-slate-500 font-normal text-sm">Grow</span>
        </Link>

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

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              style={{ backgroundColor: user?.avatar_color || "#10b981" }}
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
