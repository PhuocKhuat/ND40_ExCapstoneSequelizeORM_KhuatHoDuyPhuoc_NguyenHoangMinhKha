import express from "express";
import {
  addImage,
  getCommentInfo, 
  getImgInfoAndCreator,
  getImgList,
  getSavedImgInfo,
  searchImgListByName,
} from "../controllers/imageController.js";
import { middleToken } from "../configs/jwt.js";
import upload from "../configs/upload.js";

const imageRouter = express.Router();

imageRouter.get(
  "/get-img-info-and-creator/:imgId",
  middleToken,
  getImgInfoAndCreator
);

imageRouter.get("/get-comment-info/:imgId", getCommentInfo);

imageRouter.get("/get-save-image/:imgId", middleToken, getSavedImgInfo);

imageRouter.get("/get-image-list", getImgList);

imageRouter.get("/search-img-list-by-name/:nameImg", searchImgListByName);

imageRouter.post("/add-image", upload.array("image"), addImage);

export default imageRouter;
