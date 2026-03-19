const Blog = require("../models/blogModel");

/* =========================
   SLUGIFY HELPER
   Same logic as frontend — used to clean incoming slug params
========================= */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/* =========================
   CREATE BLOG
========================= */
exports.create = async (req, res) => {
  try {
    let body = req.body;

    if (typeof body.content === "string") body.content = JSON.parse(body.content);
    if (typeof body.tags === "string") body.tags = JSON.parse(body.tags);

    /* Auto-clean slug on save — prevents spaces ever entering DB */
    if (body.slug) body.slug = slugify(body.slug);

    if (req.files?.coverImage?.[0]) {
      body.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    const uploadedImages = req.files?.contentImages || [];
    let imgIndex = 0;

    body.content = body.content.map((block) => {
      if (block.type === "images") {
        return {
          type: "images",
          imageLayout: block.imageLayout || "single",
          images: (block.images || []).map((img) => {
            if (img.isFile) {
              const file = uploadedImages[imgIndex++];
              return { src: `/uploads/${file.filename}`, caption: img.caption || "" };
            }
            if (!img.src) throw new Error("Image src missing");
            if (img.src.startsWith("blob:")) throw new Error("Blob URL not allowed.");
            return { src: img.src, caption: img.caption || "" };
          }),
        };
      }
      return { type: block.type, text: block.text || "" };
    });

    if (!body.title || !body.slug || !body.excerpt || !body.date ||
        !body.category || !body.coverImage || !body.content || body.content.length === 0) {
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
   GET SINGLE BLOG BY SLUG  ← NEW
   Tries exact slug match first.
   If not found, tries slugified version (handles old dirty slugs in DB).
   Only returns Published blogs (public-facing route).
========================= */
exports.getBySlug = async (req, res) => {
  try {
    const raw = decodeURIComponent(req.params.slug);
    const clean = slugify(raw);

    /* 1. exact match on whatever is in DB */
    let blog = await Blog.findOne({ slug: raw, status: "Published" });

    /* 2. clean-slug match (e.g. DB has "top 5 yoga" → matches "top-5-yoga") */
    if (!blog) blog = await Blog.findOne({ slug: clean, status: "Published" });

    /* 3. scan: slugify every doc's slug and compare (handles legacy dirty data) */
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

    /* Clean slug on update too */
    if (body.slug) body.slug = slugify(body.slug);

    if (req.files?.coverImage?.[0]) {
      body.coverImage = `/uploads/${req.files.coverImage[0].filename}`;
    }

    const uploadedImages = req.files?.contentImages || [];
    let imgIndex = 0;

    body.content = body.content.map((block) => {
      if (block.type === "images") {
        return {
          type: "images",
          imageLayout: block.imageLayout,
          images: (block.images || []).map((img) => {
            if (img.isFile) {
              const file = uploadedImages[imgIndex++];
              return { src: `/uploads/${file.filename}`, caption: img.caption };
            }
            return img;
          }),
        };
      }
      return block;
    });

    const blog = await Blog.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: "Blog updated successfully", data: blog });
  } catch (err) {
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