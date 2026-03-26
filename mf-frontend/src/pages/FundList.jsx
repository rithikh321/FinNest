import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input }    from "@/components/ui/input";
import { Badge }    from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import GrowthBadge  from "../components/GrowthBadge";
import RiskBadge    from "../components/RiskBadge";
import API from "../api";

const CATEGORIES = ["All", "Equity", "Debt", "Hybrid", "Sector", "ELSS"];

export default function FundList() {
  const [funds,    setFunds]    = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    API.get("/funds").then(r => {
      setFunds(r.data);
      setFiltered(r.data);
    }).finally(() => setLoading(false));

    // refresh NAV every 10 seconds
    const interval = setInterval(() => {
      API.get("/funds").then(r => setFunds(r.data));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = funds;
    if (category !== "All") result = result.filter(f => f.category === category);
    if (search) result = result.filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.fund_house.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, category, funds]);

  if (loading) return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
    </div>
  );

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Mutual Funds</h1>
        <p className="text-slate-500 text-sm mt-1">
          {filtered.length} funds • NAV updates every 10s
        </p>
      </div>

      {/* Search + Filter */}
      <div className="space-y-3">
        <Input
          placeholder="Search funds or fund house..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${category === c
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Fund List */}
      <div className="space-y-2">
        {filtered.map((f) => (
          <Link key={f.id} to={`/funds/${f.id}`}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{f.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{f.category}</Badge>
                      <RiskBadge level={f.risk_level} />
                      <span className="text-xs text-slate-400">{f.fund_house}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-sm font-bold text-slate-800">
                      ₹{f.live_nav?.toFixed(2)}
                    </p>
                    <GrowthBadge value={f.live_change} />
                    <p className="text-xs text-slate-400 mt-1">1Y: {f.return_1y}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

    </div>
  );
}
