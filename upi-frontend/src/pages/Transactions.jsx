import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge }   from "@/components/ui/badge";
import { Skeleton} from "@/components/ui/skeleton";
import API from "../api";

export default function Transactions() {
  const [txns,    setTxns]    = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/transactions/history"),
      API.get("/users/profile"),
    ]).then(([t, p]) => {
      setTxns(t.data);
      setProfile(p.data);
    }).finally(() => setLoading(false));
  }, []);

  const totalRoundups = txns
    .filter(t => t.sender_id === profile?.upi?.id)
    .reduce((s, t) => s + (t.roundup_amount || 0), 0);

  if (loading) return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
    </div>
  );

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Transaction History</h1>
        <p className="text-slate-500 text-sm mt-1">All your payments and roundups</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500">Total Transactions</p>
            <p className="text-2xl font-bold text-slate-800">{txns.length}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500">Total Roundups</p>
            <p className="text-2xl font-bold text-blue-600">₹{totalRoundups.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {txns.map((t) => {
            const isSender = t.sender_id === profile?.upi?.id;
            const date = new Date(t.timestamp).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
            });
            return (
              <div key={t.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base
                    ${isSender ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}>
                    {isSender ? "↑" : "↓"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {isSender ? `To: ${t.receiver_name}` : `From: ${t.sender_name}`}
                    </p>
                    <p className="text-xs text-slate-400">{t.note || "Payment"} • {date}</p>
                    {isSender && t.roundup_amount > 0 && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        🪣 ₹{t.roundup_amount} to wallet
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${isSender ? "text-red-500" : "text-green-500"}`}>
                    {isSender ? "-" : "+"}₹{t.amount}
                  </p>
                  <p className="text-xs text-slate-400">
                    wallet: ₹{t.wallet_after?.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
