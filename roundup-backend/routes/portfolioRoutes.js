const express = require("express");
const router = express.Router();
const { getPortfolio, getInvestmentHistory, getAutoInvestLog } = require("../controllers/portfolioController");
const auth = require("../middleware/authMiddleware");

router.get("/",             auth, getPortfolio);
router.get("/investments",  auth, getInvestmentHistory);
router.get("/autoinvest",   auth, getAutoInvestLog);

module.exports = router;
