const db = require("../config/db");

function getBestFund(preferredFundId) {
  // Try preferred fund first, else pick highest score
  const preferred = db.prepare(
    "SELECT * FROM mutual_funds WHERE id = ?"
  ).get(preferredFundId);

  if (preferred) return preferred;

  return db.prepare(
    "SELECT * FROM mutual_funds ORDER BY score DESC LIMIT 1"
  ).get();
}

function recordInvestment(userId, fund, units, amount, timestamp = null) {
  const ts = timestamp || new Date().toISOString();

  db.prepare(`
    INSERT INTO investments (user_id, fund_id, units, amount, source, invested_at)
    VALUES (?, ?, ?, ?, 'roundup_auto', ?)
  `).run(userId, fund.id, units, amount, ts);

  db.prepare(`
    UPDATE mf_accounts SET total_invested = total_invested + ?
    WHERE user_id = ?
  `).run(amount, userId);

  db.prepare(`
    INSERT INTO wallet_history (user_id, type, amount, wallet_balance_after, fund_id)
    VALUES (?, 'invested', ?, 0, ?)
  `).run(userId, amount, fund.id);
}

module.exports = { getBestFund, recordInvestment };
