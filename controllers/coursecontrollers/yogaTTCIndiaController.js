const YogaTTCIndia = require("../../models/courses/YogaTTCIndiaModel");

const parseJSON = (val) => {
  try {
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
};

const filePath = (file) => {
  if (!file) return "";
  return `/uploads/${file.filename}`;
};

exports.create = async (req, res) => {
  try {
    const existing = await YogaTTCIndia.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Record already exists. Use update instead.",
      });
    }

    const body = req.body;
    const files = req.files;

    let data = {
      ...body,

      heroImage: files?.heroImage?.[0] ? filePath(files.heroImage[0]) : "",
      mediaImage: files?.mediaImage?.[0] ? filePath(files.mediaImage[0]) : "",
      whoWeAreVideo: files?.whoWeAreVideo?.[0]
        ? filePath(files.whoWeAreVideo[0])
        : "",
      whoWeAreVideoPoster: files?.whoWeAreVideoPoster?.[0]
        ? filePath(files.whoWeAreVideoPoster[0])
        : "",
      rishikeshImage: files?.rishikeshImage?.[0]
        ? filePath(files.rishikeshImage[0])
        : "",
      goaImage: files?.goaImage?.[0] ? filePath(files.goaImage[0]) : "",
      whyAYMImage: files?.whyAYMImage?.[0]
        ? filePath(files.whyAYMImage[0])
        : "",

      introParagraphs: parseJSON(body.introParagraphs),
      whyAYMParagraphs: parseJSON(body.whyAYMParagraphs),
      rishikeshParagraphs: parseJSON(body.rishikeshParagraphs),
      goaParagraphs: parseJSON(body.goaParagraphs),

      arrivalList: parseJSON(body.arrivalList),
      feeList: parseJSON(body.feeList),

      accredBadges: parseJSON(body.accredBadges),
      courseCards: parseJSON(body.courseCards),
      quoteCards: parseJSON(body.quoteCards),
      locations: parseJSON(body.locations),

      videoEnabled: body.videoEnabled === "true" || body.videoEnabled === true,
      whoWeAreVideoEnabled:
        body.whoWeAreVideoEnabled === "true" ||
        body.whoWeAreVideoEnabled === true,
      benefitsList: parseJSON(body.benefitsList),
    };

    if (data.accredBadges && data.accredBadges.length) {
      data.accredBadges = data.accredBadges.map((b, i) => ({
        ...b,
        image: files?.[`accredBadgeImage_${i}`]?.[0]
          ? filePath(files[`accredBadgeImage_${i}`][0])
          : "",
      }));
    }

    if (data.courseCards && data.courseCards.length) {
      data.courseCards = data.courseCards.map((c, i) => ({
        ...c,
        image: files?.[`courseCardImage_${i}`]?.[0]
          ? filePath(files[`courseCardImage_${i}`][0])
          : "",
      }));
    }

    if (data.quoteCards && data.quoteCards.length) {
      data.quoteCards = data.quoteCards.map((q, i) => ({
        ...q,
        image: files?.[`quoteCardImage_${i}`]?.[0]
          ? filePath(files[`quoteCardImage_${i}`][0])
          : "",
      }));
    }

    if (data.locations && data.locations.length) {
      data.locations = data.locations.map((loc, i) => ({
        ...loc,
        image: files?.[`locationImage_${i}`]?.[0]
          ? filePath(files[`locationImage_${i}`][0])
          : loc.image || "",
      }));
    }

    const result = await YogaTTCIndia.create(data);

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getSingle = async (req, res) => {
  try {
    const data = await YogaTTCIndia.findOne();
    res.json({ success: true, data: data || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const existing = await YogaTTCIndia.findOne();

    if (!existing) {
      return res.status(404).json({ message: "No record found" });
    }

    const body = req.body;
    const files = req.files;

    let data = {
      ...body,

      heroImage: files?.heroImage?.[0]
        ? filePath(files.heroImage[0])
        : existing.heroImage,
      mediaImage: files?.mediaImage?.[0]
        ? filePath(files.mediaImage[0])
        : existing.mediaImage,
      whoWeAreVideo: files?.whoWeAreVideo?.[0]
        ? filePath(files.whoWeAreVideo[0])
        : existing.whoWeAreVideo,
      whoWeAreVideoPoster: files?.whoWeAreVideoPoster?.[0]
        ? filePath(files.whoWeAreVideoPoster[0])
        : existing.whoWeAreVideoPoster,
      rishikeshImage: files?.rishikeshImage?.[0]
        ? filePath(files.rishikeshImage[0])
        : existing.rishikeshImage,
      goaImage: files?.goaImage?.[0]
        ? filePath(files.goaImage[0])
        : existing.goaImage,
      whyAYMImage: files?.whyAYMImage?.[0]
        ? filePath(files.whyAYMImage[0])
        : existing.whyAYMImage,

      introParagraphs: parseJSON(body.introParagraphs),
      whyAYMParagraphs: parseJSON(body.whyAYMParagraphs),
      rishikeshParagraphs: parseJSON(body.rishikeshParagraphs),
      goaParagraphs: parseJSON(body.goaParagraphs),

      arrivalList: parseJSON(body.arrivalList),
      feeList: parseJSON(body.feeList),

      accredBadges: parseJSON(body.accredBadges),
      courseCards: parseJSON(body.courseCards),
      quoteCards: parseJSON(body.quoteCards),
      locations: parseJSON(body.locations),

      videoEnabled: body.videoEnabled === "true" || body.videoEnabled === true,
      whoWeAreVideoEnabled:
        body.whoWeAreVideoEnabled === "true" ||
        body.whoWeAreVideoEnabled === true,
      benefitsList: parseJSON(body.benefitsList),
    };

    if (data.accredBadges && data.accredBadges.length) {
      data.accredBadges = data.accredBadges.map((b, i) => ({
        ...b,
        image: files?.[`accredBadgeImage_${i}`]?.[0]
          ? filePath(files[`accredBadgeImage_${i}`][0])
          : existing.accredBadges[i]?.image || "",
      }));
    }

    if (data.courseCards && data.courseCards.length) {
      data.courseCards = data.courseCards.map((c, i) => ({
        ...c,
        image: files?.[`courseCardImage_${i}`]?.[0]
          ? filePath(files[`courseCardImage_${i}`][0])
          : existing.courseCards[i]?.image || "",
      }));
    }

    if (data.quoteCards && data.quoteCards.length) {
      data.quoteCards = data.quoteCards.map((q, i) => ({
        ...q,
        image: files?.[`quoteCardImage_${i}`]?.[0]
          ? filePath(files[`quoteCardImage_${i}`][0])
          : existing.quoteCards[i]?.image || "",
      }));
    }

    if (data.locations && data.locations.length) {
      data.locations = data.locations.map((loc, i) => ({
        ...loc,
        image: files?.[`locationImage_${i}`]?.[0]
          ? filePath(files[`locationImage_${i}`][0])
          : existing.locations[i]?.image || loc.image || "",
      }));
    }

    const updated = await YogaTTCIndia.findByIdAndUpdate(existing._id, data, {
      new: true,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE SINGLE RECORD
========================= */
exports.remove = async (req, res) => {
  try {
    const existing = await YogaTTCIndia.findOne();

    if (!existing) {
      return res.status(404).json({ message: "No record found" });
    }

    await YogaTTCIndia.findByIdAndDelete(existing._id);

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
