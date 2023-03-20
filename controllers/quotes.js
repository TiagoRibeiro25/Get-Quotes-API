const quotesDB = require("../models/QuotesDB");

function handleError(error, res) {
	console.log(`${new Date().toLocaleString()} - ${error}`);
	res.status(500).json({ error: "Internal server error" });
}

async function getQuotes(req, res) {
	console.log(`${new Date().toLocaleString()} - Fetching all quotes...`);
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
	console.log(`${new Date().toLocaleString()} - Fetching a random quote...`);
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

	console.log(`${new Date().toLocaleString()} - Adding a new quote...`);
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

	} catch (error) {
		handleError(error);
	}
}

module.exports = { getQuotes, getRandomQuote, addQuote };
