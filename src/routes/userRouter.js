import express from "express";
import {
  addUser,
  deleteUser,
  getCommentInfo,
  getUserInfo,
  getUserList,
  login,
  refreshToken,
  saveCommentInfo,
  signup,
  updateUser,
  updateUserInfo,
  uploadAvatar,
} from "../controllers/userController.js";
import upload from "../configs/upload.js";

const useRouter = express.Router();

useRouter.post("/signup", signup);

useRouter.post("/login", login);

useRouter.get("/get-comment-info/:imgId", getCommentInfo);

useRouter.post("/save-comment-info", saveCommentInfo);

useRouter.post("/refresh-token", refreshToken);

useRouter.put("/update-user-info", updateUserInfo);

useRouter.get("/get-user-info", getUserInfo);

useRouter.get("/get-user-list", getUserList);

useRouter.delete("/delete-user", deleteUser);

useRouter.post("/add-user", addUser);

useRouter.put("/update-user", updateUser);

useRouter.post("/upload-avatar", upload.single("avatar"), uploadAvatar);

export default useRouter;
