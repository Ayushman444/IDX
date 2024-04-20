const express = require("express");
const dbconnect = require('./config/database');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/Auth');
const roomRoutes = require('./routes/Room');
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
app.use("api/room", roomRoutes);


socketLogic(app).listen(PORT, () => {
	dbconnect();
	console.log(`Server Running on port ${PORT}`);
});

