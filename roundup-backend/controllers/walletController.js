const db = require("../config/db");

exports.getWalletStatus = (req, res) => {
  const upi = db.prepare(
    "SELECT wallet_balance, preferred_fund_id FROM upi_accounts WHERE user_id = ?"
  ).get(req.user.id);

  if (!upi) return res.status(404).json({ error: "UPI account not found" });

  const fund = db.prepare(
    "SELECT id, name, category, return_1y FROM mutual_funds WHERE id = ?"
  ).get(upi.preferred_fund_id);

  res.json({
    wallet_balance:  upi.wallet_balance,
    threshold:       100,
    remaining:       +(100 - upi.wallet_balance).toFixed(2),
    percent_filled:  +((upi.wallet_balance / 100) * 100).toFixed(1),
    preferred_fund:  fund || null,
  });
};

exports.getWalletHistory = (req, res) => {
  const history = db.prepare(`
    SELECT wh.*, mf.name AS fund_name
    FROM wallet_history wh
    LEFT JOIN mutual_funds mf ON wh.fund_id = mf.id
    WHERE wh.user_id = ?
    ORDER BY wh.timestamp DESC
    LIMIT 40
  `).all(req.user.id);

  res.json(history);
};

exports.updatePreferredFund = (req, res) => {
  const { fund_id } = req.body;
  if (!fund_id) return res.status(400).json({ error: "fund_id required" });

  const fund = db.prepare("SELECT * FROM mutual_funds WHERE id = ?").get(fund_id);
  if (!fund) return res.status(404).json({ error: "Fund not found" });

  db.prepare(
    "UPDATE upi_accounts SET preferred_fund_id = ? WHERE user_id = ?"
  ).run(fund_id, req.user.id);

  res.json({ success: true, message: `Preferred fund updated to ${fund.name}` });
};
