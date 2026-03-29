const HathaYoga = require("../../models/courses/hathaYogaModel");

/* =========================
   HELPER
========================= */
const parseJSON = (val) => {
  try {
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
};

const getFilePath = (file) => {
  return file ? "/uploads/" + file.filename : "";
};

/* =========================
   CREATE / UPDATE (SINGLE)
========================= */
exports.saveHathaYoga = async (req, res) => {
  try {
    let existing = await HathaYoga.findOne();

    // parse arrays
    const data = {
      ...req.body,
      introParagraphs: parseJSON(req.body.introParagraphs),
      whatParagraphs: parseJSON(req.body.whatParagraphs),
      ashramParagraphs: parseJSON(req.body.ashramParagraphs),
      programmeParagraphs: parseJSON(req.body.programmeParagraphs),
      accreditations: parseJSON(req.body.accreditations),
      benefitsList: parseJSON(req.body.benefitsList),
      courseDetailsList: parseJSON(req.body.courseDetailsList),
      certCards: parseJSON(req.body.certCards),
    };

    /* =========================
       FILES
    ========================= */
    if (req.files?.heroImage) {
      data.heroImage = getFilePath(req.files.heroImage[0]);
    }

    if (req.files?.introSideImage) {
      data.introSideImage = getFilePath(req.files.introSideImage[0]);
    }

    if (req.files?.benefitsSideImage) {
      data.benefitsSideImage = getFilePath(req.files.benefitsSideImage[0]);
    }

    if (req.files?.ashramImage) {
      data.ashramImage = getFilePath(req.files.ashramImage[0]);
    }

    /* =========================
       CERT CARD IMAGES
    ========================= */
    if (data.certCards.length) {
      data.certCards = data.certCards.map((card, i) => {
        const fileKey = `certCardImage_${i}`;
        if (req.files[fileKey]) {
          return {
            ...card,
            image: getFilePath(req.files[fileKey][0]),
          };
        }
        return card;
      });
    }

    /* =========================
       SINGLE SYSTEM
    ========================= */
    let result;
    if (existing) {
      result = await HathaYoga.findByIdAndUpdate(existing._id, data, {
        new: true,
      });
    } else {
      result = await HathaYoga.create(data);
    }

    res.json({
      success: true,
      message: existing ? "Updated successfully" : "Created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getHathaYoga = async (req, res) => {
  try {
    const data = await HathaYoga.findOne();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.deleteHathaYoga = async (req, res) => {
  try {
    await HathaYoga.deleteMany();

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};