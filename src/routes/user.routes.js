import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import {
  logOutUser,
  loginUser,
  registerUser,
  refreshAccessTokes,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory,
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
router.route("change-password").post(VerifyJWT, changeCurrentPassword);
router.route("current-user").get(VerifyJWT, getCurrentUser);
router.route("update-account").patch(VerifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(VerifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(VerifyJWT, upload.single("/coverImage"), updateUserCoverImage);
  router
    .route("/c/:username")
    .get(VerifyJWT,getUserChannelProfile)

  router.route("/history").get(VerifyJWT, getUserWatchHistory);

export default router;
