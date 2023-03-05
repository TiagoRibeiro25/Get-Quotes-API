if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/routes");

const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
app.use("/api", routes);

// not found middleware
app.use((req, res) => {
	res.status(404).json({ error: "Not found" });
});

app.listen(PORT, IP, () => console.log(`Server listening at http://${IP}:${PORT}\n`));
