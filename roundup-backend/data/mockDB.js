const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");
const funds = require("./funds");

const db = new Database(path.join(__dirname, "../database.db"));

// ── pull in the schema ──────────────────────────────────────────
require("../config/db");

// ── CLEAR old data (safe re-seed) ──────────────────────────────
db.exec(`
  DELETE FROM investments;
  DELETE FROM wallet_history;
  DELETE FROM transactions;
  DELETE FROM mf_accounts;
  DELETE FROM upi_accounts;
  DELETE FROM nav_history;
  DELETE FROM mutual_funds;
  DELETE FROM users;
`);

// ── SEED MUTUAL FUNDS ───────────────────────────────────────────
const insertFund = db.prepare(`
  INSERT INTO mutual_funds (name, category, nav, return_1y, return_3y, return_5y, risk_level, fund_house, score)
  VALUES (@name, @category, @nav, @return_1y, @return_3y, @return_5y, @risk_level, @fund_house, @score)
`);

funds.forEach(f => {
  insertFund.run({ ...f, score: f.return_1y * 0.5 + f.return_3y * 0.3 + f.return_5y * 0.2 });
});
console.log("✅ 25 Mutual Funds seeded");

// ── SEED NAV HISTORY (30 days per fund) ─────────────────────────
const insertNav = db.prepare(`
  INSERT INTO nav_history (fund_id, nav, date) VALUES (?, ?, ?)
`);

const allFunds = db.prepare("SELECT * FROM mutual_funds").all();
allFunds.forEach(fund => {
  let nav = fund.nav;
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.48) * 0.008;
    nav = +(nav * (1 + change)).toFixed(2);
    insertNav.run(fund.id, nav, date.toISOString().split("T")[0]);
  }
});
console.log("✅ NAV history seeded (30 days x 25 funds)");

// ── SEED USERS ───────────────────────────────────────────────────
const users = [
  { name: "Aarav Shah",    email: "aarav@test.com",   password: "aarav123",   phone: "9876501001", occupation: "CS Student",       avatar_color: "#6366f1", balance: 3240,  wallet: 42,  fund: 1  },
  { name: "Priya Nair",    email: "priya@test.com",   password: "priya123",   phone: "9876501002", occupation: "Intern",           avatar_color: "#ec4899", balance: 1850,  wallet: 78,  fund: 19 },
  { name: "Riya Sharma",   email: "riya@test.com",    password: "riya123",    phone: "9876501003", occupation: "IT Fresher",       avatar_color: "#f59e0b", balance: 6400,  wallet: 15,  fund: 4  },
  { name: "Kiran Patel",   email: "kiran@test.com",   password: "kiran123",   phone: "9876501004", occupation: "Part Timer",       avatar_color: "#10b981", balance: 920,   wallet: 91,  fund: 25 },
  { name: "Anjali Mehta",  email: "anjali@test.com",  password: "anjali123",  phone: "9876501005", occupation: "BCA Student",      avatar_color: "#8b5cf6", balance: 2150,  wallet: 33,  fund: 7  },
  { name: "Rohit Das",     email: "rohit@test.com",   password: "rohit123",   phone: "9876501006", occupation: "Junior Developer", avatar_color: "#0ea5e9", balance: 8730,  wallet: 60,  fund: 11 },
  { name: "Sneha Iyer",    email: "sneha@test.com",   password: "sneha123",   phone: "9876501007", occupation: "Design Intern",    avatar_color: "#f43f5e", balance: 1400,  wallet: 5,   fund: 24 },
  { name: "Arjun Reddy",   email: "arjun@test.com",   password: "arjun123",   phone: "9876501008", occupation: "Junior Analyst",   avatar_color: "#14b8a6", balance: 4670,  wallet: 88,  fund: 6  },
  { name: "Pooja Verma",   email: "pooja@test.com",   password: "pooja123",   phone: "9876501009", occupation: "MBA Student",      avatar_color: "#f97316", balance: 780,   wallet: 22,  fund: 18 },
  { name: "Vikram Singh",  email: "vikram@test.com",  password: "vikram123",  phone: "9876501010", occupation: "Support Executive",avatar_color: "#64748b", balance: 5200,  wallet: 55,  fund: 16 },
  { name: "Meera Pillai",  email: "meera@test.com",   password: "meera123",   phone: "9876501011", occupation: "HR Intern",        avatar_color: "#a855f7", balance: 2980,  wallet: 70,  fund: 3  },
  { name: "Deepak Kumar",  email: "deepak@test.com",  password: "deepak123",  phone: "9876501012", occupation: "Delivery Executive",avatar_color:"#84cc16", balance: 1120,  wallet: 10,  fund: 22 },
];

