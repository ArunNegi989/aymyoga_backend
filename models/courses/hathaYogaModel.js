const mongoose = require("mongoose");

const certCardSchema = new mongoose.Schema({
  hours: String,
  sub: String,
  href: String,
  imgUrl: String,
  image: String,
});

const whatCardSchema = new mongoose.Schema({
  icon:  String,
  title: String,
  desc:  String,
});

const hathaYogaSchema = new mongoose.Schema(
  {
    slug:   String,
    status: String,

    /* ─── Hero ─── */
    heroImgAlt: String,
    heroImage:  String,

    /* ─── Intro ─── */
    introSectionTitle: String,
    introSideImgAlt:   String,
    introSideImage:    String,

    /* ─── What is Hatha ─── */
    whatSuperLabel: String,
    whatTitle:      String,

    /* ─── Benefits ─── */
    benefitsSuperLabel:  String,
    benefitsTitle:       String,
    benefitsSideImgAlt:  String,
    benefitsSideImage:   String,
    pullQuote:           String,

    /* ─── Certification ─── */
    certSuperLabel: String,
    certTitle:      String,

    /* ─── Ashram ─── */
    ashramSuperLabel: String,
    ashramTitle:      String,
    ashramImgAlt:     String,
    ashramImage:      String,

    /* ─── Curriculum ─── */
    curriculumSuperLabel: String,
    curriculumTitle:      String,

    /* ─── Pricing / Enrolment ─── */
    pricingSuperLabel:    String,
    pricingTitle:         String,
    pricingIntroPara:     String,
    registrationFormLink: String,
    tableNote:            String,
    joinBtnLabel:         String,
    joinBtnHref:          String,

    /* ─── Footer CTA ─── */
    footerTitle:      String,
    footerSubtitle:   String,
    applyBtnLabel:    String,
    applyBtnHref:     String,
    contactBtnLabel:  String,
    contactEmail:     String,

    /* ─── Arrays ─── */
    introParagraphs:     [String],
    whatParagraphs:      [String],
    ashramParagraphs:    [String],
    programmeParagraphs: [String],
    certParagraphs:      [String],   
    accreditations:      [String],
    benefitsList:        [String],
    courseDetailsList:   [String],

    /* ─── Rich-text singles ─── */
    benefitsIntroPara:    String,
    pricingProgrammePara: String,

    /* ─── Backward compat ─── */
    certPara: String,

    /* ─── Sub-docs ─── */
    certCards: [certCardSchema],

    /* ══════════════════════════════════════════════
       NEW FIELDS  (static content made editable)
    ══════════════════════════════════════════════ */

    courseInfoTitle:       String,   
    courseDuration:        String,  
    courseLevel:           String,   
    courseCertLabel:       String,  
    courseYogaStyle:       String,  
    courseYogaStyleSub:    String,   
    courseLanguage:        String,   
    courseDates:           String,   

    /* Premium Seat Booking section */
    seatSectionTag:      String,  
    seatSectionTitle:    String,   
    seatSectionSubtitle: String,   
    seatDurationLocation: String,  

    /* Programme section (was fully hardcoded) */
    programmeSuperLabel: String,   
    programmeTitle:      String,  

    /* What-section feature cards */
    whatCards: [whatCardSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("HathaYoga", hathaYogaSchema);