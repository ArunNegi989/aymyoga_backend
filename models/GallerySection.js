const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const GallerySectionSchema = new mongoose.Schema(
  {
    tabLabel: {
      type: String,
      required: true,
      trim: true,
    },

    heading: {
      type: String,
      required: true,
      trim: true,
    },

    cols: {
      type: Number,
      default: 4,
    },

    images: [ImageSchema],

    order: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GallerySection", GallerySectionSchema);