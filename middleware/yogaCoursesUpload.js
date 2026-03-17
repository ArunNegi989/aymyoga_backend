const upload = require("./upload"); // 👈 same middleware/ folder mein hai

/*
  Fields accepted:
  - founderImg        (1 file)
  - courseImg_0..5    (1 file each, up to 6 courses)
  - teacherImg_0..9   (1 file each, up to 10 teachers)
*/
const yogaCoursesFields = [
  { name: "founderImg", maxCount: 1 },
  ...Array.from({ length: 6 },  (_, i) => ({ name: `courseImg_${i}`,  maxCount: 1 })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `teacherImg_${i}`, maxCount: 1 })),
];

module.exports = upload.fields(yogaCoursesFields);