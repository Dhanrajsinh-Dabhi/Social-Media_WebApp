const mongoose = require('mongoose');
const User = require('./userModel');
const { Schema, Types } = mongoose;
const ObjectId = Types.ObjectId;



const postSchema = new mongoose.Schema({
    caption: {
        type: {},
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    image: {
        url: String,
        public_id: String
    },
    like: [{ type: ObjectId, ref: "User" }],
    comment: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: {
                type: ObjectId,
                ref: "User"
            }
        }
    ]
}, { timestamps: true });

const Post= mongoose.model("Post", postSchema);
module.exports=Post;
