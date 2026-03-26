const db = require("../config/db");
const { getDynamicNAV } = require("../services/navService");

exports.getPortfolio = (req, res) => {
  const mfAcct = db.prepare(
    "SELECT * FROM mf_accounts WHERE user_id = ?"
  ).get(req.user.id);

  const investments = db.prepare(`
    SELECT i.*, mf.name, mf.nav AS base_nav, mf.category, mf.return_1y, mf.risk_level
    FROM investments i
    JOIN mutual_funds mf ON i.fund_id = mf.id
    WHERE i.user_id = ?
  `).all(req.user.id);

  // group by fund
  const grouped = {};
  investments.forEach(inv => {
    if (!grouped[inv.fund_id]) {
      grouped[inv.fund_id] = {
        fund_id:    inv.fund_id,
        name:       inv.name,
        category:   inv.category,
        return_1y:  inv.return_1y,
        risk_level: inv.risk_level,
        total_units:  0,
        total_amount: 0,
        live_nav:   getDynamicNAV(inv.base_nav, inv.fund_id),
      };
    }
    grouped[inv.fund_id].total_units  += inv.units;
    grouped[inv.fund_id].total_amount += inv.amount;
  });

  const holdings = Object.values(grouped).map(h => ({
    ...h,
    current_value: +(h.total_units * h.live_nav).toFixed(2),
    profit_loss:   +(h.total_units * h.live_nav - h.total_amount).toFixed(2),
    profit_pct:    h.total_amount > 0
      ? +(((h.total_units * h.live_nav - h.total_amount) / h.total_amount) * 100).toFixed(2)
      : 0,
  }));

  const total_current = holdings.reduce((s, h) => s + h.current_value, 0);

  res.json({
    total_invested:     mfAcct?.total_invested || 0,
    total_current_value: +total_current.toFixed(2),
    total_profit_loss:  +(total_current - (mfAcct?.total_invested || 0)).toFixed(2),
    holdings,
  });
};

exports.getInvestmentHistory = (req, res) => {
  const investments = db.prepare(`
    SELECT i.*, mf.name AS fund_name, mf.category
    FROM investments i
    JOIN mutual_funds mf ON i.fund_id = mf.id
    WHERE i.user_id = ?
    ORDER BY i.invested_at DESC
  `).all(req.user.id);

  res.json(investments);
};

exports.getAutoInvestLog = (req, res) => {
  const log = db.prepare(`
    SELECT wh.*, mf.name AS fund_name, mf.category
    FROM wallet_history wh
    LEFT JOIN mutual_funds mf ON wh.fund_id = mf.id
    WHERE wh.user_id = ? AND wh.type = 'invested'
    ORDER BY wh.timestamp DESC
  `).all(req.user.id);

  res.json(log);
};
