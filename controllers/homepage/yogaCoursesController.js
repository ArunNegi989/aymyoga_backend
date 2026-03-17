const YogaCoursesPage = require("../../models/homepage/YogaCoursesPage");

/* =========================
   HELPER — Build public URL
========================= */
const toPublicUrl = (filename) =>
  `/uploads/${filename}`;

/* =========================
   HELPER — Resolve image
   Checks if a __upload_xxx placeholder exists in uploaded files,
   replaces it with the actual saved file URL.
   Falls back to the original value if no file uploaded.
========================= */
const resolveImg = (value, fieldName, files) => {
  if (files && files[fieldName] && files[fieldName][0]) {
    return toPublicUrl(files[fieldName][0].filename);
  }
  // If value was a __upload_ placeholder but no file came through, return ""
  if (typeof value === "string" && value.startsWith("__upload_")) return "";
  return value || "";
};

/* =========================
   HELPER — Parse body
   Frontend sends JSON in FormData's "data" field when files are present,
   or plain JSON body when no files (application/json).
========================= */
const parseBody = (req) => {
  if (req.body && req.body.data) {
    try {
      return JSON.parse(req.body.data);
    } catch {
      return req.body;
    }
  }
  return req.body;
};

/* =========================
   HELPER — Build full document
   Merges payload fields + resolved image URLs
========================= */
const buildDocument = (payload, files) => {
  const {
    sectionHeader,
    courses = [],
    who,
    teachersHeader,
    founder,
    teachers = [],
  } = payload;

  return {
    sectionHeader,

    courses: courses.map((c, i) => ({
      hours:       c.hours,
      days:        c.days,
      name:        c.name,
      style:       c.style,
      duration:    c.duration,
      certificate: c.certificate,
      feeShared:   c.feeShared,
      feePrivate:  c.feePrivate,
      color:       c.color || "#8B5E3C",
      imgUrl:      resolveImg(c.imgUrl, `courseImg_${i}`, files),
      detailsLink: c.detailsLink || "#",
      bookLink:    c.bookLink    || "#",
    })),

    who: {
      eyebrow:      who.eyebrow,
      sectionTitle: who.sectionTitle,
      para1:        who.para1,
      para2:        who.para2,
      para3:        who.para3,
      para4:        who.para4,
      para5:        who.para5,
      chips:        who.chips || [],
      quoteText:    who.quoteText,
      quoteAttrib:  who.quoteAttrib,
    },

    teachersHeader: {
      eyebrow:             teachersHeader.eyebrow,
      sectionTitle:        teachersHeader.sectionTitle,
      introPara1:          teachersHeader.introPara1,
      introPara1Highlight: teachersHeader.introPara1Highlight,
      introPara2:          teachersHeader.introPara2,
      introPara2Highlight: teachersHeader.introPara2Highlight,
      ctaBtnText:          teachersHeader.ctaBtnText,
      ctaBtnLink:          teachersHeader.ctaBtnLink,
    },

    founder: {
      eyebrow:        founder.eyebrow,
      name:           founder.name,
      imgUrl:         resolveImg(founder.imgUrl, "founderImg", files),
      imgAlt:         founder.imgAlt,
      para1:          founder.para1,
      para2:          founder.para2,
      para3:          founder.para3,
      para3Highlight: founder.para3Highlight,
      detailsBtnText: founder.detailsBtnText,
      detailsBtnLink: founder.detailsBtnLink || "#",
      bookBtnText:    founder.bookBtnText,
      bookBtnLink:    founder.bookBtnLink    || "#",
    },

    teachers: teachers.map((t, i) => ({
      name:    t.name,
      surname: t.surname,
      imgUrl:  resolveImg(t.imgUrl, `teacherImg_${i}`, files),
    })),
  };
};

/* =========================
   CREATE
========================= */
exports.createYogaCourses = async (req, res) => {
  try {
    const exists = await YogaCoursesPage.findOne();
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already exists. Use update instead.",
      });
    }

    const payload  = parseBody(req);
    const files    = req.files || {};
    const docData  = buildDocument(payload, files);

    const page = await YogaCoursesPage.create(docData);

    res.status(201).json({
      success: true,
      message: "Created successfully ✅",
      data: page,
    });
  } catch (err) {
    console.error("YogaCoursesPage create error:", err.message);
    // Include Mongoose validation details
    if (err.name === "ValidationError") {
      const details = Object.entries(err.errors)
        .map(([k, v]) => `${k}: ${v.message}`)
        .join(", ");
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${details}`,
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET (Single)
========================= */
exports.getYogaCourses = async (req, res) => {
  try {
    const page = await YogaCoursesPage.findOne();
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE (FULL)
========================= */
exports.updateYogaCourses = async (req, res) => {
  try {
    const page = await YogaCoursesPage.findOne();
    if (!page) {
      return res.status(404).json({ success: false, message: "Data not found" });
    }

    const payload  = parseBody(req);
    const files    = req.files || {};
    const docData  = buildDocument(payload, files);

    const updated = await YogaCoursesPage.findByIdAndUpdate(
      page._id,
      docData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Updated successfully ✏️",
      data: updated,
    });
  } catch (err) {
    console.error("YogaCoursesPage update error:", err.message);
    if (err.name === "ValidationError") {
      const details = Object.entries(err.errors)
        .map(([k, v]) => `${k}: ${v.message}`)
        .join(", ");
      return res.status(400).json({ success: false, message: `Validation failed: ${details}` });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   PATCH — TAB-WISE UPDATE
========================= */
exports.updateSection = async (req, res) => {
  try {
    const { section } = req.params;

    const allowedSections = [
      "sectionHeader", "courses", "who",
      "teachersHeader", "founder", "teachers",
    ];

    if (!allowedSections.includes(section)) {
      return res.status(400).json({ success: false, message: "Invalid section" });
    }

    const page = await YogaCoursesPage.findOne();
    if (!page) {
      return res.status(404).json({ success: false, message: "Data not found" });
    }

    const payload = parseBody(req);
    const files   = req.files || {};

    // Build only the requested section
    const full = buildDocument(
      {
        sectionHeader:  section === "sectionHeader" ? payload : page.sectionHeader,
        courses:        section === "courses"        ? payload : page.courses,
        who:            section === "who"            ? payload : page.who,
        teachersHeader: section === "teachersHeader" ? payload : page.teachersHeader,
        founder:        section === "founder"        ? payload : page.founder,
        teachers:       section === "teachers"       ? payload : page.teachers,
      },
      files
    );

    page[section] = full[section];
    await page.save();

    res.json({
      success: true,
      message: `${section} updated ✅`,
      data: page,
    });
  } catch (err) {
    console.error("YogaCoursesPage section update error:", err.message);
    if (err.name === "ValidationError") {
      const details = Object.entries(err.errors)
        .map(([k, v]) => `${k}: ${v.message}`)
        .join(", ");
      return res.status(400).json({ success: false, message: `Validation failed: ${details}` });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.deleteYogaCourses = async (req, res) => {
  try {
    await YogaCoursesPage.deleteMany();
    res.json({ success: true, message: "Deleted successfully 🗑️" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};