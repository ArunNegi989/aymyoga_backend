const mongoose = require("mongoose");

const Yoga200Content1Schema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    pageMainH1: String,
    heroImgAlt: String,
    heroImage: String,

    introPara1: String,
    introPara2: String,
    introPara3: String,
    introPara4: String,

    stats: [
      {
        icon: String,
        value: String,
        title: String,
        desc: String,
      },
    ],

    aimsH3: String,
    aimsIntro: String,
    aimsOutro: String,
    aimsKeyObjLabel: String,
    aimsBullets: [String],

    overview: {
      h2: String,
      certName: String,
      level: String,
      eligibility: String,
      minAge: String,
      credits: String,
      language: String,
    },

    upcomingDatesH2: String,
    upcomingDatesSubtext: String,

    feeIncludedTitle: String,
    feeNotIncludedTitle: String,
    includedFee: [String],
    notIncludedFee: [String],

    syllabusH3: String,
    syllabusIntro: String,

    modules: [
      {
        title: String,
        intro: String,
        items: [String],
        body: String,
      },
    ],

    ashtanga: {
      h2: String,
      subtitle: String,
      desc: String,
      image: String,
      imgAlt: String,
      pills: [String],
    },

    primary: {
      h3: String,
      subtext: String,
      intro: String,
      foundationItems: [String],
      weekGrid: Array,
    },

   hatha: {
  h2: String,
  subtitle: String,
  desc: String,
  image: String,
  imgAlt: String,
  pills: [String],
  asanas: [
    {
      n: String,        // ← was being cast to Number, force it to String
      name: String,
      sub: String,
      filter: String,
    },
  ],
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Yoga200Content1", Yoga200Content1Schema);