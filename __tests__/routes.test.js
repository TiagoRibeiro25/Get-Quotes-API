require("dotenv").config();
const axios = require("axios");
const port = process.env.PORT || 3000;
const host = `http://localhost:${port}/api`;
const auth_key = process.env.AUTH_KEY;

async function deleteTestQuote() {
	// get all quotes and get the id of the last one
	const quotes = await axios.get(`${host}/quotes`);
	const quote = getTestQuote(quotes);

	await axios.delete(`${host}/quotes/${quote._id}`, {
		headers: { auth_key: auth_key },
	});
}

async function addTestQuote() {
	const body = { author: "John Doe", content: "Lorem ipsum" };
	const headers = {
		headers: { auth_key: auth_key, "Content-Type": "application/json" },
	};

	await axios.post(`${host}/quotes`, body, headers);
}

function getTestQuote(quotes) {
	return quotes.data.find((quote) => {
		return quote.author === "John Doe" && quote.content === "Lorem ipsum";
	});
}

describe("GET /status", () => {
	it("should return a 200 status code and \"OK\" status", async () => {
		const response = await axios.get(`${host}/status`);
		expect(response.status).toBe(200);
		expect(response.data.status).toBe("OK");
	});
});

describe("GET /quotes", () => {
	it("should return a 200 status code and an array of quotes", async () => {
		try {
			const response = await axios.get(`${host}/quotes`);
			expect(response.status).toBe(200);
			expect(response.data).toBeInstanceOf(Array);

			response.data.forEach((quote) => {
				expect(quote).toHaveProperty("_id");
				expect(quote).toHaveProperty("author");
				expect(quote).toHaveProperty("content");
			});
		} catch (error) {
			expect(error.response.status).toBe(500);
			expect(error.response.data).toHaveProperty("error");
		}
	});
});

describe("GET /quotes/random", () => {
	it("should return a 200 status code and a random quote", async () => {
		try {
			const response = await axios.get(`${host}/quotes/random`);
			expect(response.status).toBe(200);
			expect(response.data).toHaveProperty("_id");
			expect(response.data).toHaveProperty("author");
			expect(response.data).toHaveProperty("content");
		} catch (error) {
			expect(error.response.status).toBe(500);
			expect(error.response.data).toHaveProperty("error");
		}
	});
});

describe("GET /not-found", () => {
	it("should return a 404 status code and an error message", async () => {
		try {
			await axios.get(`${host}/not-found`);
		} catch (error) {
			expect(error.response.status).toBe(404);
			expect(error.response.data).toHaveProperty("error");
		}
	});
});

describe("POST /quotes", () => {
	// if it auth key is invalid or missing
	it("should return a 401 status code and an error message", async () => {
		try {
			await axios.post(`${host}/quotes`, { author: "John Doe", content: "Lorem ipsum" });
		} catch (error) {
			expect(error.response.status).toBe(401);
			expect(error.response.data).toHaveProperty("error");
		}
	});

	// if the author or content is missing
	it("should return a 400 status code and an error message", async () => {
		try {
			await axios.post(
				`${host}/quotes`,
				{ author: "John Doe" },
				{ headers: { auth_key: auth_key, "Content-Type": "application/json" } }
			);
		} catch (error) {
			expect(error.response.status).toBe(400);
			expect(error.response.data).toHaveProperty("error");
		}
	});

	// if the quote is added successfully
	it("should return a 200 status code and a success message", async () => {
		try {
			const body = { author: "John Doe", content: "Lorem ipsum" };
			const headers = {
				headers: { auth_key: auth_key, "Content-Type": "application/json" },
			};

			const response = await axios.post(`${host}/quotes`, body, headers);

			expect(response.status).toBe(200);
			expect(response.data).toHaveProperty("message");

			// delete the quote
			await deleteTestQuote();
		} catch (error) {
			expect(error.response.status).toBe(500);
			expect(error.response.data).toHaveProperty("error");
		}
	});
});

describe("DELETE /quotes/:id", () => {
	// if it auth key is invalid or missing
	it("should return a 401 status code and an error message", async () => {
		try {
			await axios.delete(`${host}/quotes/123456789`);
		} catch (error) {
			expect(error.response.status).toBe(401);
			expect(error.response.data).toHaveProperty("error");
		}
	});

	// if the quote doesn't exist
	it("should return a 404 status code and an error message", async () => {
		try {
			const headers = { headers: { auth_key: auth_key } };

			await axios.delete(`${host}/quotes/123`, headers);
		} catch (error) {
			expect(error.response.status).toBe(404);
			expect(error.response.data).toHaveProperty("error");
		}
	});

	// if the quote is deleted successfully
	it("should return a 204 status code and a success message", async () => {
		try {
			await addTestQuote();
			const quotes = await axios.get(`${host}/quotes`);
			const quote = getTestQuote(quotes);

			const headers = { headers: { auth_key: auth_key } };
			const response = await axios.delete(`${host}/quotes/${quote._id}`, headers);

			expect(response.status).toBe(204);
		} catch (error) {
			expect(error.response.status).toBe(500);
			expect(error.response.data).toHaveProperty("error");
		}
	});
});
