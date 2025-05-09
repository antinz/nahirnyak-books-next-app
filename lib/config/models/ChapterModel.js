import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
      required: true,
    },
    blogTitle: { type: String, required: true },
    title: {
      type: String,
      required: true,
    },
    footnotes: {
      type: Array,
      default: [],
    },
    content: {
      type: String,
      required: true,
    },
    chapterNumber: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const ChapterModel =
  mongoose.models.chapter || mongoose.model("chapter", ChapterSchema);
export default ChapterModel;
