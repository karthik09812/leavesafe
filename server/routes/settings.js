const router = require("express").Router();
const auth = require("../middleware/auth");
const Settings = require("../models/Settings");

router.use(auth);

// GET /api/settings   (creates default settings on first visit)
router.get("/", async (req, res) => {
  let settings = await Settings.findOne({ user: req.userId });
  if (!settings) settings = await Settings.create({ user: req.userId });
  res.json(settings);
});

// PUT /api/settings   { homeLat, homeLng, radius }
router.put("/", async (req, res) => {
  const { homeLat, homeLng, radius } = req.body;
  if (homeLat == null || homeLng == null)
    return res.status(400).json({ message: "Home location is required" });

  const settings = await Settings.findOneAndUpdate(
    { user: req.userId },
    { homeLat, homeLng, radius },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(settings);
});

module.exports = router;
