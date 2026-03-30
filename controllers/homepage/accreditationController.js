const Accreditation = require("../../models/homepage/Accreditation");

/* =========================
   CREATE
========================= */
exports.createAccreditation = async (req, res) => {
  try {
    const count = await Accreditation.countDocuments();

    if (count >= 1) {
      return res.status(400).json({
        success: false,
        message:
          "Only one Accreditation section is allowed. Please update or delete existing one.",
      });
    }

    const data = req.body;

    // parse arrays
    if (typeof data.certs === "string") data.certs = JSON.parse(data.certs);
    if (typeof data.badges === "string") data.badges = JSON.parse(data.badges);

    // certImageIndexes tells us which cert index each uploaded file belongs to
    // e.g. "0,2,4"  →  certImages[0] → certs[0], certImages[1] → certs[2], etc.
    let certImageIndexes = [];
    if (data.certImageIndexes) {
      certImageIndexes = String(data.certImageIndexes)
        .split(",")
        .map((n) => parseInt(n, 10));
    }

    // main image
    if (req.files?.mainImage) {
      data.mainImage = req.files.mainImage[0].path.replace(/\\/g, "/");
    }

    // cert images — map using indexes if provided, else fall back to positional
    if (req.files?.certImages) {
      req.files.certImages.forEach((file, uploadIdx) => {
        const certIdx =
          certImageIndexes.length > uploadIdx
            ? certImageIndexes[uploadIdx]
            : uploadIdx;

        if (data.certs[certIdx]) {
          data.certs[certIdx].image = file.path.replace(/\\/g, "/");
        }
      });
    }

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
   GET SINGLE
========================= */
exports.getOne = async (req, res) => {
  try {
    const data = await Accreditation.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

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

    if (typeof data.certs === "string") data.certs = JSON.parse(data.certs);
    if (typeof data.badges === "string") data.badges = JSON.parse(data.badges);

    // certImageIndexes — which cert slot each uploaded image belongs to
    let certImageIndexes = [];
    if (data.certImageIndexes) {
      certImageIndexes = String(data.certImageIndexes)
        .split(",")
        .map((n) => parseInt(n, 10));
    }

    // main image — only replace if a new file was uploaded
    if (req.files?.mainImage) {
      data.mainImage = req.files.mainImage[0].path.replace(/\\/g, "/");
    }

    // cert images
    if (req.files?.certImages) {
      req.files.certImages.forEach((file, uploadIdx) => {
        const certIdx =
          certImageIndexes.length > uploadIdx
            ? certImageIndexes[uploadIdx]
            : uploadIdx;

        if (data.certs[certIdx]) {
          data.certs[certIdx].image = file.path.replace(/\\/g, "/");
        }
      });
    }

    // Remove helper field before saving
    delete data.certImageIndexes;

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