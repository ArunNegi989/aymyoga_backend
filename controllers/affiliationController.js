const fs = require("fs");
const path = require("path");
const Affiliation = require("../models/affiliationModel");

const parseJSON = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const toDiskPath = (storedPath) => {
  if (!storedPath) return null;
  const relative = storedPath.startsWith("/")
    ? storedPath.slice(1)
    : storedPath;
  return path.join(process.cwd(), relative);
};

const deleteFileIfExists = (storedPath) => {
  const diskPath = toDiskPath(storedPath);
  if (!diskPath) return;
  fs.unlink(diskPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to delete file:", diskPath, err.message);
    }
  });
};

const findFile = (files, fieldname) =>
  (files || []).find((f) => f.fieldname === fieldname);
const findFiles = (files, fieldname) =>
  (files || []).filter((f) => f.fieldname === fieldname);
const toPublicPath = (file) => (file ? `/uploads/${file.filename}` : "");

const buildAffiliationPayload = (req, existingDoc = null) => {
  const body = req.body;
  const files = req.files || [];

  const payload = {
    heroImageAlt: body.heroImageAlt ?? existingDoc?.heroImageAlt ?? "",
    mainTitle: body.mainTitle ?? existingDoc?.mainTitle ?? "",
    introCardTitle: body.introCardTitle ?? existingDoc?.introCardTitle ?? "",
    highlightTitle: body.highlightTitle ?? existingDoc?.highlightTitle ?? "",
    yogaAllianceUrl: body.yogaAllianceUrl ?? existingDoc?.yogaAllianceUrl ?? "",
    certsSectionTitle:
      body.certsSectionTitle ?? existingDoc?.certsSectionTitle ?? "",
    certsSectionSubtitle:
      body.certsSectionSubtitle ?? existingDoc?.certsSectionSubtitle ?? "",
    boardSectionTitle:
      body.boardSectionTitle ?? existingDoc?.boardSectionTitle ?? "",
    boardSectionSubtitle:
      body.boardSectionSubtitle ?? existingDoc?.boardSectionSubtitle ?? "",
    boardInfoTitle: body.boardInfoTitle ?? existingDoc?.boardInfoTitle ?? "",
    boardInfoText: body.boardInfoText ?? existingDoc?.boardInfoText ?? "",
    iyfSectionTitle: body.iyfSectionTitle ?? existingDoc?.iyfSectionTitle ?? "",
    iyfTitle: body.iyfTitle ?? existingDoc?.iyfTitle ?? "",
  };

  payload.accreditationCards = parseJSON(
    body.accreditationCards,
    existingDoc?.accreditationCards ?? [],
  );
  payload.introParagraphs = parseJSON(
    body.introParagraphs,
    existingDoc?.introParagraphs ?? [],
  );
  payload.highlightParagraphs = parseJSON(
    body.highlightParagraphs,
    existingDoc?.highlightParagraphs ?? [],
  );
  payload.iyfParagraphs = parseJSON(
    body.iyfParagraphs,
    existingDoc?.iyfParagraphs ?? [],
  );
  payload.iyfFooterNotes = parseJSON(
    body.iyfFooterNotes,
    existingDoc?.iyfFooterNotes ?? [],
  );

  const heroFile = findFile(files, "heroImage");
  payload.heroImage = heroFile
    ? toPublicPath(heroFile)
    : (existingDoc?.heroImage ?? "");
  if (heroFile && existingDoc?.heroImage)
    deleteFileIfExists(existingDoc.heroImage);

  const boardCertFile = findFile(files, "boardCertificateImage");
  payload.boardCertificateImage = boardCertFile
    ? toPublicPath(boardCertFile)
    : (existingDoc?.boardCertificateImage ?? "");
  if (boardCertFile && existingDoc?.boardCertificateImage)
    deleteFileIfExists(existingDoc.boardCertificateImage);

  const iyfLogoFile = findFile(files, "iyfLogoImage");
  payload.iyfLogoImage = iyfLogoFile
    ? toPublicPath(iyfLogoFile)
    : (existingDoc?.iyfLogoImage ?? "");
  if (iyfLogoFile && existingDoc?.iyfLogoImage)
    deleteFileIfExists(existingDoc.iyfLogoImage);

  const newGalleryFiles = findFiles(files, "galleryImages");
  const retainedGallery = parseJSON(body.existingGalleryImages, []);
  const removedGallery = (existingDoc?.galleryImages ?? []).filter(
    (url) => !retainedGallery.includes(url),
  );
  removedGallery.forEach(deleteFileIfExists);
  payload.galleryImages = [
    ...retainedGallery,
    ...newGalleryFiles.map(toPublicPath),
  ];

  const rysAlts = parseJSON(body.rysImagesAlt, []);
  const existingRysImages = parseJSON(body.existingRysImages, []);
  const rysCount = Math.max(rysAlts.length, existingRysImages.length);
  payload.rysImages = [];
  for (let i = 0; i < rysCount; i++) {
    const newFile = findFile(files, `rysImage_${i}`);
    const prevImage = existingDoc?.rysImages?.[i]?.image ?? "";
    if (newFile && prevImage) deleteFileIfExists(prevImage);
    payload.rysImages.push({
      alt: rysAlts[i] ?? "",
      image: newFile
        ? toPublicPath(newFile)
        : (existingRysImages[i] ?? prevImage ?? ""),
    });
  }

  const certsData = parseJSON(body.certsData, []);
  const existingCertImages = parseJSON(body.existingCertImages, []);
  payload.certs = certsData.map((c, i) => {
    const newFile = findFile(files, `certImage_${i}`);
    const prevImage = existingDoc?.certs?.[i]?.image ?? "";
    if (newFile && prevImage) deleteFileIfExists(prevImage);
    return {
      type: c.type ?? "",
      description: c.description ?? "",
      image: newFile
        ? toPublicPath(newFile)
        : (existingCertImages[i] ?? prevImage ?? ""),
    };
  });

  return payload;
};

exports.getAffiliation = async (req, res) => {
  try {
    const doc = await Affiliation.findOne().sort({ createdAt: -1 });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /accreditation/:id
exports.getAffiliationById = async (req, res) => {
  try {
    const doc = await Affiliation.findById(req.params.id);
    if (!doc)
      return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAffiliation = async (req, res) => {
  try {
    const already = await Affiliation.findOne();
    if (already) {
      return res.status(409).json({
        success: false,
        message: "Affiliation section already exists. Use update instead.",
        data: already,
      });
    }
    const payload = buildAffiliationPayload(req, null);
    const doc = await Affiliation.create(payload);
    return res.status(201).json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAffiliation = async (req, res) => {
  try {
    const existingDoc = await Affiliation.findById(req.params.id);
    if (!existingDoc)
      return res.status(404).json({ success: false, message: "Not found" });

    const payload = buildAffiliationPayload(req, existingDoc);
    const updated = await Affiliation.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true },
    );
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAffiliation = async (req, res) => {
  try {
    const doc = await Affiliation.findById(req.params.id);
    if (!doc)
      return res.status(404).json({ success: false, message: "Not found" });

    deleteFileIfExists(doc.heroImage);
    deleteFileIfExists(doc.boardCertificateImage);
    deleteFileIfExists(doc.iyfLogoImage);
    (doc.galleryImages || []).forEach(deleteFileIfExists);
    (doc.rysImages || []).forEach((r) => deleteFileIfExists(r.image));
    (doc.certs || []).forEach((c) => deleteFileIfExists(c.image));

    await Affiliation.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
