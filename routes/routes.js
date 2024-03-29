const express = require("express");
const quotes = require("../controllers/quotes.controllers");
const status = require("../controllers/status.controllers");

const router = express.Router();

router.get("/status", status.currentStatus);

router.get("/quotes", quotes.getQuotes);

router.get("/quotes/random", quotes.getRandomQuote);

router.post("/quotes", quotes.addQuote);

router.delete("/quotes/:id", quotes.deleteQuote);

module.exports = router;
