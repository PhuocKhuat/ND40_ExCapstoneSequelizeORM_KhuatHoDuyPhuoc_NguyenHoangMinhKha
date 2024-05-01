import express from "express";
import {
  getCommentInfo,
  getInfoUser,
  login,
  refreshToken,
  saveCommentInfo,
  signup,
} from "../controllers/userController.js";

const useRouter = express.Router();

useRouter.post("/signup", signup);

useRouter.post("/login", login);

useRouter.get("/get-comment-info/:imgId", getCommentInfo);

useRouter.post("/save-comment-info", saveCommentInfo);

useRouter.post("/refresh-token", refreshToken);

useRouter.get("/info-user", getInfoUser);

export default useRouter;
