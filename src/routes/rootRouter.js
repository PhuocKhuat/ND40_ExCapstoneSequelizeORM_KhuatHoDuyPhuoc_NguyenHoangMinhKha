import express from 'express';
import useRouter from './userRouter.js';
import detailRouter from './detailRouter.js';

const rootRouter = express.Router();

rootRouter.use("/user", useRouter);
rootRouter.use("/detail", detailRouter);

export default rootRouter;
