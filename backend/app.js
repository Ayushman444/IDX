const express =  require("express");
const dotenv = require('dotenv');
const dbconnect = require('./config/database');
dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

// app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.listen(PORT, () => {
	dbconnect();
	console.log(`Server Running on port ${PORT}`);
});
