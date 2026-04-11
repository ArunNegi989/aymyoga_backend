const Accreditation = require("../../models/homepage/Accreditation");

const MAX_AWARDS = 3;

/* =========================
   CREATE
========================= */
exports.createAccreditation = async (req, res) => {
  try {
    const count = await Accreditation.countDocuments();

    if (count >= 1) {
      return res.status(400).json({
        success: false,
        message: "Only one Accreditation section allowed",
      });
    }

    const data = req.body;

    // parse JSON
    if (typeof data.courseCerts === "string")
      data.courseCerts = JSON.parse(data.courseCerts);

    if (typeof data.awardCerts === "string")
      data.awardCerts = JSON.parse(data.awardCerts);

    /* ✅ AWARD LIMIT */
    if (data.awardCerts && data.awardCerts.length > MAX_AWARDS) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_AWARDS} awards allowed`,
      });
    }

    /* ===== MAIN IMAGE ===== */
    if (req.files?.mainImage) {
      data.mainImage = req.files.mainImage[0].path.replace(/\\/g, "/");
    }

    /* ===== COURSE CERT IMAGES ===== */
    let courseIndexes = [];
    if (data.courseCertImageIndexes) {
      courseIndexes = String(data.courseCertImageIndexes)
        .split(",")
        .map((n) => parseInt(n));
    }

    if (req.files?.courseCertImages) {
      req.files.courseCertImages.forEach((file, i) => {
        const idx = courseIndexes[i] ?? i;
        if (data.courseCerts[idx]) {
          data.courseCerts[idx].image = file.path.replace(/\\/g, "/");
        }
      });
    }

    /* ===== AWARD CERT IMAGES ===== */
    let awardIndexes = [];
    if (data.awardCertImageIndexes) {
      awardIndexes = String(data.awardCertImageIndexes)
        .split(",")
        .map((n) => parseInt(n));
    }

    if (req.files?.awardCertImages) {
      req.files.awardCertImages.forEach((file, i) => {
        const idx = awardIndexes[i] ?? i;
        if (data.awardCerts[idx]) {
          data.awardCerts[idx].image = file.path.replace(/\\/g, "/");
        }
      });
    }

    delete data.courseCertImageIndexes;
    delete data.awardCertImageIndexes;

    const created = await Accreditation.create(data);

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET ALL
========================= */
exports.getAll = async (req, res) => {
  try {
    const data = await Accreditation.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET ONE
========================= */
exports.getOne = async (req, res) => {
  try {
    const data = await Accreditation.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE
========================= */
exports.updateAccreditation = async (req, res) => {
  try {
    const data = req.body;

    if (typeof data.courseCerts === "string")
      data.courseCerts = JSON.parse(data.courseCerts);

    if (typeof data.awardCerts === "string")
      data.awardCerts = JSON.parse(data.awardCerts);

    /* ✅ AWARD LIMIT */
    if (data.awardCerts && data.awardCerts.length > MAX_AWARDS) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_AWARDS} awards allowed`,
      });
    }

    /* ===== MAIN IMAGE ===== */
    if (req.files?.mainImage) {
      data.mainImage = req.files.mainImage[0].path.replace(/\\/g, "/");
    }

    /* ===== COURSE CERT IMAGES ===== */
    let courseIndexes = [];
    if (data.courseCertImageIndexes) {
      courseIndexes = String(data.courseCertImageIndexes)
        .split(",")
        .map((n) => parseInt(n));
    }

    if (req.files?.courseCertImages) {
      req.files.courseCertImages.forEach((file, i) => {
        const idx = courseIndexes[i] ?? i;
        if (data.courseCerts[idx]) {
          data.courseCerts[idx].image = file.path.replace(/\\/g, "/");
        }
      });
    }

    /* ===== AWARD CERT IMAGES ===== */
    let awardIndexes = [];
    if (data.awardCertImageIndexes) {
      awardIndexes = String(data.awardCertImageIndexes)
        .split(",")
        .map((n) => parseInt(n));
    }

    if (req.files?.awardCertImages) {
      req.files.awardCertImages.forEach((file, i) => {
        const idx = awardIndexes[i] ?? i;
        if (data.awardCerts[idx]) {
          data.awardCerts[idx].image = file.path.replace(/\\/g, "/");
        }
      });
    }

    delete data.courseCertImageIndexes;
    delete data.awardCertImageIndexes;

    const updated = await Accreditation.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   DELETE
========================= */
exports.deleteAccreditation = async (req, res) => {
  try {
    await Accreditation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};