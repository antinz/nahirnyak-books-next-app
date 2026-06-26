import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
      required: true,
    },
    name: {
      type: String,
      default: "Аноним",
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

const CommentModel =
  mongoose.models.comment || mongoose.model("comment", CommentSchema);

export default CommentModel;
