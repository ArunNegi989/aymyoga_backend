const Banner = require("../../models/homepage/Banner");

/* CREATE BANNER */
exports.createBanner = async (req, res) => {
  try {
    const { bannerName, link } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const lastBanner = await Banner.findOne().sort({ order: -1 });

    const banner = await Banner.create({
      bannerName,
      link,
      image,
      order: lastBanner ? lastBanner.order + 1 : 1,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* GET ALL BANNERS */
exports.getAllBanners = async (req, res) => {
  try {

    // yaha change karna hai
    const banners = await Banner.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* GET SINGLE BANNER */
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* UPDATE BANNER */
exports.updateBanner = async (req, res) => {
  try {
    const { bannerName, link } = req.body;

    const updateData = {
      bannerName,
      link,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* DELETE BANNER */
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* UPDATE BANNER ORDER */
exports.updateBannerOrder = async (req, res) => {
  try {
    const { banners } = req.body; 
    // banners = [{id, order}]

    const bulkOps = banners.map((b) => ({
      updateOne: {
        filter: { _id: b.id },
        update: { order: b.order },
      },
    }));

    await Banner.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: "Banner order updated",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};