const express = require("express");
const quotes = require("../controllers/quotes");
const status = require("../controllers/status");

const router = express.Router();

router.get("/status", status.currentStatus);

router.get("/quotes", quotes.getQuotes);

router.get("/quotes/random", quotes.getRandomQuote);

router.post("/quotes/add", quotes.addQuote);

module.exports = router;
