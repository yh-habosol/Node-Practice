import express from "express";
import { comment, deleteComment, view } from "../controllers/videoController";

const apiRouter = express.Router();


apiRouter.post("/videos/:id", view);
apiRouter.post("/videos/:id/comment", comment);
apiRouter.post("/videos/:id/comment/:id_comment/delete", deleteComment);

export default apiRouter;