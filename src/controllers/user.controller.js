import { asyncHandler } from "../utils/asyncHandler.js"; //HOC
import { ApiError } from "../utils/AprError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Jwt from "jsonwebtoken";

import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new error(
      500,
      "Some thing went wrong whlile generating access and refresh token"
    );
  }
};

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
  // get rq.body dada
  // check user exist
  //check password
  //make accesstoken and refresh token
  //setcookies
  console.log("body", req.body);
  const { userName, email, password } = req.body;
  if (!(userName || email)) {
    throw new ApiError(400, "userName or email is required");
  }
  const user = await User.findOne({ $or: [{ userName }, { email }] });
  if (!user) throw new ApiError(400, "user does not exist");

  const validPassword = await user.isPasswordCorrect(password);
  if (!validPassword) throw new ApiError(401, "password  not correct");
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const option = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };
  console.log("accessToken", accessToken, refreshToken);
  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged in Successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "LogOut Successfull"));
});

const refreshAccessTokes = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorised Request");

    const decodedToken = Jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) throw new ApiError(401, "Invalid refresh Token");
    if (incomingRefreshToken !== decodedToken?.refreshToken)
      throw new ApiError(401, "refresh token is invalid ");

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshAccessTokesNew } =
      await generateAccessAndRefreshToken(user?._id);
    return res
      .status(200)
      .cookies("accessToken", accessToken, options)
      .cookies("refreshToken", refreshAccessTokesNew)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: refreshAccessTokesNew,
          },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "refresh token is invalid ");
  }
});

export { registerUser, loginUser, logOutUser, refreshAccessTokes };
