import express from "express";
import { getChangePassword, getEdit, githubFinish, githubStart, logout, postChangePassword, postEdit, watchProfile } from "../controllers/userController";
import { uploadAvatar } from "../middlewares";

const userRouter = express.Router();


userRouter.get("/logout", logout);

userRouter.get("/github/start", githubStart);
userRouter.get("/github/finish", githubFinish);


userRouter.get("/:id", watchProfile);
userRouter.route("/:id/edit").get(getEdit).post(uploadAvatar.single("avatar"), postEdit);
userRouter.route("/:id/change-password").get(getChangePassword).post(postChangePassword);



export default userRouter;