const mongoose = require("mongoose");

/* SUB SCHEMAS */
const BodyPlaneSchema = new mongoose.Schema({
  label: String,
  listItem: String,
});

const CampusFacilitySchema = new mongoose.Schema({
  bold: String,
  text: String,
});

const PromoCardSchema = new mongoose.Schema({
  title: String,
  text: String,
  link: String,
});

const JourneySchema = new mongoose.Schema({
  text: String,
});

/* MAIN SCHEMA */
const AymFullPageSchema = new mongoose.Schema(
  {
    /* ALIGNMENT */
    alignTitle: String,
    salutation: String,
    alignPara1: String,
    alignPara2: String,
    alignPara3: String,
    planesPara: String,

    highlight1: String,
    highlight2: String,

    bodyPlanes: [BodyPlaneSchema],

    bodyPlanesImage: String,
    bodyPlanesImageAlt: String,

    outdoorImage: String,
    outdoorImageAlt: String,
    outdoorCaption: String,

    /* CAMPUS */
    campusTitle: String,
    campusFacilities: [CampusFacilitySchema],

    promoCard1: PromoCardSchema,
    promoCard2: PromoCardSchema,

    /* CTA */
    ctaHeading: String,
    ctaSubtext: String,
    whatsappLink: String,

    masterQuote: String,
    masterAttrib: String,

    journeyParas: [JourneySchema],

    namesteText: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AymFullPage", AymFullPageSchema);