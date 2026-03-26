const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "../database.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    occupation TEXT,
    avatar_color TEXT DEFAULT '#6366f1',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS upi_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    upi_id TEXT UNIQUE NOT NULL,
    balance REAL DEFAULT 0,
    wallet_balance REAL DEFAULT 0,
    preferred_fund_id INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    roundup_amount REAL DEFAULT 0,
    wallet_before REAL DEFAULT 0,
    wallet_after REAL DEFAULT 0,
    note TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES upi_accounts(id),
    FOREIGN KEY (receiver_id) REFERENCES upi_accounts(id)
  );

  CREATE TABLE IF NOT EXISTS wallet_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    wallet_balance_after REAL NOT NULL,
    fund_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS mutual_funds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    nav REAL NOT NULL,
    return_1y REAL,
    return_3y REAL,
    return_5y REAL,
    risk_level TEXT,
    fund_house TEXT,
    score REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS nav_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fund_id INTEGER NOT NULL,
    nav REAL NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (fund_id) REFERENCES mutual_funds(id)
  );

  CREATE TABLE IF NOT EXISTS mf_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    total_invested REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    fund_id INTEGER NOT NULL,
    units REAL NOT NULL,
    amount REAL NOT NULL,
    source TEXT DEFAULT 'roundup_auto',
    invested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fund_id) REFERENCES mutual_funds(id)
  );
`);

module.exports = db;
