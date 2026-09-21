const Blog = require("../models/blogModel");

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ─── Map a single content block (shared by create & update) ─── */
function mapBlock(block, uploadedImages, imgIndexRef) {
  switch (block.type) {
    case "images":
      return {
        type: "images",
        imageLayout: block.imageLayout || "single",
        images: (block.images || []).map((img) => {
          if (img.isFile) {
            const file = uploadedImages[imgIndexRef.i++];
            if (!file) throw new Error("Expected uploaded file but none found");
            return {
              src: `/uploads/${file.filename}`,
              caption: img.caption || "",
              altText: img.altText || "",
            };
          }
          if (!img.src) throw new Error("Image src missing");
          if (img.src.startsWith("blob:")) throw new Error("Blob URL not allowed.");
          return { src: img.src, caption: img.caption || "", altText: img.altText || "" };
        }),
      };

    case "list":
      return {
        type: "list",
        listType: block.listType || "unordered",
        listItems: block.listItems || [],
      };

    case "quote":
      return {
        type: "quote",
        text: block.text || "",
        quoteAuthor: block.quoteAuthor || "",
      };

    case "code":
      return {
        type: "code",
        text: block.text || "",
        codeLanguage: block.codeLanguage || "plaintext",
      };

    case "video":
      return {
        type: "video",
        videoUrl: block.videoUrl || "",
        videoCaption: block.videoCaption || "",
      };

    case "table":
      return {
        type: "table",
        tableHeaders: block.tableHeaders || [],
        tableRows: block.tableRows || [],
      };

    case "callout":
      return {
        type: "callout",
        text: block.text || "",
        calloutVariant: block.calloutVariant || "info",
        calloutTitle: block.calloutTitle || "",
      };

    case "spacer":
      return {
        type: "spacer",
        spacerHeight: block.spacerHeight ?? 40,
      };

    case "divider":
      return { type: "divider" };

    case "html":
    case "heading":
    case "subheading":
    case "paragraph":
    default:
      return { type: block.type, text: block.text || "" };
  }
}

/* =========================
   CREATE BLOG
========================= */
exports.create = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    // Clone the body to avoid prototype issues
    let body = { ...req.body };

    // Parse content if it's a string
    if (body.content && typeof body.content === "string") {
      try {
        body.content = JSON.parse(body.content);
      } catch (e) {
        console.error("Failed to parse content:", e);
        return res.status(400).json({ 
          success: false, 
          message: "Invalid content format. Content must be valid JSON." 
        });
      }
    }

    // Parse tags if it's a string
    if (body.tags && typeof body.tags === "string") {
      try {
        body.tags = JSON.parse(body.tags);
      } catch (e) {
        console.error("Failed to parse tags:", e);
        body.tags = [];
      }
    }

    // Check if content exists and is an array
    if (!body.content) {
      return res.status(400).json({
        success: false,
        message: "Content is required"
      });
    }

    // Ensure content is an array
    if (!Array.isArray(body.content)) {
      return res.status(400).json({
        success: false,
        message: "Content must be an array"
      });
    }

    // Ensure tags is an array
    if (!body.tags || !Array.isArray(body.tags)) {
      body.tags = [];
    }

    // Slugify the slug
    if (body.slug) {
      body.slug = slugify(body.slug);
    }

    // Handle cover image upload
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      body.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    // Process content images
    const uploadedImages = req.files?.contentImages || [];
    const imgIndexRef = { i: 0 };
    
    try {
      body.content = body.content.map((block) => mapBlock(block, uploadedImages, imgIndexRef));
    } catch (e) {
      console.error("Error mapping content blocks:", e);
      return res.status(400).json({
        success: false,
        message: e.message || "Error processing content blocks"
      });
    }

    // Validate required fields
    if (!body.title || body.title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    if (!body.slug || body.slug.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Slug is required"
      });
    }

    if (!body.excerpt || body.excerpt.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Excerpt is required"
      });
    }

    if (!body.date || body.date.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    if (!body.category || body.category.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Category is required"
      });
    }

    if (!body.coverImage || body.coverImage.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Cover image is required"
      });
    }

    if (!body.content || body.content.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Content cannot be empty. Add at least one content block."
      });
    }

    // Set SEO fields with defaults
    body.metaTitle = body.metaTitle || body.title;
    body.metaDescription = body.metaDescription || body.excerpt;
    body.canonicalUrl = body.canonicalUrl || "";
    body.ogTitle = body.ogTitle || body.title;
    body.ogDescription = body.ogDescription || body.excerpt;
    body.ogImage = body.ogImage || body.coverImage;

    // Set Schema Markup fields with defaults
    body.schemaType = body.schemaType || "BlogPosting";
    body.schemaCustomJson = body.schemaCustomJson || "";

    // Set status
    body.status = body.status || "Draft";

    // Create the blog
    const blog = await Blog.create(body);
    
    res.status(201).json({ 
      success: true, 
      message: "Blog created successfully", 
      data: blog 
    });
  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Server Error" 
    });
  }
};

