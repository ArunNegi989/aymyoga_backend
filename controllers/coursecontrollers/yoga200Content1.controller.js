const Yoga200Content1 = require("../../models/courses/Yoga200Content1");

/* ================= HELPERS ================= */
const parseArray = (val) => {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
};

const parseHatha43 = (raw) => {
  try {
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr)) return [];
    return arr.map((a) => ({
      n:      String(a.n      ?? ""),
      name:   String(a.name   ?? ""),
      sub:    String(a.sub    ?? ""),
      filter: String(a.filter ?? "All Poses"),
    }));
  } catch {
    return [];
  }
};

const parseWeekGrid = (raw) => {
  try {
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr)) return [];
    return arr.map((w) => ({
      week: String(w.week ?? ""),
      icon: String(w.icon ?? ""),
      t1:   String(w.t1   ?? ""),
      d1:   String(w.d1   ?? ""),
      t2:   String(w.t2   ?? ""),
      d2:   String(w.d2   ?? ""),
    }));
  } catch {
    return [];
  }
};

const buildStats = (body) =>
  [1, 2, 3, 4].map((n) => ({
    icon:  body[`stat${n}Icon`]  || "",
    value: body[`stat${n}Val`]   || "",
    title: body[`stat${n}Title`] || "",
    desc:  body[`stat${n}Desc`]  || "",
  }));

const buildOverview = (body) => ({
  h2:          body.overviewH2          || "",
  certName:    body.overviewCertName    || "",
  level:       body.overviewLevel       || "",
  eligibility: body.overviewEligibility || "",
  minAge:      body.overviewMinAge      || "",
  credits:     body.overviewCredits     || "",
  language:    body.overviewLanguage    || "",
});

const buildModules = (body) =>
  Array.from({ length: 8 }).map((_, i) => ({
    title: body[`mod${i + 1}Title`] || "",
    intro: body[`mod${i + 1}Intro`] || "",
    items: parseArray(body[`mod${i + 1}Items`]),
    body:  body[`mod${i + 1}Body`]  || "",
  }));

const buildAshtanga = (body, image) => ({
  h2:       body.ashtangaH2       || "",
  subtitle: body.ashtangaSubtitle || "",
  desc:     body.ashtangaDesc     || "",
  image,
  imgAlt:   body.ashtangaImgAlt   || "",
  pills: [
    body.ashtangaPill1 || "",
    body.ashtangaPill2 || "",
    body.ashtangaPill3 || "",
  ],
});

const buildPrimary = (body) => ({
  h3:              body.primarySeriesH3      || "",
  subtext:         body.primarySeriesSubtext || "",
  intro:           body.primaryIntro         || "",
  foundationItems: parseArray(body.foundationItems),
  weekGrid:        parseWeekGrid(body.weekGrid),
});

const buildHatha = (body, image) => ({
  h2:       body.hathaH2       || "",
  subtitle: body.hathaSubtitle || "",
  desc:     body.hathaDesc     || "",
  image,
  imgAlt:   body.hathaImgAlt   || "",
  pills: [
    body.hathaPill1 || "",
    body.hathaPill2 || "",
    body.hathaPill3 || "",
  ],
  asanas: parseHatha43(body.hatha43),
});

