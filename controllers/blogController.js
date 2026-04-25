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
    let body = req.body;
    if (typeof body.content === "string") body.content = JSON.parse(body.content);
    if (typeof body.tags === "string") body.tags = JSON.parse(body.tags);
    if (body.slug) body.slug = slugify(body.slug);

    if (req.files?.coverImage?.[0]) {
      body.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    const uploadedImages = req.files?.contentImages || [];
    const imgIndexRef = { i: 0 };
    body.content = body.content.map((block) => mapBlock(block, uploadedImages, imgIndexRef));

    if (
      !body.title || !body.slug || !body.excerpt || !body.date ||
      !body.category || !body.coverImage || !body.content || body.content.length === 0
    ) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    const blog = await Blog.create(body);
    res.status(201).json({ success: true, message: "Blog created successfully", data: blog });
  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);
    res.status(500).json({ success: false, message: err.message || "Server Error" });
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
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET SINGLE BLOG BY ID
========================= */
exports.getOne = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: blog });
  } catch (err) {
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

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE BLOG
========================= */
exports.update = async (req, res) => {
  try {
    let body = req.body;
    if (typeof body.content === "string") body.content = JSON.parse(body.content);
    if (typeof body.tags === "string") body.tags = JSON.parse(body.tags);
    if (body.slug) body.slug = slugify(body.slug);

    if (req.files?.coverImage?.[0]) {
      body.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    const uploadedImages = req.files?.contentImages || [];
    const imgIndexRef = { i: 0 };
    body.content = body.content.map((block) => mapBlock(block, uploadedImages, imgIndexRef));

    const blog = await Blog.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
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
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};