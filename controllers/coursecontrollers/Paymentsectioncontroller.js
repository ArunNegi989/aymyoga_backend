const fs = require("fs");
const path = require("path");
const PaymentSection = require("../../models/courses/Paymentsection");

/* ─────────── Field lists (must match the admin form) ─────────── */
const TEXT_FIELDS = [
  "heroImageAlt",
  "superTitle", "mainTitle", "headerDesc",
  "regFeeTitle", "regFeeHighlight", "regFeeText",
  "paypalTitle", "paypalLink",
  "upiTitle", "upiId", "upiCopyLabel", "upiQr1Alt",
  "upiId2", "upiCopyLabel2", "upiQr2Alt",
  "cardsTitle", "cardsBtnLabel",
  "bankTitle", "gstNoteOnline",
  "westernTitle", "westernText", "westernSendTo", "westernAddress", "westernNote",
  "arrivalTitle", "arrivalIntro", "gstNoteArrival",
];

const ARRAY_FIELDS = ["paypalOptions", "cards", "banks", "arrivalMethods", "policies"];

const IMAGE_FIELDS = ["heroImage", "paypalLogo", "upiQr1", "upiQr2"];

/* ─────────── Helpers ─────────── */

// multipart can sometimes give an array if a key is sent twice → always take one value
const getSingle = (v) => (Array.isArray(v) ? v[v.length - 1] : v);

const parseArray = (v) => {
  const val = getSingle(v);
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// multer (upload.fields) → req.files = { fieldName: [file] }
const getFilePath = (req, field) => {
  const f = req.files?.[field]?.[0];
  return f ? `/uploads/${f.filename}` : null;
};

// remove old image from disk (ignore errors)
const removeFile = (filePath) => {
  if (!filePath || filePath.startsWith("http")) return;
  const abs = path.join(process.cwd(), filePath.replace(/^\//, ""));
  fs.unlink(abs, () => {});
};

// build the update/create payload from req
const buildPayload = (req, existing = null) => {
  const payload = {};

  TEXT_FIELDS.forEach((k) => {
    if (req.body[k] !== undefined) payload[k] = getSingle(req.body[k]);
  });

  ARRAY_FIELDS.forEach((k) => {
    if (req.body[k] !== undefined) payload[k] = parseArray(req.body[k]);
  });

  IMAGE_FIELDS.forEach((k) => {
    const newPath = getFilePath(req, k);
    if (newPath) {
      payload[k] = newPath;
      if (existing?.[k]) removeFile(existing[k]); // replace → delete old file
    }
  });

  return payload;
};

/* ─────────── Controllers ─────────── */

// GET /api/payment-section  (public – returns the single document)
exports.getPaymentSection = async (req, res) => {
  try {
    const doc = await PaymentSection.findOne().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/payment-section/:id
exports.getPaymentSectionById = async (req, res) => {
  try {
    const doc = await PaymentSection.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Payment section not found" });
    }
    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/payment-section  (singleton – only one allowed)
exports.createPaymentSection = async (req, res) => {
  try {
    const exists = await PaymentSection.findOne();
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Payment section already exists. Please edit it instead.",
      });
    }

    const doc = await PaymentSection.create(buildPayload(req));
    return res.status(201).json({
      success: true,
      message: "Payment section created successfully",
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/payment-section/:id
exports.updatePaymentSection = async (req, res) => {
  try {
    const doc = await PaymentSection.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Payment section not found" });
    }

    doc.set(buildPayload(req, doc));
    await doc.save();

    return res.status(200).json({
      success: true,
      message: "Payment section updated successfully",
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/payment-section/:id
exports.deletePaymentSection = async (req, res) => {
  try {
    const doc = await PaymentSection.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Payment section not found" });
    }

    IMAGE_FIELDS.forEach((k) => removeFile(doc[k]));
    await doc.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Payment section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};