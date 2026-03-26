require("dotenv").config();
const express = require("express");
const cors = require("cors");

require("./config/db"); // initialize DB + tables

const authRoutes        = require("./routes/authRoutes");
const userRoutes        = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const walletRoutes      = require("./routes/walletRoutes");
const fundRoutes        = require("./routes/fundRoutes");
const portfolioRoutes   = require("./routes/portfolioRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",         authRoutes);
app.use("/api/users",        userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/wallet",       walletRoutes);
app.use("/api/funds",        fundRoutes);
app.use("/api/portfolio",    portfolioRoutes);

app.get("/", (req, res) => res.json({ status: "RoundUp Backend Running ✅" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
