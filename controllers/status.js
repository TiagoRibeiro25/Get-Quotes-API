const quotesDB = require("../models/QuotesDB");

async function currentStatus(req, res) {
	console.log(`\n${new Date().toLocaleString()} - Checking status...`);
	try {
		await quotesDB.connect();
		res.status(200).json({ status: "OK" });
	} catch (error) {
		console.log(`${new Date().toLocaleString()} - ${error}`);
		res.status(500).json({ error: "Internal server error" });
	} finally {
		await quotesDB.disconnect();
	}
}

module.exports = { currentStatus };
