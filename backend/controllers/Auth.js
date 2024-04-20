const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const generatetoken = (userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	return token;
}

 const signup = async (req, res) => {
	try {
		const { username, email, password} = req.body;
		console.log(req.body);

		
		const checkuser = await User.findOne({email});
		
		if(checkuser){
			return res.status(400).json({ error: "User already exists" });
		}
		
		const user = await User.findOne({ username });
		
		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}
		

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

	

		const profilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			profilePic,
		});

		// console.log(newUser);

		if (newUser) {
			const token = generatetoken(newUser._id);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				username: newUser.username,
				profilePic: newUser.profilePic,
                token : token,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

 const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		// console.log(req.body);
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		// console.log(user);
		const token = generatetoken(user._id);

		const options = {
			maxAge: 7 * 24 * 60 * 60 * 1000, // MS
			httpOnly: true
		}

		res.cookie("token", token, options).status(200).json({
			_id: user._id,
			username: user.username,
			profilePic: user.profilePic,
			token: token,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

 const logout = (req, res) => {
	try {
		res.cookie("token", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = { signup, login, logout };