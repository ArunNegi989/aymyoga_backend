const Accreditation = require("../../models/homepage/Accreditation");

/* =========================
   CREATE
========================= */
exports.createAccreditation = async (req, res) => {
  try {
    const data = req.body;

    

    // parse arrays (important)
    if (typeof data.certs === "string") data.certs = JSON.parse(data.certs);
    if (typeof data.badges === "string") data.badges = JSON.parse(data.badges);

   if (req.files?.mainImage) {
  data.mainImage = req.files.mainImage[0].path.replace(/\\/g, "/"); // 🔥 FIX
}

if (req.files?.certImages) {
  req.files.certImages.forEach((file, index) => {
    if (data.certs[index]) {
      data.certs[index].image = file.path.replace(/\\/g, "/"); // 🔥 FIX
    }
  });
}

    const created = await Accreditation.create(data);

    res.status(201).json({
      success: true,
      data: created,
    });
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
    res.status(500).json({ success: false });
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
    res.status(500).json({ success: false });
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

   if (req.files?.mainImage) {
  data.mainImage = req.files.mainImage[0].path.replace(/\\/g, "/");
}

if (req.files?.certImages) {
  req.files.certImages.forEach((file, index) => {
    if (data.certs[index]) {
      data.certs[index].image = file.path.replace(/\\/g, "/");
    }
  });
}

    const updated = await Accreditation.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false });
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
    res.status(500).json({ success: false });
  }
};