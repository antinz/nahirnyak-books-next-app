import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    pdfUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    authorImg: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    imagePublicId: {
      type: String,
    },
    footnotes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, minimize: false },
);
BlogSchema.index({ category: 1 });
BlogSchema.index({ date: -1 });

const BlogModel = mongoose.models.blog || mongoose.model("blog", BlogSchema);
export default BlogModel;
