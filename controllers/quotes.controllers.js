const quotesDB = require("../database/QuotesDB");

function handleError(error, res) {
	res.status(500).json({ error: "Internal server error" });
}

async function getQuotes(req, res) {
	try {
		await quotesDB.connect();
		const quotes = await quotesDB.getQuotes();
		res.status(200).json(quotes);
	} catch (error) {
		handleError(error, res);
	} finally {
		await quotesDB.disconnect();
	}
}

async function getRandomQuote(req, res) {
	try {
		await quotesDB.connect();
		const randomQuote = await quotesDB.getRandomQuote();
		res.status(200).json(randomQuote);
	} catch (error) {
		handleError(error, res);
	} finally {
		await quotesDB.disconnect();
	}
}

async function addQuote(req, res) {
	if (req.headers.auth_key !== process.env.AUTH_KEY) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		await quotesDB.connect();
		await quotesDB.addQuote({ author: req.body.author, content: req.body.content });
		res.status(200).json({ message: "Quote added successfully" });
	} catch (error) {
		handleError(error, res);
	} finally {
		await quotesDB.disconnect();
	}
}

async function deleteQuote(req, res) {
	if (req.headers.auth_key !== process.env.AUTH_KEY) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		await quotesDB.connect();
		const result = await quotesDB.deleteQuote(req.params.id);
		if (!result) return res.status(404).json({ error: "Quote not found" });
		else res.status(204).json({ message: "Quote deleted successfully" });
	} catch (error) {
		handleError(error, res);
	} finally {
		await quotesDB.disconnect();
	}
}

module.exports = { getQuotes, getRandomQuote, addQuote, deleteQuote };
