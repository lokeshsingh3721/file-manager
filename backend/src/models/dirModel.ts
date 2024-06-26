import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Directory",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  lastEdit: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Directory", schema);
