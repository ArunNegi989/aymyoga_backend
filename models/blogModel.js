const mongoose = require("mongoose");

/* =========================
   IMAGE SUB-SCHEMA
========================= */
const imageSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: [true, "Image source is required"],
    },
    caption: {
      type: String,
      required: [true, "Image caption is required"],
    },
  },
  { _id: false }
);

/* =========================
   CONTENT BLOCK SCHEMA
========================= */
const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["heading", "subheading", "paragraph", "images", "divider"],
      required: true,
    },

    text: {
      type: String,
      required: function () {
        return this.type !== "images" && this.type !== "divider";
      },
    },

    images: {
      type: [imageSchema],
      required: function () {
        return this.type === "images";
      },
    },

    imageLayout: {
      type: String,
      enum: ["single", "two-col", "three-col", "wide"],
      required: function () {
        return this.type === "images";
      },
    },
  },
  { _id: false }
);

/* =========================
   BLOG SCHEMA
========================= */
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    date: { type: Date, required: true },
    author: { type: String, default: "Admin" },
    category: { type: String, required: true },
    coverImage: { type: String, required: true },
    tags: { type: [String], default: [] },
    content: { type: [contentSchema], required: true },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);