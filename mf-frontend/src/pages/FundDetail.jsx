import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button }   from "@/components/ui/button";
import { Badge }    from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import GrowthBadge from "../components/GrowthBadge";
import RiskBadge   from "../components/RiskBadge";
import API from "../api";

export default function FundDetail() {
  const { id }   = useParams();
  const [fund,   setFund]    = useState(null);
  const [history,setHistory] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get(`/funds/${id}`),
      API.get(`/funds/${id}/history`),
    ]).then(([f, h]) => {
      setFund(f.data);
      setHistory(h.data);
    }).finally(() => setLoading(false));

    const interval = setInterval(() => {
      API.get(`/funds/${id}`).then(r => setFund(r.data));
    }, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div className="flex items-center gap-3">
        <Link to="/funds">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
      </div>

      {/* Fund Header */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardContent className="pt-5 pb-4">
          <h1 className="text-xl font-bold text-slate-800">{fund?.name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary">{fund?.category}</Badge>
            <RiskBadge level={fund?.risk_level} />
            <span className="text-xs text-slate-500">{fund?.fund_house}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-slate-500">Live NAV</p>
              <p className="text-2xl font-bold text-slate-800">₹{fund?.live_nav?.toFixed(2)}</p>
              <GrowthBadge value={fund?.live_change} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">1Y Return</span>
                <span className="font-semibold text-green-600">{fund?.return_1y}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">3Y Return</span>
                <span className="font-semibold text-green-600">{fund?.return_3y}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">5Y Return</span>
                <span className="font-semibold text-green-600">{fund?.return_5y}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NAV Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">NAV History (30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                domain={["auto", "auto"]}
              />
              <Tooltip
                formatter={(v) => `₹${v}`}
                contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
              />
              <Line
                type="monotone" dataKey="nav"
                stroke="#10b981" strokeWidth={2}
                dot={false} name="NAV"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
