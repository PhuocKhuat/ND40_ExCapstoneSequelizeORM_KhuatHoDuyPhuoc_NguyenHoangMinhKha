import express from 'express';
import useRouter from './userRouter.js';

const rootRouter = express.Router();

rootRouter.use("/user", useRouter);

export default rootRouter;
