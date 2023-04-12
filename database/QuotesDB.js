const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

class QuotesDB {
	#uri;
	#client;

	constructor(username, password, uri) {
		this.#uri = `mongodb+srv://${username}:${password}@${uri}/?retryWrites=true&w=majority`;
		this.#client = new MongoClient(this.#uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}

	async connect() {
		await this.#client.connect();
	}

	async disconnect() {
		try {
			await this.#client.close();
		} catch (error) {
			throw new Error("Error disconnecting from MongoDB");
		}
	}

	async getQuotes() {
		const db = this.#client.db(process.env.DB_NAME);
		const collection = db.collection("quotes");
		const quotes = await collection.find().toArray();
		return quotes;
	}

	async getRandomQuote() {
		const db = this.#client.db(process.env.DB_NAME);
		const collection = db.collection("quotes");
		const randomQuote = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
		return randomQuote[0];
	}

	async addQuote(quote) {
		const db = this.#client.db(process.env.DB_NAME);
		const collection = db.collection("quotes");
		await collection.insertOne(quote);
	}

	async deleteQuote(id) {
		const db = this.#client.db(process.env.DB_NAME);
		const collection = db.collection("quotes");
		const result = await collection.deleteOne({ _id: new mongodb.ObjectId(id) });
		return !result.deletedCount == 0;
	}
}

const quotesDB = new QuotesDB(
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	process.env.DB_URI
);

module.exports = quotesDB;
