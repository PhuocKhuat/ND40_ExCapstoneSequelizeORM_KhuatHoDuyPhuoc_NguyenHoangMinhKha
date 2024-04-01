import express from 'express';
import { getCommentInfo, getImgInfoAndCreator, getSavedImgInfo } from '../controllers/detailController.js';

const detailRouter = express.Router();

detailRouter.get("/get-img-info-and-creator/:imgId", getImgInfoAndCreator);

detailRouter.get("/get-comment-info/:imgId", getCommentInfo);

detailRouter.get("/get-save-image/:imgId", getSavedImgInfo);

export default detailRouter;