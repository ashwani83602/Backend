import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {
  logOutUser,
  loginUser,
  registerUser,
  refreshAccessTokes,
} from "../controllers/user.controller.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
//SECURE ROUTES
router.route("/logout").post(VerifyJWT, logOutUser);
router.route("/refresh-accessToken").post(refreshAccessTokes);

export default router;
