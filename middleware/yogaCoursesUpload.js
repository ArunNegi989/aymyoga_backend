const upload = require("./upload");

/*
  Fields accepted:
  - founderImg         (1 file)
  - courseImg_0..19    (1 file each, up to 20 courses)
  - teacherImg_0..49   (1 file each, up to 50 teachers)
*/
const yogaCoursesFields = [
  { name: "founderImg", maxCount: 1 },
  ...Array.from({ length: 20 }, (_, i) => ({ name: `courseImg_${i}`,  maxCount: 1 })),
  ...Array.from({ length: 50 }, (_, i) => ({ name: `teacherImg_${i}`, maxCount: 1 })),
];

const rawUpload = upload.fields(yogaCoursesFields);

// Wraps multer so that upload errors return a clean JSON response
// instead of crashing the app, and logs the exact offending field name.
const yogaCoursesUpload = (req, res, next) => {
  rawUpload(req, res, (err) => {
    if (err) {
      console.error("🔴 Multer error:", err.message, "| Field:", err.field ?? "unknown");
      return res.status(400).json({
        success: false,
        message: err.message,
        field:   err.field ?? null,
      });
    }
    next();
  });
};

module.exports = yogaCoursesUpload;