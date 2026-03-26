const mongoose = require("mongoose");

const ImageSchema = {
  image: String,
};

const AccredBadgeSchema = new mongoose.Schema({
  label: String,
  imgUrl: String,
  image: String,
});

const CourseCardSchema = new mongoose.Schema({
  hours: String,
  title: String,
  desc: String,
  linkLabel: String,
  href: String,
  imgUrl: String,
  image: String,
});

const QuoteCardSchema = new mongoose.Schema({
  quote: String,
  imgAlt: String,
  imgUrl: String,
  image: String,
});

const LocationSchema = new mongoose.Schema({
  name: String,
  desc: String,
});

const YogaTTCIndiaSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // HERO
    heroImage: String,
    heroImgAlt: String,

    heroTitle: String,
    heroSubTitle: String,

    // TEXT CONTENT
    introPara: String,
    whoWeArePara: String,
    yytPara: String,
    whyAYMPara1: String,
    whyAYMPara2: String,
    whyAYMPara3: String,
    rishikeshDetailPara: String,
    goaDetailPara: String,

    // ARRAYS
    introParagraphs: [String],
    whyAYMParagraphs: [String],
    rishikeshParagraphs: [String],
    goaParagraphs: [String],

    arrivalList: [String],
    feeList: [String],

    // SECTIONS
    accredBadges: [AccredBadgeSchema],
    courseCards: [CourseCardSchema],
    quoteCards: [QuoteCardSchema],
    locations: [LocationSchema],

    // TITLES
    whoWeAreTitle: String,
    yytTitle: String,
    rishikeshTitle: String,
    goaTitle: String,
    whyAYMTitle: String,
    arrivalTitle: String,
    feeTitle: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("YogaTTCIndia", YogaTTCIndiaSchema);