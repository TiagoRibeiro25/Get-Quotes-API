const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

class QuotesDB {
	constructor(username, password, uri) {
		this.uri = `mongodb+srv://${username}:${password}@${uri}/?retryWrites=true&w=majority`;
		this.client = new MongoClient(this.uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}

	async connect() {
		console.log(`${new Date().toLocaleString()} - Connecting to MongoDB...`);
		try {
			await this.client.connect();
			console.log(`${new Date().toLocaleString()} - Connected to MongoDB`);
		} catch (error) {
			throw new Error("Error connecting to MongoDB");
		}
	}

	async disconnect() {
		console.log(`${new Date().toLocaleString()} - Disconnecting from MongoDB...`);
		try {
			await this.client.close();
			console.log(`${new Date().toLocaleString()} - Disconnected from MongoDB\n\n`);
		} catch (error) {
			throw new Error("Error disconnecting from MongoDB");
		}
	}

	async getQuotes() {
		try {
			const db = this.client.db(process.env.DB_NAME);
			const collection = db.collection("quotes");
			const quotes = await collection.find().toArray();
			return quotes;
		} catch (error) {
			throw new Error("Error fetching quotes");
		}
	}

	async getRandomQuote() {
		try {
			const db = this.client.db(process.env.DB_NAME);
			const collection = db.collection("quotes");
			const randomQuote = await collection
				.aggregate([{ $sample: { size: 1 } }])
				.toArray();

			return randomQuote[0];
		} catch (error) {
			throw new Error("Error fetching random quote");
		}
	}

	async addQuote(quote) {
		try {
			const db = this.client.db(process.env.DB_NAME);
			const collection = db.collection("quotes");
			await collection.insertOne(quote);
		} catch (error) {
			throw new Error("Error adding quote");
		}
	}

	async deleteQuote(id) {
		try {
			const db = this.client.db(process.env.DB_NAME);
			const collection = db.collection("quotes");
			const result = await collection.deleteOne({ _id: new mongodb.ObjectId(id) });
			return !result.deletedCount == 0;
		} catch (error) {
			throw new Error("Error deleting quote");
		}
	}
}

const quotesDB = new QuotesDB(
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	process.env.DB_URI
);

module.exports = quotesDB;
