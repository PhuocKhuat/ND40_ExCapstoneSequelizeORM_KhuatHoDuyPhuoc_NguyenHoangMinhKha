import express from 'express';
import { signup } from '../controllers/userController.js';

const useRouter = express.Router();

useRouter.post("/signup", signup);

export default useRouter;