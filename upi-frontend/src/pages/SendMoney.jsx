import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input }  from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label }  from "@/components/ui/label";
import { Badge }  from "@/components/ui/badge";
import { toast }  from "sonner";
import WalletProgressBar from "../components/WalletProgressBar";
import API from "../api";

export default function SendMoney() {
  const [upiId,   setUpiId]   = useState("");
  const [amount,  setAmount]  = useState("");
  const [note,    setNote]    = useState("");
  const [wallet,  setWallet]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

  useEffect(() => {
    API.get("/wallet/status").then(r => setWallet(r.data));
  }, []);

  const roundup = amount && !isNaN(amount)
    ? Math.ceil(Number(amount) / 10) * 10 - Number(amount)
    : 0;

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await API.post("/transactions/send", {
        receiver_upi_id: upiId,
        amount: Number(amount),
        note,
      });
      setResult(res.data);
      setWallet(prev => ({ ...prev, wallet_balance: res.data.wallet_balance }));

      if (res.data.invested) {
        toast.success(`🎉 ₹100 auto-invested into ${res.data.invested_into}!`, {
          description: "Your wallet has been reset to ₹0",
          duration: 5000,
        });
      } else {
        toast.success(`₹${roundup} added to your wallet 🪣`);
      }

      setUpiId(""); setAmount(""); setNote("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pay Someone</h1>
        <p className="text-slate-500 text-sm mt-1">Roundups auto-invest into your preferred fund</p>
      </div>

      {/* Wallet status */}
      {wallet && <WalletProgressBar wallet_balance={wallet.wallet_balance} />}

      {/* Roundup Preview */}
      {roundup > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">🪣</span>
          <div>
            <p className="text-sm font-semibold text-green-700">
              ₹{roundup} will go to your wallet
            </p>
            <p className="text-xs text-green-600">
              You spent ₹{amount} → ₹{Math.ceil(Number(amount) / 10) * 10} rounded up
            </p>
          </div>
        </div>
      )}

      {/* Payment Form */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Payment Details</CardTitle>
          <CardDescription>Enter the UPI ID and amount</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label>Receiver UPI ID</Label>
              <Input
                placeholder="priya@roundup"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                placeholder="47"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Note (optional)</Label>
              <Input
                placeholder="Chai & Snacks"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Processing..." : `Pay ₹${amount || "0"}`}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Success Result */}
      {result && (
        <Card className="border-0 shadow-sm bg-green-50 border-green-200">
          <CardContent className="pt-4 space-y-2">
            <p className="text-green-700 font-semibold">✅ Payment Successful!</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Amount Paid</p>
                <p className="font-semibold">₹{result.amount_paid}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Added to Wallet</p>
                <p className="font-semibold text-blue-600">₹{result.roundup}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Wallet Balance</p>
                <p className="font-semibold">₹{result.wallet_balance} / ₹100</p>
              </div>
              {result.invested && (
                <div>
                  <p className="text-slate-500 text-xs">Auto-Invested</p>
                  <Badge className="bg-green-600 text-xs">₹100 🚀</Badge>
                </div>
              )}
            </div>
            {result.invested && (
              <p className="text-xs text-green-600 font-medium">
                Invested into: {result.invested_into}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick UPI IDs */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-500">Quick Pay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["priya@roundup","riya@roundup","rohit@roundup","arjun@roundup"].map(id => (
              <Badge
                key={id}
                variant="outline"
                className="cursor-pointer hover:bg-blue-50"
                onClick={() => setUpiId(id)}
              >
                {id}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
