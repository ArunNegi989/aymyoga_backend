const YogaTTCIndia = require("../../models/courses/YogaTTCIndiaModel");

/* =========================
   HELPERS
========================= */
const parseJSON = (val) => {
  try {
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
};

const filePath = (file) => (file ? "/uploads/" + file.filename : "");

/* =========================
   CREATE (ONLY ONE RECORD)
========================= */
exports.create = async (req, res) => {
  try {
    const existing = await YogaTTCIndia.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Record already exists. Use update instead.",
      });
    }

    const body = req.body;
    const files = req.files;

    let data = {
      ...body,

      heroImage: filePath(files?.heroImage?.[0]),

      // ✅ FIXED (JSON parsing)
      introParagraphs: parseJSON(body.introParagraphs),
      whyAYMParagraphs: parseJSON(body.whyAYMParagraphs),
      rishikeshParagraphs: parseJSON(body.rishikeshParagraphs),
      goaParagraphs: parseJSON(body.goaParagraphs),

      arrivalList: parseJSON(body.arrivalList),
      feeList: parseJSON(body.feeList),

      accredBadges: parseJSON(body.accredBadges),
      courseCards: parseJSON(body.courseCards),
      quoteCards: parseJSON(body.quoteCards),
      locations: parseJSON(body.locations),
    };

    // ✅ IMAGE MAP
    data.accredBadges = data.accredBadges.map((b, i) => ({
      ...b,
      image: filePath(files?.[`accredBadgeImage_${i}`]?.[0]),
    }));

    data.courseCards = data.courseCards.map((c, i) => ({
      ...c,
      image: filePath(files?.[`courseCardImage_${i}`]?.[0]),
    }));

    data.quoteCards = data.quoteCards.map((q, i) => ({
      ...q,
      image: filePath(files?.[`quoteCardImage_${i}`]?.[0]),
    }));

    const result = await YogaTTCIndia.create(data);

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SINGLE RECORD
========================= */
exports.getSingle = async (req, res) => {
  try {
    const data = await YogaTTCIndia.findOne();
    res.json({ success: true, data: data || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE SINGLE RECORD
========================= */
exports.update = async (req, res) => {
  try {
    const existing = await YogaTTCIndia.findOne();

    if (!existing) {
      return res.status(404).json({ message: "No record found" });
    }

    const body = req.body;
    const files = req.files;

    let data = {
      ...body,

      heroImage:
        files?.heroImage?.[0]
          ? filePath(files.heroImage[0])
          : existing.heroImage,

      // ✅ FIXED (JSON parsing)
      introParagraphs: parseJSON(body.introParagraphs),
      whyAYMParagraphs: parseJSON(body.whyAYMParagraphs),
      rishikeshParagraphs: parseJSON(body.rishikeshParagraphs),
      goaParagraphs: parseJSON(body.goaParagraphs),

      arrivalList: parseJSON(body.arrivalList),
      feeList: parseJSON(body.feeList),

      accredBadges: parseJSON(body.accredBadges),
      courseCards: parseJSON(body.courseCards),
      quoteCards: parseJSON(body.quoteCards),
      locations: parseJSON(body.locations),
    };

    // ✅ IMAGE UPDATE (KEEP OLD IF NOT UPDATED)
    data.accredBadges = data.accredBadges.map((b, i) => ({
      ...b,
      image:
        files?.[`accredBadgeImage_${i}`]?.[0]
          ? filePath(files[`accredBadgeImage_${i}`][0])
          : existing.accredBadges[i]?.image,
    }));

    data.courseCards = data.courseCards.map((c, i) => ({
      ...c,
      image:
        files?.[`courseCardImage_${i}`]?.[0]
          ? filePath(files[`courseCardImage_${i}`][0])
          : existing.courseCards[i]?.image,
    }));

    data.quoteCards = data.quoteCards.map((q, i) => ({
      ...q,
      image:
        files?.[`quoteCardImage_${i}`]?.[0]
          ? filePath(files[`quoteCardImage_${i}`][0])
          : existing.quoteCards[i]?.image,
    }));

    const updated = await YogaTTCIndia.findByIdAndUpdate(
      existing._id,
      data,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE SINGLE RECORD
========================= */
exports.remove = async (req, res) => {
  try {
    const existing = await YogaTTCIndia.findOne();

    if (!existing) {
      return res.status(404).json({ message: "No record found" });
    }

    await YogaTTCIndia.findByIdAndDelete(existing._id);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};