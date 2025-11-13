import { Router } from "express";
import { signInHandler, userSignUpHandler, getProfile, logoutHandler } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const userRoute = Router();

userRoute.post('/signup', userSignUpHandler);
userRoute.post('/login', signInHandler);
// Protected routes
userRoute.post('/profile', requireAuth, getProfile);
userRoute.post('/logout', requireAuth, logoutHandler);

export default userRoute;