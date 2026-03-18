const Model = require("../../models/homepage/ourMissionModel");

/* ═══════════════════════════════════════
   CREATE  —  save BOTH blocks at once
   POST /our-mission/add-our-mission
═══════════════════════════════════════ */
exports.create = async (req, res, next) => {
  try {
    const { missionBlock, whyBlock } = req.body;

    /* ── Basic validation ── */
    if (!missionBlock?.heading || !missionBlock?.paragraphs?.length) {
      return res.status(400).json({
        success: false,
        message: "missionBlock: heading and at least one paragraph are required",
      });
    }

    if (!whyBlock?.heading || !whyBlock?.paragraphs?.length) {
      return res.status(400).json({
        success: false,
        message: "whyBlock: heading and at least one paragraph are required",
      });
    }

    /* ── Only ONE document allowed ── */
    const existing = await Model.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "A record already exists. Please update or delete it before creating a new one.",
      });
    }

    const data = await Model.create({ missionBlock, whyBlock });

    res.status(201).json({
      success: true,
      message: "Both blocks created successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════
   GET ALL  (returns the single document)
   GET /our-mission/get-our-mission
═══════════════════════════════════════ */
exports.getAll = async (req, res, next) => {
  try {
    const data = await Model.find();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════
   GET ONE BY ID
   GET /our-mission/get-our-mission/:id
═══════════════════════════════════════ */
exports.getOne = async (req, res, next) => {
  try {
    const data = await Model.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════
   UPDATE  —  can update one or both blocks
   PUT /our-mission/update-our-mission/:id
═══════════════════════════════════════ */
exports.update = async (req, res, next) => {
  try {
    const existing = await Model.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    const { missionBlock, whyBlock } = req.body;

    /* ── Merge only provided fields ── */
    const updatePayload = {};

    if (missionBlock) {
      updatePayload.missionBlock = {
        ...existing.missionBlock.toObject(),
        ...missionBlock,
      };
    }

    if (whyBlock) {
      updatePayload.whyBlock = {
        ...existing.whyBlock.toObject(),
        ...whyBlock,
      };
    }

    const updated = await Model.findByIdAndUpdate(
      req.params.id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

/* ═══════════════════════════════════════
   DELETE
   DELETE /our-mission/delete-our-mission/:id
═══════════════════════════════════════ */
exports.remove = async (req, res, next) => {
  try {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};