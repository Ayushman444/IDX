const express = require("express");
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/Auth');
const dbconnect = require('./config/database');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use("/api/auth", authRoutes);


app.use(express.static(path.join(__dirname, "frontend", "build")));


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});


// Connecting to the database
app.listen(PORT, () => {
    dbconnect();
    console.log(`Server Running on port ${PORT}`);
});
