const mongoose = require("mongoose");

const goaYogaSchema = new mongoose.Schema(
{
  status: String,

  heroImage: String,
  heroAlt: String,

  introSuperLabel: String,
  introHeading: String,
  introLocation: String,
  introBestTime: String,
  introParagraphs: [String],

  introBigImage: String,
  introSmallImage: String,

  programsSuperLabel: String,
  programsSectionTitle: String,
  programsSubNote: String,

  coreProgramsSectionHeading: String,
  specialProgramsSectionHeading: String,

  arambolDesc: String,

  corePrograms: [
    {
      hrs: String,
      tag: String,
      subHeading: String,
      desc: String,
      linkText: String,
      linkHref: String,
    }
  ],

  specialPrograms: [
    { title: String, desc: String }
  ],

  beachImages: [
    { id: String, imgUrl: String }
  ],

  highlightsSuperLabel: String,
  highlightsSectionTitle: String,
  highlightsSubNote: String,

  highlights: [
    { num: String, title: String, body: String }
  ],

  bestTimeHeading: String,
  bestTimeText: String,

  curriculumSuperLabel: String,
  curriculumSectionTitle: String,

  learnings: [String],

  focusSectionTitle: String,
  focusBodyText: String,
  mainFocus: [String],

  scheduleSuperLabel: String,
  scheduleSectionTitle: String,
  scheduleImage: String,
  scheduleImageAlt: String,

  scheduleRows: [
    { time: String, activity: String }
  ],

  batchesSuperLabel: String,
  batchesSectionTitle: String,
  batchesNote: String,
  batchesNoteEmail: String,
  batchesAirportNote: String,

  gallerySuperLabel: String,
  gallerySectionTitle: String,

  campusImages: [
    { id: String, label: String, imgUrl: String }
  ],

  address1: String,
  address2: String,
  address3: String,
  phone1: String,
  phone2: String,

  reachHeading: String,
  reachViaAir: String,

  applyEmail: String,
  applyDepositAmount: String,
  refundPolicy: String,
  rulesHref: String,

  applyFields: [
    { label: String }
  ],

  footerCtaTitle: String,
  footerCtaSub: String,
  footerCtaDatesHref: String,
  footerCtaEmailHref: String,
},
{ timestamps: true }
);

module.exports = mongoose.model("GoaYogaPage", goaYogaSchema);