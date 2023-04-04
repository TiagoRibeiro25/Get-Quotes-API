const quotesDB = require("../database/QuotesDB");

async function currentStatus(req, res) {
	try {
		await quotesDB.connect();
		res.status(200).json({ status: "OK" });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	} finally {
		await quotesDB.disconnect();
	}
}

module.exports = { currentStatus };
