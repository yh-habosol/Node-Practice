import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

const search = async (keyword, res) => {
    let videos = [];
    if(keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i"),
            }
        })
    }

    return res.render("home", {pageTitle: "search", videos, isSearch: true});

}

export const home = async (req, res) => {
    const {keyword} = req.query;
    let isSearch = false;
    let videos = [];

    if(keyword){
        return search(keyword, res);
    }
    else{
        videos = await Video.find({}).sort({createdAt:"desc"});
    }

    
    return res.render("home", {pageTitle: "home", videos, isSearch});
}


export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "upload"});
}

export const postUpload = async (req, res) => {
    const {title, description, hashtags} = req.body;
    const {session: {user: _id}} = req;
    const fileUrl = req.file.location;
   

    const newVideo = await Video.create({
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
        owner: _id,
        fileUrl
    });

    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");
}

export const watchVideo = async (req, res) => {
    const {keyword} = req.query;
    
    if(keyword){
        return search(keyword, res);
    }


    const {id} = req.params;
    const video = await Video.findById(id).populate("comments").populate("owner");
    

    return res.render("watchVideo", {pageTitle: video.title, video});
}


export const getEdit = async (req, res) => {
    const {id} = req.params;

    const video = await Video.findById(id);

    return res.render("editVideo", {pageTitle: `Edit ${video.title}`, video});
}

export const postEdit = async (req, res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;


    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });

    return res.redirect(`/videos/${id}`);

}

export const deleteVideo = async (req, res) => {
    const videoId = req.params.id;
    const {session:{user:{_id}}} = req;
    await Video.findByIdAndDelete(videoId);

    const user = await User.findById(_id);

    let idx = -1;

    for(let i = 0; i<user.videos.length; i++){
        if(user.videos[i].toString() === videoId){
            idx = i;
            break;
        }
    }

    if(idx !== -1){
        user.videos.splice(idx, 1);
    }
    user.save();
    

    return res.redirect("/");
}



export const view = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    video.meta.views += 1;
    video.save();

    return res.sendStatus(201);
}

export const comment = async (req, res) => {
    const {text} = req.body;
    const videoId = req.params.id;
    const userId = req.session.user._id;

    
    const video = await Video.findById(videoId);
    
    const comment = await Comment.create({
        text,
        owner: userId,
        video,
    });

    video.comments.push(comment._id);
    video.save();

    return res.status(201).json({newCommentId: comment._id});

}

export const deleteComment = async (req, res) => {
    const videoId = req.params.id;
    const commentId = req.params.id_comment;

    const video = await Video.findById(videoId);
    
    let idx = -1;
    for(let i = 0; i<video.comments.length; i++){
        if(video.comments[i].toString() === commentId){
            idx = i;
            break;
        }
    }
    if(idx !== -1){
        video.comments.splice(idx, 1);
    }
    video.save();
    await Comment.findByIdAndDelete(commentId);

    return res.sendStatus(201);
}