import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    meta: {
        views: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        }
    },
    fileUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    hashtags: [
        {
            type: String,
            trim: true,
        }
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]

    //comments, 
});

videoSchema.static("formatHashtags", function (hashtags){
    return hashtags.split(",").map((word) => word.startsWith("#") ? word : `#${word}`);
});

const Video = mongoose.model("Video", videoSchema);

export default Video;