const mongoose = require("mongoose");

const certCardSchema = new mongoose.Schema({
  hours: String,
  sub: String,
  href: String,
  imgUrl: String,
  image: String,
});

const hathaYogaSchema = new mongoose.Schema(
  {
    slug: String,
    status: String,

    heroImgAlt: String,
    heroImage: String,

    introSectionTitle: String,
    introSideImgAlt: String,
    introSideImage: String,

    whatSuperLabel: String,
    whatTitle: String,

    benefitsSuperLabel: String,
    benefitsTitle: String,
    benefitsSideImgAlt: String,
    benefitsSideImage: String,
    pullQuote: String,

    certSuperLabel: String,
    certTitle: String,

    ashramSuperLabel: String,
    ashramTitle: String,
    ashramImgAlt: String,
    ashramImage: String,

    curriculumSuperLabel: String,
    curriculumTitle: String,

    pricingSuperLabel: String,
    pricingTitle: String,
    pricingIntroPara: String,
    registrationFormLink: String,
    tableNote: String,
    joinBtnLabel: String,
    joinBtnHref: String,

    footerTitle: String,
    footerSubtitle: String,
    applyBtnLabel: String,
    applyBtnHref: String,
    contactBtnLabel: String,
    contactEmail: String,

    // arrays
    introParagraphs: [String],
    whatParagraphs: [String],
    ashramParagraphs: [String],
    programmeParagraphs: [String],

    accreditations: [String],
    benefitsList: [String],
    courseDetailsList: [String],

    benefitsIntroPara: String,
    certPara: String,
    pricingProgrammePara: String,

    certCards: [certCardSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("HathaYoga", hathaYogaSchema);