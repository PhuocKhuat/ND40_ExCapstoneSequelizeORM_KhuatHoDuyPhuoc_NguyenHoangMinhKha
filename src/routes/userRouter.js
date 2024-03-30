import express from 'express';
import { login, signup } from '../controllers/userController.js';

const useRouter = express.Router();

useRouter.post("/signup", signup);

useRouter.post("/login", login);

export default useRouter;