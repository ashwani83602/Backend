import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const subscriptionSchema = new Schema(
  {
    subscriber: { type: Schema.Tpes.ObjectId, ref: "User" }, // who is sbscribe
    channel: { type: Schema.Tpes.ObjectId, ref: "User" }, // channel name treated as like user
  },

  { timestamps: true }
);

export const User = mongoose.model("Subscription", subscriptionSchema);
