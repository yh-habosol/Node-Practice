import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";


const s3 = new aws.S3({
    credentials:{
        accessKeyId: process.env.AWS_ID,
        secretAccessKey:process.env.AWS_SECRET,
    }
});

const s3ImageUploader = multerS3({
    s3: s3,
    bucket: 'metubeclone/images',
    acl:"public-read"
});

const s3VideoUploader = multerS3({
    s3: s3,
    bucket: 'metubeclone/videos',
    acl:"public-read"
});

export const localMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName = "YoutubeClone";
   
    next();
}



export const uploadAvatar = multer({
    dest: "uploads/avatar",
    storage: s3ImageUploader,
});

export const uploadVideo = multer({
    dest: "uploads/videos",
    storage: s3VideoUploader,
});