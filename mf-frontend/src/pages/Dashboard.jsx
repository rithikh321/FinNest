import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button }   from "@/components/ui/button";
import { Badge }    from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import GrowthBadge  from "../components/GrowthBadge";
import useAuthStore from "../store/useAuthStore";
import API from "../api";

export default function Dashboard() {
  const { user }   = useAuthStore();
  const [portfolio, setPortfolio] = useState(null);
  const [autoLog,   setAutoLog]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/portfolio"),
      API.get("/portfolio/autoinvest"),
    ]).then(([p, a]) => {
      setPortfolio(p.data);
      setAutoLog(a.data.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
    </div>
  );

  const profitPct = portfolio?.total_invested > 0
    ? +((( portfolio.total_current_value - portfolio.total_invested)
        / portfolio.total_invested) * 100).toFixed(2)
    : 0;

  return (
    <div className="space-y-6">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <p className="text-emerald-100 text-sm">Investment Overview 📈</p>
        <h1 className="text-2xl font-bold mt-1">{user?.name}</h1>
        <div className="grid grid-cols-3 gap-4 mt-5">
          <div>
            <p className="text-emerald-200 text-xs uppercase tracking-wide">Invested</p>
            <p className="text-2xl font-bold">₹{portfolio?.total_invested?.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-emerald-200 text-xs uppercase tracking-wide">Current Value</p>
            <p className="text-2xl font-bold">₹{portfolio?.total_current_value?.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-emerald-200 text-xs uppercase tracking-wide">Profit / Loss</p>
            <p className={`text-2xl font-bold ${portfolio?.total_profit_loss >= 0 ? "text-green-300" : "text-red-300"}`}>
              {portfolio?.total_profit_loss >= 0 ? "+" : ""}₹{portfolio?.total_profit_loss?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/portfolio">
          <Button variant="outline" className="w-full h-12">📊 Portfolio</Button>
        </Link>
        <Link to="/funds">
          <Button variant="outline" className="w-full h-12">🏦 All Funds</Button>
        </Link>
        <Link to="/autoinvest">
          <Button variant="outline" className="w-full h-12">🔄 Auto-Invest</Button>
        </Link>
      </div>

      {/* Holdings Summary */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Your Holdings</CardTitle>
            <Link to="/portfolio">
              <Button variant="ghost" size="sm" className="text-emerald-600 text-xs">
                Full View
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {portfolio?.holdings?.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">
              No investments yet — make a UPI payment to start!
            </p>
          )}
          {portfolio?.holdings?.map((h) => (
            <div key={h.fund_id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
              <div>
                <p className="text-sm font-medium text-slate-700">{h.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{h.category}</Badge>
                  <span className="text-xs text-slate-400">
                    {h.total_units?.toFixed(4)} units
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">₹{h.current_value?.toFixed(2)}</p>
                <GrowthBadge value={h.profit_pct} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Auto-Invests */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Auto-Investments 🔄</CardTitle>
            <Link to="/autoinvest">
              <Button variant="ghost" size="sm" className="text-emerald-600 text-xs">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {autoLog.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">No auto-investments yet</p>
          )}
          {autoLog.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-sm">
                  🚀
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{a.fund_name}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(a.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-600">₹{a.amount}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
