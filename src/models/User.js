import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    socialOnly: {
        type: Boolean,
        default: false,
    },
    avatarUrl: {
        type:String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
});

userSchema.pre("save", async function() {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 5);
    }
})

const User = mongoose.model("User", userSchema);

export default User;