const mongoose = require("mongoose");

const doacaoSchema = new mongoose.Schema({
  nomeDoador: { type: String, required: true, trim: true },
  alimento: { type: String, required: true, trim: true },
  quantidade: { type: Number, required: true, min: 1 },
  validade: { type: String, required: true, trim: true },
  localizacao: { type: String, required: true, trim: true },
  dataRegistro: { type: Date, default: Date.now }
});

// Exporta o model
module.exports = mongoose.model("Doacao", doacaoSchema);
