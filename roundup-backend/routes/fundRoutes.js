const express = require("express");
const router = express.Router();
const { getAllFunds, getFundById, getFundNavHistory } = require("../controllers/fundController");
const auth = require("../middleware/authMiddleware");

router.get("/",            auth, getAllFunds);
router.get("/:id",         auth, getFundById);
router.get("/:id/history", auth, getFundNavHistory);

module.exports = router;
