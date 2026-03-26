const db = require("../config/db");
const { calculateRoundup, processWallet } = require("../services/roundupService");
const { recordInvestment }               = require("../services/investmentService");

exports.sendMoney = (req, res) => {
  const { receiver_upi_id, amount, note } = req.body;

  if (!receiver_upi_id || !amount || amount <= 0)
    return res.status(400).json({ error: "Invalid payment details" });

  const senderUPI = db.prepare(
    "SELECT * FROM upi_accounts WHERE user_id = ?"
  ).get(req.user.id);

  if (!senderUPI) return res.status(404).json({ error: "UPI account not found" });
  if (senderUPI.balance < amount)
    return res.status(400).json({ error: "Insufficient balance" });

  const receiverUPI = db.prepare(
    "SELECT * FROM upi_accounts WHERE upi_id = ?"
  ).get(receiver_upi_id);

  if (!receiverUPI) return res.status(404).json({ error: "Receiver not found" });
  if (senderUPI.id === receiverUPI.id)
    return res.status(400).json({ error: "Cannot pay yourself" });

  const roundup     = calculateRoundup(amount);
  const allFunds    = db.prepare("SELECT * FROM mutual_funds").all();
  const walletResult = processWallet(senderUPI, roundup, allFunds);

  // deduct sender balance
  db.prepare(
    "UPDATE upi_accounts SET balance = balance - ? WHERE user_id = ?"
  ).run(amount, req.user.id);

  // credit receiver
  db.prepare(
    "UPDATE upi_accounts SET balance = balance + ? WHERE id = ?"
  ).run(amount, receiverUPI.id);

  // update wallet
  db.prepare(
    "UPDATE upi_accounts SET wallet_balance = ? WHERE user_id = ?"
  ).run(walletResult.newWalletBalance, req.user.id);

  // record transaction
  db.prepare(`
    INSERT INTO transactions
      (sender_id, receiver_id, amount, roundup_amount, wallet_before, wallet_after, note)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    senderUPI.id, receiverUPI.id, amount, roundup,
    senderUPI.wallet_balance, walletResult.newWalletBalance,
    note || ""
  );

  // record wallet credit
  db.prepare(`
    INSERT INTO wallet_history (user_id, type, amount, wallet_balance_after)
    VALUES (?, 'credit', ?, ?)
  `).run(req.user.id, roundup, walletResult.newWalletBalance);

  // if threshold hit → invest
  if (walletResult.shouldInvest) {
    recordInvestment(
      req.user.id,
      walletResult.fund,
      walletResult.units,
      walletResult.investedAmount
    );
  }

  res.json({
    success: true,
    amount_paid:    amount,
    roundup:        roundup,
    wallet_balance: walletResult.newWalletBalance,
    invested:       walletResult.shouldInvest,
    invested_into:  walletResult.shouldInvest ? walletResult.fund.name : null,
    message: walletResult.shouldInvest
      ? `₹${amount} paid. ₹100 auto-invested into ${walletResult.fund.name}! 🎉`
      : `₹${amount} paid. ₹${roundup} added to wallet.`,
  });
};

exports.getHistory = (req, res) => {
  const upi = db.prepare(
    "SELECT id FROM upi_accounts WHERE user_id = ?"
  ).get(req.user.id);

  const txns = db.prepare(`
    SELECT t.*,
      su.upi_id AS sender_upi,
      ru.upi_id AS receiver_upi,
      su2.name  AS sender_name,
      ru2.name  AS receiver_name
    FROM transactions t
    JOIN upi_accounts su  ON t.sender_id   = su.id
    JOIN upi_accounts ru  ON t.receiver_id = ru.id
    JOIN users su2        ON su.user_id    = su2.id
    JOIN users ru2        ON ru.user_id    = ru2.id
    WHERE t.sender_id = ? OR t.receiver_id = ?
    ORDER BY t.timestamp DESC
    LIMIT 50
  `).all(upi.id, upi.id);

  res.json(txns);
};
