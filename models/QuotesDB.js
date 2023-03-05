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
			console.error(`${new Date().toLocaleString()} - ${error}`);
		}
	}

	async disconnect() {
		console.log(`${new Date().toLocaleString()} - Disconnecting from MongoDB...`);
		try {
			await this.client.close();
			console.log(`${new Date().toLocaleString()} - Disconnected from MongoDB\n\n`);
		} catch (error) {
			console.log(`${new Date().toLocaleString()} - ${error}\n`);
		}
	}

	async getQuotes() {
		try {
			const db = this.client.db(process.env.DB_NAME);
			const collection = db.collection("quotes");
			const quotes = await collection.find().toArray();
			return quotes.map((quote) => ({ author: quote.author, quote: quote.content }));
		} catch (error) {
			console.log(`${new Date().toLocaleString()} - ${error}`);
		}
	}

	async getRandomQuote() {
		try {
			const db = this.client.db(process.env.DB_NAME);
			const collection = db.collection("quotes");
			const randomQuote = await collection
				.aggregate([{ $sample: { size: 1 } }])
				.toArray();

			return { author: randomQuote[0].author, quote: randomQuote[0].content };
		} catch (error) {
			console.log(`${new Date().toLocaleString()} - ${error}`);
		}
	}
}

const quotesDB = new QuotesDB(
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	process.env.DB_URI
);

module.exports = quotesDB;