const insertUser    = db.prepare(`INSERT INTO users (name, email, password, phone, occupation, avatar_color) VALUES (@name, @email, @password, @phone, @occupation, @avatar_color)`);
const insertUPI     = db.prepare(`INSERT INTO upi_accounts (user_id, upi_id, balance, wallet_balance, preferred_fund_id) VALUES (?, ?, ?, ?, ?)`);
const insertMFAcct  = db.prepare(`INSERT INTO mf_accounts (user_id, total_invested) VALUES (?, ?)`);

users.forEach(u => {
  const hash = bcrypt.hashSync(u.password, 10);
  const userRow = insertUser.run({ ...u, password: hash });
  const uid = userRow.lastInsertRowid;
  const upiId = u.name.split(" ")[0].toLowerCase() + "@roundup";
  insertUPI.run(uid, upiId, u.balance, u.wallet, u.fund);
  insertMFAcct.run(uid, 0);
});
console.log("✅ 12 Users seeded");

// ── SEED PAST TRANSACTIONS (10 per user) ────────────────────────
const notes = [
  "Chai & Snacks", "Auto Rickshaw", "Zomato Order", "Bus Pass",
  "Grocery Store", "Movie Ticket", "Phone Recharge", "Petrol",
  "Canteen Lunch", "Swiggy Order", "Metro Card", "Stationary",
];

const insertTxn = db.prepare(`
  INSERT INTO transactions (sender_id, receiver_id, amount, roundup_amount, wallet_before, wallet_after, note, timestamp)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertWalletHistory = db.prepare(`
  INSERT INTO wallet_history (user_id, type, amount, wallet_balance_after, fund_id, timestamp)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const insertInvestment = db.prepare(`
  INSERT INTO investments (user_id, fund_id, units, amount, source, invested_at)
  VALUES (?, ?, ?, ?, 'roundup_auto', ?)
`);
const updateMFTotal = db.prepare(`
  UPDATE mf_accounts SET total_invested = total_invested + ? WHERE user_id = ?
`);

const allUPIAccounts = db.prepare("SELECT * FROM upi_accounts").all();

allUPIAccounts.forEach(acc => {
  let walletSim = 0;

  for (let i = 0; i < 10; i++) {
    const amount    = Math.floor(Math.random() * 180) + 20;  // ₹20–₹200
    const roundup   = Math.ceil(amount / 10) * 10 - amount;
    const receiver  = allUPIAccounts[Math.floor(Math.random() * allUPIAccounts.length)];
    const walletBefore = walletSim;
    walletSim = +(walletSim + roundup).toFixed(2);

    const daysAgo = 10 - i;
    const ts = new Date();
    ts.setDate(ts.getDate() - daysAgo);

    insertTxn.run(acc.id, receiver.id, amount, roundup, walletBefore, Math.min(walletSim, 100), notes[i % notes.length], ts.toISOString());
    insertWalletHistory.run(acc.user_id, "credit", roundup, Math.min(walletSim, 100), null, ts.toISOString());

    // simulate a wallet threshold hit mid-history
    if (walletSim >= 100) {
      const fund = allFunds[acc.preferred_fund_id - 1];
      const units = +(100 / fund.nav).toFixed(6);
      insertInvestment.run(acc.user_id, fund.id, units, 100, ts.toISOString());
      insertWalletHistory.run(acc.user_id, "invested", 100, 0, fund.id, ts.toISOString());
      updateMFTotal.run(100, acc.user_id);
      walletSim = +(walletSim - 100).toFixed(2);
    }
  }
});
console.log("✅ Past transactions + wallet history seeded");
console.log("🎉 Database ready! Run: npm run dev");
