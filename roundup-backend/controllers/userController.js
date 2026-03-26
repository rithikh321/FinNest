const db = require("../config/db");

exports.getProfile = (req, res) => {
  const user = db.prepare(
    "SELECT id, name, email, phone, occupation, avatar_color FROM users WHERE id = ?"
  ).get(req.user.id);

  if (!user) return res.status(404).json({ error: "User not found" });

  const upi = db.prepare(
    "SELECT id, upi_id, balance, wallet_balance, preferred_fund_id FROM upi_accounts WHERE user_id = ?"
  ).get(req.user.id);

  if (!upi) return res.status(404).json({ error: "UPI account not found" });

  const fund = db.prepare(
    "SELECT id, name, category FROM mutual_funds WHERE id = ?"
  ).get(upi.preferred_fund_id);

  res.json({ ...user, upi, preferred_fund: fund || null });
};
