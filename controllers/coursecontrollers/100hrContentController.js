const Content = require("../../models/courses/100hrContentModel");

/* =========================
   HELPER: PARSE BODY
========================= */
const parseBody = (req) => {
  let body = req.body;
  if (typeof body.data === "string") {
    try { body = { ...JSON.parse(body.data) }; } catch { /* keep as-is */ }
  }
  return body;
};

/* Helper: map uploaded file → /uploads/filename path */
const filePath = (req, fieldName) =>
  req.files?.[fieldName]?.[0]?.filename
    ? `/uploads/${req.files[fieldName][0].filename}`
    : null;

/* =========================
   APPLY ALL MEDIA FIELDS
   Images + all 4 video sections
========================= */
const applyMedia = (body, req) => {

  /* ── IMAGE FIELDS ── */
  const imageFields = [
    "bannerImage",
    "transformImage",
    "scheduleImage",
    "soulShineImage",
    "suitableImage1",
    "suitableImage2",
    "suitableImage3",
    "syllabusImage1",
    "syllabusImage2",
    "enrollImage",
    "certImage",
    "registrationImage",
  ];

  imageFields.forEach((f) => {
    const fp = filePath(req, f);
    if (fp) {
      body[f] = fp;
    } else if (req.body[`${f}Url`]) {
      // URL pasted in form
      body[f] = req.body[`${f}Url`];
    }
    // else: keep whatever came in JSON payload (body[f])
  });

  /* ══════════════════════════════════════════════
     VIDEO FIELDS
     Each section sends its own url & file fields.
     Priority: uploaded file > URL string > keep existing
  ══════════════════════════════════════════════ */

  // ── 1. MAIN PAGE VIDEO ──
  const mainFilePath = filePath(req, "videoFile");
  if (mainFilePath) {
    body.videoFile = mainFilePath;
    body.videoUrl  = "";
  } else {
    // videoUrl comes either from multipart field or JSON body
    const url = req.body.videoUrl ?? body.videoUrl ?? "";
    body.videoUrl  = url;
    body.videoFile = "";
  }

  // ── 2. SYLLABUS VIDEO ──
  // Form sends: syllabusVideoFile (mp4 upload) or syllabusVideoUrl (link)
  const sylFilePath = filePath(req, "syllabusVideoFile");
  if (sylFilePath) {
    body.syllabusVideo = sylFilePath;
  } else {
    const url = req.body.syllabusVideoUrl ?? body.syllabusVideoUrl ?? body.syllabusVideo ?? "";
    body.syllabusVideo = url;
  }

  // ── 3. SCHEDULE VIDEO ──
  const schedFilePath = filePath(req, "scheduleVideoFile");
  if (schedFilePath) {
    body.scheduleVideo = schedFilePath;
  } else {
    const url = req.body.scheduleVideoUrl ?? body.scheduleVideoUrl ?? body.scheduleVideo ?? "";
    body.scheduleVideo = url;
  }

  // ── 4. COMPREHENSIVE VIDEO ──
  const compFilePath = filePath(req, "comprehensiveVideoFile");
  if (compFilePath) {
    body.comprehensiveVideo = compFilePath;
  } else {
    const url = req.body.comprehensiveVideoUrl ?? body.comprehensiveVideoUrl ?? body.comprehensiveVideo ?? "";
    body.comprehensiveVideo = url;
  }

  // Clean up the split URL/File keys from form — we only store the merged fields
  delete body.syllabusVideoUrl;
  delete body.syllabusVideoFile;
  delete body.scheduleVideoUrl;
  delete body.scheduleVideoFile;
  delete body.comprehensiveVideoUrl;
  delete body.comprehensiveVideoFile;

  return body;
};

/* =========================
   CREATE (ONLY ONE ALLOWED)
========================= */
exports.create = async (req, res) => {
  try {
    let body = parseBody(req);

    const existing = await Content.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Content already exists. Please update instead.",
      });
    }

    body = applyMedia(body, req);
    const content = await Content.create(body);

    res.status(201).json({
      success: true,
      message: "Content created successfully",
      data: content,
    });
  } catch (err) {
    console.error("100hr create error:", err);
    res.status(500).json({ success: false, message: "Create failed" });
  }
};

/* =========================
   GET (SINGLE)
========================= */
exports.get = async (req, res) => {
  try {
    const content = await Content.findOne();
    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

/* =========================
   GET BY ID
========================= */
exports.getById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch by ID failed" });
  }
};

/* =========================
   UPDATE
========================= */
exports.update = async (req, res) => {
  try {
    let body = parseBody(req);

    const content = await Content.findOne();
    if (!content)
      return res.status(404).json({ success: false, message: "Not found" });

    body = applyMedia(body, req);

    const updated = await Content.findByIdAndUpdate(content._id, body, {
      new: true,
    });

    res.json({
      success: true,
      message: "Content updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("100hr update error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

/* =========================
   DELETE
========================= */
exports.delete = async (req, res) => {
  try {
    const content = await Content.findOne();
    if (!content)
      return res.status(404).json({ success: false, message: "Not found" });
    await Content.findByIdAndDelete(content._id);
    res.json({ success: true, message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

/* =========================
   RESET
========================= */
exports.reset = async (req, res) => {
  try {
    await Content.deleteMany();
    res.json({ success: true, message: "All content reset" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Reset failed" });
  }
};