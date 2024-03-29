const shortid = require("shortid");
const URL = require("../models/urls");

const handleCreateUser = async (req, res) => {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url not found" });
  const shortId = shortid();
  await URL.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitedHistory: [],
  });
  return res.json({ id: shortId });
};

const handleShowUser = async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitedHistory: { timestamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectUrl);
};

const handleGetAnalytics = async (req, res) => {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitedHistory.length,
    analytics: result.visitedHistory,
  });
};

module.exports = {
  handleCreateUser,
  handleShowUser,
  handleGetAnalytics,
};
