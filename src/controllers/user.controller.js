import { asyncHandler } from "../utils/asyncHandler.js"; //HOC
import { ApiError } from "../utils/AprError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  //get user details
  //validation -not empty
  // check user exist
  //check images and avatar
  //upload them on cloudinary
  //create user object - create entry in db
  // remove password and refresh token
  // check user is created
  // return res
  const { fullName, email, userName, password } = req.body;
  if (
    [fullName, email, userName, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverLocalPath = req.files?.coverImage?.[0]?.path;
  let coverImageUrl;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar field is required");
  console.log("avatarLocalPath", avatarLocalPath);
  const uploadAvatarResponse = await uploadOnCloudinary(avatarLocalPath);
  if (
    req.files &&
    Array.isArray(req.files?.coverImage) &&
    req.files?.coverImage.length > 0
  ) {
    const coverImagePath = req.files?.coverImage?.[0]?.path;
    const uploadCoverResponse = await uploadOnCloudinary(coverImagePath);
    coverImageUrl = uploadCoverResponse?.url;
    console.log("uploadAvatarResponse", uploadAvatarResponse);
  }

  if (!uploadAvatarResponse) {
    throw new ApiError(400, "Avatar image is required");
  }
  const userResponse = await User.create({
    fullName,
    avatar: uploadAvatarResponse?.url,
    coverImage: coverImageUrl || "",
    userName: userName?.toLowerCase(),
    email,
    password,
  });
  console.log("userResponse", userResponse);
  console.log("req.files", req.files);
  const createdUser = await User.findById(userResponse._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "SomeThing Went Wrong While Entering The User");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));

  // res.status(200).json({
  //   message: "ok",
  // });
});

const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

export { registerUser, loginUser };
