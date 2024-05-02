import express from "express";
import {
  getCommentInfo,
  getUserInfo,
  login,
  refreshToken,
  saveCommentInfo,
  signup,
  updateUserInfo,
} from "../controllers/userController.js";

const useRouter = express.Router();

useRouter.post("/signup", signup);

useRouter.post("/login", login);

useRouter.get("/get-comment-info/:imgId", getCommentInfo);

useRouter.post("/save-comment-info", saveCommentInfo);

useRouter.post("/refresh-token", refreshToken);

useRouter.put("/update-user-info", updateUserInfo);

useRouter.get("/get-user-info", getUserInfo);

export default useRouter;
