const express = require("express");
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/Auth');
const dbconnect = require('./config/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketLogic = require("./Socket/Socket.js"); // Import socketLogic instead of { app, server }

dotenv.config();

const PORT = process.env.PORT || 4000;

const main = async () => {
    const app = express();

    // Middleware
    app.use(cors({ origin: 'http://localhost:3000' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Routes
    app.use("/api/auth", authRoutes);

    // Serving static files
    app.use(express.static(path.join(__dirname, "frontend", "build")));

    // Serving frontend for all other routes
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
    });

    // Start server
    socketLogic(app).listen(PORT, async () => { // Use socketLogic and call listen method
        await dbconnect();
        console.log(`Server running on port ${PORT}`);
    });
};

main().catch((err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});

