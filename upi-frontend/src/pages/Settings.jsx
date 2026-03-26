import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";
import { toast }  from "sonner";
import API from "../api";
import useAuthStore from "../store/useAuthStore";

export default function Settings() {
  const { user }  = useAuthStore();
  const [funds,   setFunds]   = useState([]);
  const [wallet,  setWallet]  = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      API.get("/funds"),
      API.get("/wallet/status"),
    ]).then(([f, w]) => {
      setFunds(f.data);
      setWallet(w.data);
    });
  }, []);

  const handleChangeFund = async (fundId) => {
    setLoading(true);
    try {
      await API.put("/wallet/preferred-fund", { fund_id: fundId });
      const w = await API.get("/wallet/status");
      setWallet(w.data);
      toast.success("Preferred fund updated ✅");
    } catch {
      toast.error("Failed to update fund");
    } finally {
      setLoading(false);
    }
  };

  const riskColor = {
    Low:    "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High:   "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your RoundUp preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Occupation</span>
            <span className="font-medium">{user?.occupation}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Wallet Threshold</span>
            <Badge>₹100 (fixed)</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Preferred Fund Selector */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Auto-Invest Fund</CardTitle>
          <CardDescription>
            Currently: <strong>{wallet?.preferred_fund?.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {funds.map((f) => {
            const isSelected = wallet?.preferred_fund?.id === f.id;
            return (
              <div key={f.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
                  ${isSelected ? "border-blue-400 bg-blue-50" : "border-slate-100 hover:bg-slate-50"}`}
                onClick={() => !isSelected && handleChangeFund(f.id)}
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">{f.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskColor[f.risk_level]}`}>
                      {f.risk_level}
                    </span>
                    <span className="text-xs text-slate-400">{f.fund_house}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{f.return_1y}%</p>
                  <p className="text-xs text-slate-400">1Y return</p>
                  {isSelected && (
                    <Badge className="text-xs mt-1 bg-blue-600">Selected</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

    </div>
  );
}
