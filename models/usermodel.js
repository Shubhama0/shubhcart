import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      require: true,
    },

    address: {
      type: {},
    },

    role: {
      type: Number,
      default: 0,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
// db collection name, schema name
export default mongoose.model("users", userschema);
