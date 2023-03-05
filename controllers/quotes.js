const quotesDB = require("../models/QuotesDB");

async function getQuotes(req, res) {
	console.log(`${new Date().toLocaleString()} - Fetching all quotes...`);
	try {
		await quotesDB.connect();
		const quotes = await quotesDB.getQuotes();
		res.status(200).json(quotes);
	} catch (error) {
		console.log(`${new Date().toLocaleString()} - ${error}`);
		res.status(500).json({ error: "Internal server error" });
	} finally {
		await quotesDB.disconnect();
	}
}

async function getRandomQuote(req, res) {
	console.log(`${new Date().toLocaleString()} - Fetching a random quote...`);
	try {
		await quotesDB.connect();
		const randomQuote = await quotesDB.getRandomQuote();
		res.status(200).json(randomQuote);
	} catch (error) {
		console.log(`${new Date().toLocaleString()} - ${error}`);
		res.status(500).json({ error: "Internal server error" });
	} finally {
		await quotesDB.disconnect();
	}
}

module.exports = { getQuotes, getRandomQuote };
