const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    /* CLASS SIZE */
    classSizeSuperLabel: { type: String, required: true },
    classSizeTitle: { type: String, required: true },
    classSizeWelcomeText: { type: String, required: true },
    classSizeHighlight: { type: String, required: true },
    classSizePara: { type: String, required: true },
    classSizeImage: { type: String, required: true },

    /* CAMPUS */
    campusSuperLabel: { type: String, required: true },
    campusTitle: { type: String, required: true },
    campusHighlight: { type: String, required: true },
    campusPara: { type: String, required: true },
    campusImages: [{ type: String, required: true }],

    /* AMENITIES */
    amenitiesSuperLabel: { type: String, required: true },
    amenitiesTitle: { type: String, required: true },
    amenitiesMainPara: { type: String, required: true },
    amenitiesSubLabel: String,
    amenities: [{ type: String, required: true }],
    amenityMosaicTag: String,
    amenityImage: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassCampusAmenities", schema);