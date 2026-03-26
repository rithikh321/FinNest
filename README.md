# FinNest

FinNest is a mock UPI + Investment app demonstrating RoundUp Investing - every UPI payment rounds up to nearest ₹10, spare change collects in wallet, auto-invests at ₹100 into mutual funds.

---

## Overview
* Zero friction savings for students/gig workers (₹20K-50K/month)
* No budgeting needed - works for 99% of Indians using UPI
* ₹47 chai + ₹83 lunch + ₹64 snacks → ₹16 saved daily → ₹480/month
* ₹400 invested → ₹46,000 in 10 years @15% returns
* Monetization: ₹1/transaction + 0.5% AUM fee 

---

## Tech Stack
* **Backend:** Node.js + Express + SQLite
* **Frontend:** React 18 + Vite + Tailwind CSS + shadcn/ui
* **Charts:** Recharts
* **State Management:** Zustand
* **Authentication:** JWT

---

## Install & Run

    git clone https://github.com/rithikh321/FinNest.git
    cd FinNest

### Backend (localhost:3000)
    cd roundup-backend && npm install
    npm run dev

### UPI App (localhost:5173)  
    cd ../upi-frontend && npm install
    npm run dev

### MF App (localhost:5174)
    cd ../mf-frontend && npm install
    npm run dev

### Reset the Database
To reset the database to its default state or initialize it for the first time, run:

    cd roundup-backend
    node data/mockDB.js
    
### Test Credentials
Use the following credentials to explore the synchronization between the payment and investment modules:

    aarav@test.com / aarav123
    priya@test.com / priya123
