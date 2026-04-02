const Course = require("../../models/homepage/CourseSectionModel");

/* =========================
   HELPERS
========================= */
const parseLinks = (raw) => {
  if (!raw) return [];
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return [];
  }
};

// Build a clean update object — never spread req.body directly
const buildCourseFields = (body, file) => {
  const {
    title, imageAlt, duration, level, description,
    enrollHref, exploreLabel, exploreHref,
    priceINR, priceUSD, totalSeats, order,
  } = body;

  const data = {
    title, imageAlt, duration, level, description,
    enrollHref, exploreLabel, exploreHref,
    priceINR, priceUSD,
    totalSeats: Number(totalSeats),
    order: order !== undefined ? Number(order) : 0,
    links: parseLinks(body.links),
  };

  if (file) {
    data.image = `/uploads/${file.filename}`;
  }

  return data;
};

/* =========================
   CREATE
========================= */
const createCourse = async (req, res) => {
  try {
    const fields = buildCourseFields(req.body, req.file);

    const newCourse = new Course(fields);
    await newCourse.save(); // pre("save") hook sets availableSeats here

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET ALL
========================= */
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ order: 1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET SINGLE
========================= */
const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   UPDATE
========================= */
const updateCourse = async (req, res) => {
  try {
    const fields = buildCourseFields(req.body, req.file);

    // If totalSeats changed and availableSeats was never set, sync it
    const existing = await Course.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (existing.availableSeats == null) {
      fields.availableSeats = fields.totalSeats;
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: fields },   // ✅ use $set instead of replacing the whole doc
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   DELETE
========================= */
const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   BOOK SEAT
========================= */
const bookSeat = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.availableSeats <= 0) {
      return res.status(400).json({ success: false, message: "No seats available" });
    }

    course.availableSeats -= 1;
    await course.save();

    res.json({
      success: true,
      message: "Seat booked successfully ✅",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  bookSeat, 
};