const db = require("../config/db");
const { getDynamicNAV, getDynamicChange } = require("../services/navService");

exports.getAllFunds = (req, res) => {
  const funds = db.prepare(
    "SELECT * FROM mutual_funds ORDER BY score DESC"
  ).all();

  const enriched = funds.map(f => ({
    ...f,
    live_nav:    getDynamicNAV(f.nav, f.id),
    live_change: getDynamicChange(f.id),
  }));

  res.json(enriched);
};

exports.getFundById = (req, res) => {
  const fund = db.prepare(
    "SELECT * FROM mutual_funds WHERE id = ?"
  ).get(req.params.id);

  if (!fund) return res.status(404).json({ error: "Fund not found" });

  res.json({
    ...fund,
    live_nav:    getDynamicNAV(fund.nav, fund.id),
    live_change: getDynamicChange(fund.id),
  });
};

exports.getFundNavHistory = (req, res) => {
  const history = db.prepare(`
    SELECT nav, date FROM nav_history
    WHERE fund_id = ?
    ORDER BY date ASC
  `).all(req.params.id);

  res.json(history);
};
