import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import WalletProgressBar from "../components/WalletProgressBar";
import useAuthStore from "../store/useAuthStore";
import API from "../api";

export default function Dashboard() {
  const { user }  = useAuthStore();
  const [profile, setProfile]  = useState(null);
  const [wallet,  setWallet]   = useState(null);
  const [txns,    setTxns]     = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, w, t] = await Promise.all([
          API.get("/users/profile"),
          API.get("/wallet/status"),
          API.get("/transactions/history"),
        ]);
        setProfile(p.data);
        setWallet(w.data);
        setTxns(t.data.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <p className="text-blue-100 text-sm">Good day 👋</p>
        <h1 className="text-2xl font-bold mt-1">{user?.name}</h1>
        <p className="text-blue-200 text-sm mt-1">{profile?.occupation}</p>
        <div className="mt-4">
          <p className="text-blue-100 text-xs uppercase tracking-wide">UPI Balance</p>
          <p className="text-4xl font-bold mt-1">₹{profile?.upi?.balance?.toLocaleString("en-IN")}</p>
          <p className="text-blue-200 text-sm mt-1">{profile?.upi?.upi_id}</p>
        </div>
      </div>

      {/* Wallet Bar */}
      {wallet && <WalletProgressBar wallet_balance={wallet.wallet_balance} />}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/send">
          <Button className="w-full h-14 text-base" size="lg">
            💸 Pay Someone
          </Button>
        </Link>
        <Link to="/wallet">
          <Button variant="outline" className="w-full h-14 text-base" size="lg">
            🪣 View Wallet
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-500">Wallet</p>
            <p className="text-xl font-bold text-blue-600">₹{wallet?.wallet_balance}</p>
            <p className="text-xs text-slate-400">/ ₹100</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-500">Investing in</p>
            <p className="text-sm font-bold text-green-600 leading-tight mt-1">
              {wallet?.preferred_fund?.name?.split(" ").slice(0, 2).join(" ")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-500">Transactions</p>
            <p className="text-xl font-bold text-purple-600">{txns.length}</p>
            <p className="text-xs text-slate-400">recent</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Transactions</CardTitle>
            <Link to="/transactions">
              <Button variant="ghost" size="sm" className="text-blue-600 text-xs">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {txns.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">No transactions yet</p>
          )}
          {txns.map((t) => {
            const isSender = t.sender_id === profile?.upi?.id;
            return (
              <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm
                    ${isSender ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}>
                    {isSender ? "↑" : "↓"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {isSender ? t.receiver_name : t.sender_name}
                    </p>
                    <p className="text-xs text-slate-400">{t.note || "Payment"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${isSender ? "text-red-500" : "text-green-500"}`}>
                    {isSender ? "-" : "+"}₹{t.amount}
                  </p>
                  {isSender && t.roundup_amount > 0 && (
                    <Badge variant="secondary" className="text-xs mt-0.5">
                      +₹{t.roundup_amount} 🪣
                    </Badge>
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
