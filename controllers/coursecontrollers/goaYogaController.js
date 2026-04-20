const GoaYoga = require("../../models/courses/GoaYogaPageModel");

/* ========================= */
const parseJSON = (val) => {
  try {
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
};
/* ========================= */
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
};

const cleanArray = (arr = []) => {
  return arr.map((item) => stripHtml(item));
};
/* ========================= */
const mapFiles = (filesArray = []) => {
  const files = {};
  filesArray.forEach((file) => {
    if (!files[file.fieldname]) {
      files[file.fieldname] = [];
    }
    files[file.fieldname].push(file);
  });
  return files;
};

/* ========================= */
const buildData = (req, existing = {}) => {
  const body = req.body;
  const files = mapFiles(req.files);

  return {
    ...body,

    heroImage: files.heroImage
      ? "/uploads/" + files.heroImage[0].filename
      : existing.heroImage,

    introBigImage: files.introBigImage
      ? "/uploads/" + files.introBigImage[0].filename
      : existing.introBigImage,

    introSmallImage: files.introSmallImage
      ? "/uploads/" + files.introSmallImage[0].filename
      : existing.introSmallImage,

    scheduleImage: files.scheduleImage
      ? "/uploads/" + files.scheduleImage[0].filename
      : existing.scheduleImage,

    introParagraphs: cleanArray(parseJSON(body.introParagraphs)),
learnings: cleanArray(parseJSON(body.learnings)),
mainFocus: cleanArray(parseJSON(body.mainFocus)),
focusBodyText: stripHtml(body.focusBodyText),
    corePrograms: parseJSON(body.corePrograms),
    specialPrograms: parseJSON(body.specialPrograms),
    highlights: parseJSON(body.highlights),
   
    scheduleRows: parseJSON(body.scheduleRows),
    applyFields: parseJSON(body.applyFields),

    // BEACH IMAGES
    beachImages: Object.keys(files)
      .filter((k) => k.startsWith("beachImg_"))
      .map((k) => ({
        id: k.replace("beachImg_", ""),
        imgUrl: "/uploads/" + files[k][0].filename,
      })),

    // CAMPUS IMAGES
    campusImages: parseJSON(body.campusImages).map((item) => {
      const key = `campusImg_${item.id}`;
      if (files[key]) {
        return {
          ...item,
          imgUrl: "/uploads/" + files[key][0].filename,
        };
      }
      return item;
    }),
  };
};

/* ========================= */
exports.createPage = async (req, res) => {
  try {
    const exists = await GoaYoga.findOne();
    if (exists) {
      return res.status(400).json({ message: "Already exists" });
    }

    const data = buildData(req);

    const created = await GoaYoga.create(data);

    res.json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= */
exports.getPage = async (req, res) => {
  const data = await GoaYoga.findOne();
  res.json({ success: true, data });
};

/* ========================= */
exports.updatePage = async (req, res) => {
  try {
    const existing = await GoaYoga.findOne();
    if (!existing) return res.status(404).json({ message: "Not found" });

    const data = buildData(req, existing);

    const updated = await GoaYoga.findByIdAndUpdate(
      existing._id,
      data,
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========================= */
exports.deletePage = async (req, res) => {
  const existing = await GoaYoga.findOne();
  if (!existing) return res.status(404).json({ message: "Not found" });

  await GoaYoga.findByIdAndDelete(existing._id);

  res.json({ success: true, message: "Deleted" });
};