import express from 'express';
import { getImgInfoAndCreator } from '../controllers/detailController.js';

const detailRouter = express.Router();

detailRouter.get("/get-img-info-and-creator/:idImg", getImgInfoAndCreator);

export default detailRouter;