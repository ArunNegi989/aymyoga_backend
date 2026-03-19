const YogaCoursesPage = require("../../models/homepage/YogaCoursesPage");

/* =========================
   HELPER — Build public URL
========================= */
const toPublicUrl = (filename) => `/uploads/${filename}`;

/* =========================
   HELPER — Resolve image
========================= */
const resolveImg = (value, fieldName, files) => {
  if (files && files[fieldName] && files[fieldName][0]) {
    return toPublicUrl(files[fieldName][0].filename);
  }
  if (typeof value === "string" && value.startsWith("__upload_")) return "";
  return value || "";
};

/* =========================
   HELPER — Parse body
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

    courses: Array.isArray(courses)
      ? courses.map((c, i) => ({
          ...(c._id ? { _id: c._id } : {}),
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
        }))
      : [],

    who: who ? {
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
    } : undefined,

    teachersHeader: teachersHeader ? {
      eyebrow:             teachersHeader.eyebrow,
      sectionTitle:        teachersHeader.sectionTitle,
      introPara1:          teachersHeader.introPara1,
      introPara1Highlight: teachersHeader.introPara1Highlight,
      introPara2:          teachersHeader.introPara2,
      introPara2Highlight: teachersHeader.introPara2Highlight,
      ctaBtnText:          teachersHeader.ctaBtnText,
      ctaBtnLink:          teachersHeader.ctaBtnLink,
    } : undefined,

    founder: founder ? {
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
    } : undefined,

    teachers: Array.isArray(teachers)
      ? teachers.map((t, i) => ({
          ...(t._id ? { _id: t._id } : {}),
          name:    t.name,
          surname: t.surname,
          imgUrl:  resolveImg(t.imgUrl, `teacherImg_${i}`, files),
        }))
      : [],
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

    const payload = parseBody(req);
    const files   = req.files || {};
    const docData = buildDocument(payload, files);

    const page = await YogaCoursesPage.create(docData);

    res.status(201).json({
      success: true,
      message: "Created successfully ✅",
      data: page,
    });
  } catch (err) {
    console.error("YogaCoursesPage create error:", err.message);
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

    const payload = parseBody(req);
    const files   = req.files || {};
    const docData = buildDocument(payload, files);

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
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${details}`,
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   PATCH — TAB-WISE UPDATE
   ─────────────────────────────────────────────────────
   ROOT CAUSE FIX:
   Frontend "courses" tab sends:  { sectionHeader:{...}, courses:[...] }
   Old code did:  courses: section === "courses" ? payload : page.courses
   → payload is the whole object, NOT an array → courses.map is not a function

   Fix: extract the sub-array from payload when section === "courses"
        and also save sectionHeader at the same time (since the tab sends both).
   ─────────────────────────────────────────────────────
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

    /* ── "courses" tab sends BOTH sectionHeader + courses array ── */
    const incomingCourses =
      section === "courses"
        ? Array.isArray(payload.courses) ? payload.courses : []
        : null;

    const incomingSectionHeader =
      section === "courses"
        ? payload.sectionHeader ?? page.sectionHeader
        : null;

    /* ── "teachers" tab sends a plain array ── */
    const incomingTeachers =
      section === "teachers"
        ? Array.isArray(payload) ? payload : []
        : null;

    /* ── Restriction: no adding beyond existing count via PATCH ── */
    if (section === "courses" && page.courses.length >= 1) {
      if (incomingCourses.length > page.courses.length) {
        return res.status(400).json({
          success: false,
          message: "Course already exists. Please edit or delete first.",
        });
      }
    }

    if (section === "teachers" && page.teachers.length >= 1) {
      if (incomingTeachers.length > page.teachers.length) {
        return res.status(400).json({
          success: false,
          message: "Teacher already exists. Please edit or delete first.",
        });
      }
    }

    /* ── Build only the requested section ── */
    const full = buildDocument(
      {
        // "courses" tab: use extracted sub-fields
        sectionHeader:
          section === "courses"
            ? incomingSectionHeader
            : page.sectionHeader,

        courses:
          section === "courses"
            ? incomingCourses
            : page.courses,

        who:
          section === "who" ? payload : page.who,

        teachersHeader:
          section === "teachersHeader" ? payload : page.teachersHeader,

        founder:
          section === "founder" ? payload : page.founder,

        teachers:
          section === "teachers"
            ? incomingTeachers
            : page.teachers,
      },
      files
    );

    /* ── Save only the changed fields ── */
    if (section === "courses") {
      // Save both courses array AND sectionHeader (sent together from UI)
      page.courses       = full.courses;
      page.sectionHeader = full.sectionHeader;
    } else {
      page[section] = full[section];
    }

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
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${details}`,
      });
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