/* =========================
   GET ALL BLOGS
========================= */
exports.getAll = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (err) {
    console.error("GET ALL BLOGS ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// controllers/blog.controller.js (ya jo bhi tumhari file hai)

exports.getLatestPublished = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;

    const blogs = await Blog.find({ status: "Published" })
      .sort({ date: -1 })
      .limit(limit)
      .select("title excerpt coverImage category date author slug")
      .lean(); // lean() se plain JS object milta hai, thoda fast hota hai

    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (err) {
    console.error("Failed to fetch latest published blogs:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};
/* =========================
   GET SINGLE BLOG BY ID
========================= */
exports.getOne = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    console.error("GET BLOG ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET BY SLUG
========================= */
exports.getBySlug = async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.slug);
    const clean = slugify(raw);

    let blog = await Blog.findOne({ slug: raw, status: "Published" });
    if (!blog) blog = await Blog.findOne({ slug: clean, status: "Published" });
    if (!blog) {
      const all = await Blog.find({ status: "Published" });
      blog = all.find((b) => slugify(b.slug) === clean) ?? null;
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    console.error("GET BY SLUG ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE BLOG
========================= */
exports.update = async (req, res) => {
  try {
    let body = { ...req.body };

    // Parse content if it's a string
    if (body.content && typeof body.content === "string") {
      try {
        body.content = JSON.parse(body.content);
      } catch (e) {
        console.error("Failed to parse content:", e);
        return res.status(400).json({ 
          success: false, 
          message: "Invalid content format. Content must be valid JSON." 
        });
      }
    }

    // Parse tags if it's a string
    if (body.tags && typeof body.tags === "string") {
      try {
        body.tags = JSON.parse(body.tags);
      } catch (e) {
        console.error("Failed to parse tags:", e);
        body.tags = [];
      }
    }

    // Ensure content exists and is an array
    if (!body.content) {
      return res.status(400).json({
        success: false,
        message: "Content is required"
      });
    }

    if (!Array.isArray(body.content)) {
      return res.status(400).json({
        success: false,
        message: "Content must be an array"
      });
    }

    // Ensure tags is an array
    if (!body.tags || !Array.isArray(body.tags)) {
      body.tags = [];
    }

    // Slugify the slug
    if (body.slug) {
      body.slug = slugify(body.slug);
    }

    // Handle cover image upload
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      body.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    // Process content images
    const uploadedImages = req.files?.contentImages || [];
    const imgIndexRef = { i: 0 };
    
    try {
      body.content = body.content.map((block) => mapBlock(block, uploadedImages, imgIndexRef));
    } catch (e) {
      console.error("Error mapping content blocks:", e);
      return res.status(400).json({
        success: false,
        message: e.message || "Error processing content blocks"
      });
    }

    // Set SEO fields with defaults if not provided
    body.metaTitle = body.metaTitle || body.title;
    body.metaDescription = body.metaDescription || body.excerpt;
    body.ogTitle = body.ogTitle || body.title;
    body.ogDescription = body.ogDescription || body.excerpt;
    body.ogImage = body.ogImage || body.coverImage;

    // Set Schema Markup fields with defaults if not provided
    body.schemaType = body.schemaType || "BlogPosting";
    body.schemaCustomJson = body.schemaCustomJson || "";

    // Update the blog
    const blog = await Blog.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    
    res.json({ success: true, message: "Blog updated successfully", data: blog });
  } catch (err) {
    console.error("UPDATE BLOG ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   DELETE BLOG
========================= */
exports.remove = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    console.error("DELETE BLOG ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};