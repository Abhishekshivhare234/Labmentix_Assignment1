import { Router } from "express";
import { signInHandler, userSignUpHandler } from "../controllers/user.controller.js";

const userRoute = Router();

userRoute.post('/signup',userSignUpHandler);
userRoute.post('/signin',signInHandler);

export default userRoute;