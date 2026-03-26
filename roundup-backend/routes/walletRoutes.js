const express = require("express");
const router = express.Router();
const { getWalletStatus, getWalletHistory, updatePreferredFund } = require("../controllers/walletController");
const auth = require("../middleware/authMiddleware");

router.get("/status",          auth, getWalletStatus);
router.get("/history",         auth, getWalletHistory);
router.put("/preferred-fund",  auth, updatePreferredFund);

module.exports = router;
