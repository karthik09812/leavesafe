const router = require("express").Router();
const auth = require("../middleware/auth");
const ChecklistItem = require("../models/ChecklistItem");

router.use(auth); // every checklist route needs login

// GET /api/checklist
router.get("/", async (req, res) => {
  const items = await ChecklistItem.find({ user: req.userId }).sort({ createdAt: 1 });
  res.json(items);
});

// POST /api/checklist   { name }
router.post("/", async (req, res) => {
  const name = (req.body.name || "").trim();
  if (!name) return res.status(400).json({ message: "Item name is required" });
  const item = await ChecklistItem.create({ user: req.userId, name });
  res.status(201).json(item);
});

// PATCH /api/checklist/reset   (untick everything, e.g. every morning)
router.patch("/reset", async (req, res) => {
  await ChecklistItem.updateMany({ user: req.userId }, { checked: false });
  res.json({ message: "Checklist reset" });
});

// PATCH /api/checklist/:id   { checked }
router.patch("/:id", async (req, res) => {
  const item = await ChecklistItem.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { checked: !!req.body.checked },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

// DELETE /api/checklist/:id
router.delete("/:id", async (req, res) => {
  const item = await ChecklistItem.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json({ message: "Item deleted" });
});

module.exports = router;
