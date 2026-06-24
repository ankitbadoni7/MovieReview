const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportTitle: { type: String, required: true },
  category: { type: String, required: true },
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);
