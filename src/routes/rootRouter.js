import express from 'express';
import useRouter from './userRouter.js';
import imageRouter from './imageRouter.js';

const rootRouter = express.Router();

rootRouter.use("/user", useRouter);
rootRouter.use("/image", imageRouter);

export default rootRouter;
