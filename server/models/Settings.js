const mongoose = require("mongoose");

// One settings document per user: where "home" is and how big the boundary is
const settingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    homeLat: { type: Number, default: null },
    homeLng: { type: Number, default: null },
    radius: { type: Number, default: 100, min: 30, max: 1000 }, // metres
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
