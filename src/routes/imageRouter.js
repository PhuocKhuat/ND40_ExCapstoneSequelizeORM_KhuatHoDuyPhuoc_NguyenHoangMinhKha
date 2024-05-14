import express from "express";
import {
  addImage,
  deleteImgByImgId,
  deleteSavedImgByImgId,
  getImgInfoAndCreator,
  getImgList,
  getListImgByUserId,
  getListSaveImgByUserId,
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

imageRouter.get("/get-save-image/:imgId", middleToken, getSavedImgInfo);

imageRouter.get("/get-image-list", getImgList);

imageRouter.get("/search-img-list-by-name", searchImgListByName);

imageRouter.post("/add-image", upload.array("image"), addImage);

imageRouter.get("/get-list-saved-image", middleToken, getListSaveImgByUserId);

imageRouter.get("/get-list-created-image", middleToken, getListImgByUserId);

imageRouter.delete("/delete-image/:imgId", middleToken, deleteImgByImgId);

imageRouter.delete("/delete_saved-image", deleteSavedImgByImgId);

export default imageRouter;
