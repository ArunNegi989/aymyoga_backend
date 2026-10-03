const GuestTeacher = require("../../models/ourTeachers/guestTeacherModel");

const parseBio = (bio) => {
  if (!bio) return [];

  if (Array.isArray(bio)) return bio.filter((b) => b && b.trim() !== "");

  if (typeof bio === "object") {
    return Object.values(bio).filter((b) => b && b.trim() !== "");
  }

  if (typeof bio === "string" && bio.trim() !== "") {
    try {
      const parsed = JSON.parse(bio);
      if (Array.isArray(parsed))
        return parsed.filter((b) => b && b.trim() !== "");
      return [bio.trim()];
    } catch {
      return [bio.trim()];
    }
  }

  return [];
};

exports.create = async (req, res) => {
  try {
    const body = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    body.image = `/uploads/${req.file.filename}`;

    const parsedBio = parseBio(body.bio);

    if (parsedBio.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Bio is required" });
    }

    const teacher = await GuestTeacher.create({
      name: body.name,
      order: Number(body.order) || 0,
      image: body.image,
      bio: parsedBio,
    });

    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const teachers = await GuestTeacher.find().sort({
      order: 1,
      createdAt: -1,
    });
    res.json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getOne = async (req, res) => {
  try {
    const teacher = await GuestTeacher.findById(req.params.id);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Guest Teacher not found" });
    }
    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const body = req.body;

    if (req.file) {
      body.image = `/uploads/${req.file.filename}`;
    }

    const parsedBio = parseBio(body.bio);

    const teacher = await GuestTeacher.findByIdAndUpdate(
      req.params.id,
      {
        name: body.name,
        order: Number(body.order) || 0,
        ...(body.image && { image: body.image }),
        bio: parsedBio,
      },
      { new: true },
    );

    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Guest Teacher not found" });
    }

    res.json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const teacher = await GuestTeacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Guest Teacher not found" });
    }
    res.json({ success: true, message: "Guest Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
