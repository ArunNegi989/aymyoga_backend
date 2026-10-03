const upload = require("./upload");

const yogaCoursesFields = [
  { name: "founderImg", maxCount: 1 },
  ...Array.from({ length: 20 }, (_, i) => ({
    name: `courseImg_${i}`,
    maxCount: 1,
  })),
  ...Array.from({ length: 50 }, (_, i) => ({
    name: `teacherImg_${i}`,
    maxCount: 1,
  })),
];

const rawUpload = upload.fields(yogaCoursesFields);

const yogaCoursesUpload = (req, res, next) => {
  rawUpload(req, res, (err) => {
    if (err) {
      console.error(
        "🔴 Multer error:",
        err.message,
        "| Field:",
        err.field ?? "unknown",
      );
      return res.status(400).json({
        success: false,
        message: err.message,
        field: err.field ?? null,
      });
    }
    next();
  });
};

module.exports = yogaCoursesUpload;
