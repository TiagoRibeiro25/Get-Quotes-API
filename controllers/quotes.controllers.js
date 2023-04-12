const quotesDB = require("../database/QuotesDB");

async function getQuotes(req, res) {
	try {
		await quotesDB.connect();
		const quotes = await quotesDB.getQuotes();
		res.status(200).json(quotes);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
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
		res.status(500).json({ error: "Internal server error" });
	} finally {
		await quotesDB.disconnect();
	}
}

async function addQuote(req, res) {
	if (req.headers.auth_key !== process.env.AUTH_KEY) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	if (!req.body.author || !req.body.content) {
		return res.status(400).json({ error: "Missing author or content" });
	}

	try {
		await quotesDB.connect();
		await quotesDB.addQuote({ author: req.body.author, content: req.body.content });
		res.status(200).json({ message: "Quote added successfully" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
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
		await quotesDB.deleteQuote(req.params.id);
		res.status(204).json({ message: "Quote deleted successfully" });
	} catch (error) {
		// if the error is a MongoError, then the id is valid but the quote is not found
		if (error.name === "BSONError") res.status(404).json({ error: "Quote not found" });
		// if the error is a different error, then it's an internal server error
		else res.status(500).json({ error: "Internal server error" });
	} finally {
		await quotesDB.disconnect();
	}
}

module.exports = { getQuotes, getRandomQuote, addQuote, deleteQuote };
