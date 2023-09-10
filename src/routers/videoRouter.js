import express from "express";
import { deleteVideo, getEdit, getUpload, postEdit, postUpload, watchVideo } from "../controllers/videoController";
import { uploadVideo } from "../middlewares";

const videoRouter = express.Router();


videoRouter.route("/upload").get(getUpload).post(uploadVideo.single("video"), postUpload);
videoRouter.get("/:id", watchVideo);
videoRouter.route("/:id/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id/delete", deleteVideo);




export default videoRouter;