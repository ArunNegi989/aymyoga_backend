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

const cleanArray = (arr = []) => arr.map((item) => stripHtml(item));

/* ========================= */
const mapFiles = (filesArray = []) => {
  const files = {};
  filesArray.forEach((file) => {
    if (!files[file.fieldname]) files[file.fieldname] = [];
    files[file.fieldname].push(file);
  });
  return files;
};

/* ========================= */
const buildData = (req, existing = {}) => {
  const body = req.body;
  const files = mapFiles(req.files);

  const reelVideosRaw = parseJSON(body.reelVideos);
  const reelVideos = reelVideosRaw.map((rv) => {
    const fileKey = `reelVideo_${rv.id}`;
    if (files[fileKey]) {
      return {
        label: rv.label || "",
        videoUrl: "",
        videoFile: "/uploads/" + files[fileKey][0].filename,
      };
    }

    return {
      label: rv.label || "",
      videoUrl: rv.videoUrl || "",
      videoFile: rv.videoFile || "",
    };
  });

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

    beachImages: (() => {
      const existingBeach = (existing.beachImages || []).reduce((acc, b) => {
        acc[b.id] = b.imgUrl;
        return acc;
      }, {});

      const uploadedKeys = Object.keys(files).filter((k) =>
        k.startsWith("beachImg_"),
      );
      uploadedKeys.forEach((k) => {
        const id = k.replace("beachImg_", "");
        existingBeach[id] = "/uploads/" + files[k][0].filename;
      });

      return ["beach1", "beach2", "beach3"]
        .filter((id) => existingBeach[id])
        .map((id) => ({ id, imgUrl: existingBeach[id] }));
    })(),

    reelVideos,
  };
};

/* ========================= */
exports.createPage = async (req, res) => {
  try {
    const exists = await GoaYoga.findOne();
    if (exists) return res.status(400).json({ message: "Already exists" });

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
    const updated = await GoaYoga.findByIdAndUpdate(existing._id, data, {
      new: true,
    });
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
