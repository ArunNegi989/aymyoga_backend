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
    if (typeof data.courseCerts === "string") data.courseCerts = JSON.parse(data.courseCerts);
    if (typeof data.awardCerts  === "string") data.awardCerts  = JSON.parse(data.awardCerts);

    // main image
    if (req.files?.mainImage) {
      data.mainImage = req.files.mainImage[0].path.replace(/\\/g, "/");
    }

    // course cert images
    let courseCertIndexes = [];
    if (data.courseCertImageIndexes) {
      courseCertIndexes = String(data.courseCertImageIndexes)
        .split(",")
        .map((n) => parseInt(n, 10));
    }
    if (req.files?.courseCertImages) {
      req.files.courseCertImages.forEach((file, uploadIdx) => {
        const certIdx =
          courseCertIndexes.length > uploadIdx
            ? courseCertIndexes[uploadIdx]
            : uploadIdx;
        if (data.courseCerts[certIdx]) {
          data.courseCerts[certIdx].image = file.path.replace(/\\/g, "/");
        }
      });
    }

    // award cert images
    let awardCertIndexes = [];
    if (data.awardCertImageIndexes) {
      awardCertIndexes = String(data.awardCertImageIndexes)
        .split(",")
        .map((n) => parseInt(n, 10));
    }
    if (req.files?.awardCertImages) {
      req.files.awardCertImages.forEach((file, uploadIdx) => {
        const certIdx =
          awardCertIndexes.length > uploadIdx
            ? awardCertIndexes[uploadIdx]
            : uploadIdx;
        if (data.awardCerts[certIdx]) {
          data.awardCerts[certIdx].image = file.path.replace(/\\/g, "/");
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
   GET SINGLE
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

    if (typeof data.courseCerts === "string") data.courseCerts = JSON.parse(data.courseCerts);
    if (typeof data.awardCerts  === "string") data.awardCerts  = JSON.parse(data.awardCerts);

    // main image — only replace if a new file was uploaded
    if (req.files?.mainImage) {
      data.mainImage = req.files.mainImage[0].path.replace(/\\/g, "/");
    }

    // course cert images
    let courseCertIndexes = [];
    if (data.courseCertImageIndexes) {
      courseCertIndexes = String(data.courseCertImageIndexes)
        .split(",")
        .map((n) => parseInt(n, 10));
    }
    if (req.files?.courseCertImages) {
      req.files.courseCertImages.forEach((file, uploadIdx) => {
        const certIdx =
          courseCertIndexes.length > uploadIdx
            ? courseCertIndexes[uploadIdx]
            : uploadIdx;
        if (data.courseCerts[certIdx]) {
          data.courseCerts[certIdx].image = file.path.replace(/\\/g, "/");
        }
      });
    }

    // award cert images
    let awardCertIndexes = [];
    if (data.awardCertImageIndexes) {
      awardCertIndexes = String(data.awardCertImageIndexes)
        .split(",")
        .map((n) => parseInt(n, 10));
    }
    if (req.files?.awardCertImages) {
      req.files.awardCertImages.forEach((file, uploadIdx) => {
        const certIdx =
          awardCertIndexes.length > uploadIdx
            ? awardCertIndexes[uploadIdx]
            : uploadIdx;
        if (data.awardCerts[certIdx]) {
          data.awardCerts[certIdx].image = file.path.replace(/\\/g, "/");
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