const express = require("express");
const dbconnect = require('./config/database');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/Auth');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketLogic = require("./Socket/Socket.js"); // Import socketLogic instead of { app, server }

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);


socketLogic(app).listen(PORT, () => {
	dbconnect();
	console.log(`Server Running on port ${PORT}`);
});

