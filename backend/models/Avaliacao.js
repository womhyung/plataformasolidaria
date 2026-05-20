const mongoose = require("mongoose");

const avaliacaoSchema = new mongoose.Schema({
  instituicao: { type: String, required: true, trim: true },
  feedback: { type: String, required: true, trim: true },
  dataRegistro: { type: Date, default: Date.now }
});

// Exporta o model
module.exports = mongoose.model("Avaliacao", avaliacaoSchema);
