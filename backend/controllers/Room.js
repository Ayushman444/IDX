const bcrypt = require("bcrypt");
// const User = require("../models/User.js");
const Room = require("../models/Room")

const dotenv = require('dotenv');

dotenv.config();


const createRoom = async (req, res) => {
    const { roomId, adminUserName } = req.body;

    try {
        // Check if the room with the given ID already exists
        const existingRoom = await Room.findOne({ roomId });
        if (existingRoom) {
            return res.status(400).json({ error: "Room ID already exists." });
        }

        // Create a new room object
        const newRoom = new Room({
            roomId,
            adminUserName,
            joinedUsers: [adminUserName], // Initially, only admin user is joined
            accessUsers: [adminUserName] // Initially, only admin user has access
        });

        // Save the new room to the database
        await newRoom.save();

        // Send success response with new room details
        res.status(201).json({ success: "Room created successfully.", room: newRoom });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

const join = async (req, res) => {
    const { roomId, username } = req.body;

    try {
        // Find the room with the given roomId
        const room = await Room.findOne({ roomId });

        // If the room doesn't exist, return an error
        if (!room) {
            return res.status(404).json({ error: "Room not found." });
        }

        // Add the new user to the joinedUsers array
        room.joinedUsers.push(username);

        // Save the updated room to the database
        await room.save();

        // Send success response with updated room details
        res.status(200).json({ success: "User joined room successfully.", room });
    } catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

const giveAccess = async (req, res) => {
    const { roomId, username } = req.body;

    try {
        // Find the room with the given roomId
        const room = await Room.findOne({ roomId });

        // If the room doesn't exist, return an error
        if (!room) {
            return res.status(404).json({ error: "Room not found." });
        }

        // Check if the user is already in the accessUsers array
        if (room.accessUsers.includes(username)) {
            return res.status(400).json({ error: "User already has access to the room." });
        }

        // Add the user to the accessUsers array
        room.accessUsers.push(username);

        // Save the updated room to the database
        await room.save();

        // Send success response with updated room details
        res.status(200).json({ success: "User granted access to the room successfully.", room });
    } catch (error) {
        console.error("Error granting access to the room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

const takeAccess = async (req, res) => {
    const { roomId, username } = req.body;

    try {
        // Find the room with the given roomId
        const room = await Room.findOne({ roomId });

        // If the room doesn't exist, return an error
        if (!room) {
            return res.status(404).json({ error: "Room not found." });
        }

        // Remove the user from the accessUsers array
        room.accessUsers = room.accessUsers.filter(user => user !== username);

        // Save the updated room to the database
        await room.save();

        // Send success response with updated room details
        res.status(200).json({ success: "Access revoked successfully.", room });
    } catch (error) {
        console.error("Error revoking access to the room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

const leaveRoom = async (req, res) => {
    const { roomId, username } = req.body;

    try {
        // Find the room with the given roomId
        const room = await Room.findOne({ roomId });

        // If the room doesn't exist, return an error
        if (!room) {
            return res.status(404).json({ error: "Room not found." });
        }

        // Remove the user from the joinedUsers array
        room.joinedUsers = room.joinedUsers.filter(user => user !== username);

        // Remove the user from the accessUsers array
        room.accessUsers = room.accessUsers.filter(user => user !== username);

        // Save the updated room to the database
        await room.save();

        // Send success response with updated room details
        res.status(200).json({ success: "User left the room successfully.", room });
    } catch (error) {
        console.error("Error leaving the room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};



module.exports = { join, giveAccess, takeAccess, leaveRoom , createRoom};