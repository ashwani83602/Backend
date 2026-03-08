import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //cloudinary url
      required: true,
      unique: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, //cloudinary url
      required: true,
    },
    views: {
      type: Number, //cloudinary url
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: [{ type: Schema.Types.ObjectId, ref: "User" }],
    password: {
      type: String,
      require: [true, "Password is required"],
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", userSchema);
