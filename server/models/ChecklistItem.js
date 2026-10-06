const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    checked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChecklistItem", checklistItemSchema);
