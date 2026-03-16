const HomeAbout = require("../../models/homepage/HomeAbout");


// CREATE (only one allowed)
exports.createHomeAbout = async (req, res) => {
  try {

    const existing = await HomeAbout.findOne();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Home About already exists"
      });
    }

    const about = await HomeAbout.create(req.body);

    res.status(201).json({
      success: true,
      message: "Home About created successfully",
      data: about
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// GET

exports.getHomeAbout = async (req, res) => {
  try {

    const about = await HomeAbout.findOne();

    res.json({
      success: true,
      data: about
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// UPDATE

exports.updateHomeAbout = async (req, res) => {
  try {

    const about = await HomeAbout.findOneAndUpdate(
      {},
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Home About updated successfully",
      data: about
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// DELETE

exports.deleteHomeAbout = async (req, res) => {
  try {

    await HomeAbout.deleteOne({});

    res.json({
      success: true,
      message: "Home About deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};