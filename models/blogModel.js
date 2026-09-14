const mongoose = require("mongoose");

/* =========================
   IMAGE SUB-SCHEMA
========================= */
const imageSchema = new mongoose.Schema(
  {
    src: { type: String, required: [true, "Image source is required"] },
    caption: { type: String, default: "" },
    altText: { type: String, default: "" },
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
      enum: [
        "heading", "subheading", "paragraph", "images", "divider",
        "list", "quote", "code", "video", "table", "callout", "spacer", "html",
      ],
      required: true,
    },

    /* Text (heading, subheading, paragraph, quote, code, callout, html) */
    text: { type: String, default: "" },

    /* Images */
    images: { type: [imageSchema], default: undefined },
    imageLayout: {
      type: String,
      enum: ["single", "two-col", "three-col", "wide"],
      default: undefined,
    },

    /* List */
    listType: { type: String, enum: ["unordered", "ordered"], default: undefined },
    listItems: { type: [String], default: undefined },

    /* Quote */
    quoteAuthor: { type: String, default: "" },

    /* Code */
    codeLanguage: { type: String, default: "plaintext" },

    /* Video */
    videoUrl: { type: String, default: "" },
    videoCaption: { type: String, default: "" },

    /* Table */
    tableHeaders: { type: [String], default: undefined },
    tableRows: { type: [[String]], default: undefined },

    /* Callout */
    calloutVariant: {
      type: String,
      enum: ["info", "warning", "success", "tip", "danger"],
      default: undefined,
    },
    calloutTitle: { type: String, default: "" },

    /* Spacer */
    spacerHeight: { type: Number, default: 40 },
  },
  { _id: false }
);

/* =========================
   BLOG SCHEMA
========================= */
const blogSchema = new mongoose.Schema(
  {
    // Main content fields
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    date: { type: Date, required: true },
    author: { type: String, default: "Admin" },
    category: { type: String, required: true },
    coverImage: { type: String, required: true },
    tags: { type: [String], default: [] },
    content: { type: [contentSchema], required: true },
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },

    // SEO fields
    metaTitle: { 
      type: String, 
      default: function() { 
        return this.title || ""; 
      } 
    },
    metaDescription: { 
      type: String, 
      default: function() { 
        return this.excerpt || ""; 
      } 
    },
    canonicalUrl: { 
      type: String, 
      default: "" 
    },
    ogTitle: { 
      type: String, 
      default: function() { 
        return this.title || ""; 
      } 
    },
    ogDescription: { 
      type: String, 
      default: function() { 
        return this.excerpt || ""; 
      } 
    },
    ogImage: { 
      type: String, 
      default: function() { 
        return this.coverImage || ""; 
      } 
    },

    // Schema Markup fields
    schemaType: {
      type: String,
      enum: ["Article", "BlogPosting", "NewsArticle", "TechArticle", "None"],
      default: "BlogPosting"
    },
    schemaCustomJson: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
blogSchema.index({ slug: 1, status: 1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ date: -1 });
blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);