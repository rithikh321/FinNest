const express = require("express");
const router = express.Router();
const { sendMoney, getHistory } = require("../controllers/transactionController");
const auth = require("../middleware/authMiddleware");

router.post("/send",    auth, sendMoney);
router.get("/history",  auth, getHistory);

module.exports = router;
