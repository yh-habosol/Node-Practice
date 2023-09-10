import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    video:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
    text:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

});


const Comment = mongoose.model("Comment", commentSchema);

export default Comment;