/* ================= CREATE ================= */
exports.createContent1 = async (req, res) => {
  try {
    const body = req.body;

    const existingCount = await Yoga200Content1.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Only one record allowed. Please update or delete existing record first.",
      });
    }

    const existingSlug = await Yoga200Content1.findOne({ slug: body.slug });
    if (existingSlug) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    const heroFile = req.files?.heroImage?.[0];
    if (!heroFile) {
      return res.status(400).json({ message: "Hero image is required" });
    }

    const heroImage     = `/uploads/${heroFile.filename}`;
    const ashtangaImage = req.files?.ashtangaImage?.[0] ? `/uploads/${req.files.ashtangaImage[0].filename}` : "";
    const hathaImage    = req.files?.hathaImage?.[0]    ? `/uploads/${req.files.hathaImage[0].filename}`    : "";

    const newData = new Yoga200Content1({
      slug:      body.slug,
      status:    body.status || "Active",
      pageMainH1: body.pageMainH1,
      heroImgAlt: body.heroImgAlt,
      heroImage,

      introPara1: body.introPara1,
      introPara2: body.introPara2,
      introPara3: body.introPara3,
      introPara4: body.introPara4,

      stats: buildStats(body),

      aimsH3:          body.aimsH3,
      aimsIntro:       body.aimsIntro,
      aimsOutro:       body.aimsOutro,
      aimsKeyObjLabel: body.aimsKeyObjLabel,
      aimsBullets:     parseArray(body.aimsBullets),

      overview: buildOverview(body),

      upcomingDatesH2:      body.upcomingDatesH2,
      upcomingDatesSubtext: body.upcomingDatesSubtext,

      feeIncludedTitle:    body.feeIncludedTitle,
      feeNotIncludedTitle: body.feeNotIncludedTitle,
      includedFee:         parseArray(body.includedFee),
      notIncludedFee:      parseArray(body.notIncludedFee),

      syllabusH3:    body.syllabusH3,
      syllabusIntro: body.syllabusIntro,

      modules: buildModules(body),

      ashtanga: buildAshtanga(body, ashtangaImage),
      primary:  buildPrimary(body),
      hatha:    buildHatha(body, hathaImage),
    });

    await newData.save();
    res.status(201).json({ success: true, message: "Created successfully", data: newData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL ================= */
exports.getAllContent1 = async (req, res) => {
  try {
    const data = await Yoga200Content1.find().sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ONE ================= */
exports.getContent1ById = async (req, res) => {
  try {
    const data = await Yoga200Content1.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateContent1 = async (req, res) => {
  try {
    const body = req.body;
    const id   = req.params.id;

    const existing = await Yoga200Content1.findById(id);
    if (!existing) return res.status(404).json({ message: "Not found" });

    const heroImage     = req.files?.heroImage?.[0]     ? `/uploads/${req.files.heroImage[0].filename}`     : existing.heroImage;
    const ashtangaImage = req.files?.ashtangaImage?.[0] ? `/uploads/${req.files.ashtangaImage[0].filename}` : existing.ashtanga?.image || "";
    const hathaImage    = req.files?.hathaImage?.[0]    ? `/uploads/${req.files.hathaImage[0].filename}`    : existing.hatha?.image    || "";

    const updated = await Yoga200Content1.findByIdAndUpdate(
      id,
      {
        slug:      body.slug,
        status:    body.status,
        pageMainH1: body.pageMainH1,
        heroImgAlt: body.heroImgAlt,
        heroImage,

        introPara1: body.introPara1,
        introPara2: body.introPara2,
        introPara3: body.introPara3,
        introPara4: body.introPara4,

        stats: buildStats(body),

        aimsH3:          body.aimsH3,
        aimsIntro:       body.aimsIntro,
        aimsOutro:       body.aimsOutro,
        aimsKeyObjLabel: body.aimsKeyObjLabel,
        aimsBullets:     parseArray(body.aimsBullets),

        overview: buildOverview(body),

        upcomingDatesH2:      body.upcomingDatesH2,
        upcomingDatesSubtext: body.upcomingDatesSubtext,

        feeIncludedTitle:    body.feeIncludedTitle,
        feeNotIncludedTitle: body.feeNotIncludedTitle,
        includedFee:         parseArray(body.includedFee),
        notIncludedFee:      parseArray(body.notIncludedFee),

        syllabusH3:    body.syllabusH3,
        syllabusIntro: body.syllabusIntro,

        modules: buildModules(body),

        ashtanga: buildAshtanga(body, ashtangaImage),
        primary:  buildPrimary(body),
        hatha:    buildHatha(body, hathaImage),
      },
      { new: true }
    );

    res.json({ success: true, message: "Updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteContent1 = async (req, res) => {
  try {
    const deleted = await Yoga200Content1.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};