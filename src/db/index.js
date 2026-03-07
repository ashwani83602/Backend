import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    console.log("MONGODB_URI", process.env.MONGODB_URI, DB_NAME);
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // console.log("connectionInstance", connectionInstance);
    console.log(
      `\n MONGO_DB_CONNECT !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("error in DB Foler in index.js", error);
    process.exit(1); //in node processes is run to exit process
  }
};
export default connectDB;
