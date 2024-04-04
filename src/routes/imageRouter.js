import express from 'express';
import { getCommentInfo, getImgInfoAndCreator, getImgList, getSavedImgInfo, searchImgListByName } from '../controllers/imageController.js';

const imageRouter = express.Router();

imageRouter.get("/get-img-info-and-creator/:imgId", getImgInfoAndCreator);

imageRouter.get("/get-comment-info/:imgId", getCommentInfo);

imageRouter.get("/get-save-image/:imgId", getSavedImgInfo);

imageRouter.get("/get-image-list", getImgList);

imageRouter.get("/search-img-list-by-name/:nameImg", searchImgListByName);

export default imageRouter;