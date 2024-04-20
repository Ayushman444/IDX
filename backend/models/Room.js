const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
        },
        admin:{
            type: String,
            require: true,
            unique: true,
        },
        joinedUsers:[{
            type: mongoose.Schema.Types.ObjectId,
			ref: "User",
        }],
        accessUsers:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        
    },
    { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;