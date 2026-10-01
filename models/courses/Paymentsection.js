const mongoose = require("mongoose");

const str = (def = "") => ({ type: String, default: def, trim: true });

const kvSchema = new mongoose.Schema(
  { label: str(), value: str() },
  { _id: false }
);

const paypalOptionSchema = new mongoose.Schema(
  { icon: str(), title: str(), link: str() },
  { _id: false }
);

const cardSchema = new mongoose.Schema(
  { badge: str(), title: str(), desc: str(), link: str() },
  { _id: false }
);

const bankSchema = new mongoose.Schema(
  { title: str(), fields: { type: [kvSchema], default: [] } },
  { _id: false }
);

const arrivalSchema = new mongoose.Schema(
  { method: str(), charge: str() },
  { _id: false }
);

const policySchema = new mongoose.Schema(
  { icon: str(), title: str(), text: str() },
  { _id: false }
);

const paymentSectionSchema = new mongoose.Schema(
  {
    /* ── Hero ── */
    heroImage: str(),
    heroImageAlt: str("Yoga Students Group"),

    /* ── Header ── */
    superTitle: str(),
    mainTitle: str(),
    headerDesc: { type: String, default: "" }, // rich text (HTML)

    /* ── Registration fee ── */
    regFeeTitle: str(),
    regFeeHighlight: str(),
    regFeeText: { type: String, default: "" },

    /* ── PayPal ── */
    paypalTitle: str(),
    paypalLink: str(),
    paypalLogo: str(),
    paypalOptions: { type: [paypalOptionSchema], default: [] },

    /* ── UPI ── */
    upiTitle: str(),
    upiQr1: str(),
    upiQr1Alt: str(),
    upiId: str(),
    upiCopyLabel: str("Copy UPI ID"),
    upiQr2: str(),
    upiQr2Alt: str(),
    upiId2: str(),
    upiCopyLabel2: str("Copy UPI ID"),

    /* ── Debit / Credit cards ── */
    cardsTitle: str(),
    cardsBtnLabel: str("Book Now"),
    cards: { type: [cardSchema], default: [] },

    /* ── Bank transfer ── */
    bankTitle: str(),
    banks: { type: [bankSchema], default: [] },
    gstNoteOnline: { type: String, default: "" },

    /* ── Western Union ── */
    westernTitle: str(),
    westernText: { type: String, default: "" },
    westernSendTo: str(),
    westernAddress: str(),
    westernNote: { type: String, default: "" },

    /* ── Arrival payment ── */
    arrivalTitle: str(),
    arrivalIntro: { type: String, default: "" },
    arrivalMethods: { type: [arrivalSchema], default: [] },
    gstNoteArrival: { type: String, default: "" },

    /* ── Policies ── */
    policies: { type: [policySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentSection", paymentSectionSchema);