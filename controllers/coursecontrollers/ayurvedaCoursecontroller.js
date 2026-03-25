const AyurvedaCourse = require("../../models/courses/ayurvedaCoursemodel");

/* SAFE JSON */
const safeParse = (data) => {
  try {
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

/* PARSER */
const parseData = (req, existing = {}) => {
  const body = req.body;

  const getImg = (field) => {
    if (req.files?.[field]) {
      return "/uploads/" + req.files[field][0].filename;
    }
    return existing[field] || "";
  };

  const ayurvedaCourses = safeParse(body.ayurvedaCourses).map((item, i) => {
    const file = req.files?.[`ayurvedaCourseImage_${i}`];
    if (file) item.image = "/uploads/" + file[0].filename;
    return item;
  });

  const panchaKarmaCourses = safeParse(body.panchaKarmaCourses).map((item, i) => {
    const file = req.files?.[`panchaKarmaCourseImage_${i}`];
    if (file) item.image = "/uploads/" + file[0].filename;
    return item;
  });

  return {
    ...body,

    heroImage: getImg("heroImage"),
    introRightImage: getImg("introRightImage"),
    spicesStripImage: getImg("spicesStripImage"),
    sunsetImage: getImg("sunsetImage"),

    introParagraphs: body.introParagraphs || [],
    pkParagraphs: body.pkParagraphs || [],
    massageParagraphs: body.massageParagraphs || [],
    trainingParagraphs: body.trainingParagraphs || [],
    spiritualParagraphs: body.spiritualParagraphs || [],

    ayurvedaCourses,
    panchaKarmaCourses,
    therapies: safeParse(body.therapies),
    doshas: safeParse(body.doshas),
    yogaPricing: safeParse(body.yogaPricing),
    massageTypes: safeParse(body.massageTypes),
    dailySchedule: safeParse(body.dailySchedule),
    syllabus: safeParse(body.syllabus),
    included: safeParse(body.included),
  };
};

/* CREATE */
exports.create = async (req, res) => {
  try {
    const exists = await AyurvedaCourse.findOne();
    if (exists) {
      return res.status(400).json({ message: "Only one record allowed" });
    }

    const data = parseData(req);
    const newData = new AyurvedaCourse(data);
    await newData.save();

    res.json({ success: true, data: newData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL */
exports.getAll = async (req, res) => {
  const data = await AyurvedaCourse.find();
  res.json({ success: true, data });
};

/* GET ONE */
exports.getOne = async (req, res) => {
  const data = await AyurvedaCourse.findById(req.params.id);
  res.json({ success: true, data });
};

/* UPDATE */
exports.update = async (req, res) => {
  try {
    const existing = await AyurvedaCourse.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const data = parseData(req, existing);

    const updated = await AyurvedaCourse.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
exports.remove = async (req, res) => {
  await AyurvedaCourse.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted" });
};