const mongoose = require("mongoose");
const { Schema } = mongoose;

const SoundHealingSeatSchema = new Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    usdFee: { type: String, required: true, trim: true },
    inrFee: { type: String, required: true, trim: true },

    dormPrice: { type: Number, required: true },
    inrDormPrice: { type: Number, required: true },

    twinPrice: { type: Number, required: true },
    inrTwinPrice: { type: Number, required: true },

    privatePrice: { type: Number, required: true },
    inrPrivatePrice: { type: Number, required: true },

    totalSeats: { type: Number, required: true, min: 1 },
    bookedSeats: { type: Number, required: true, default: 0, min: 0 },

    note: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SoundHealingSeat", SoundHealingSeatSchema);