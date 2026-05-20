const mongoose = require("mongoose");

const instituicaoSchema = new mongoose.Schema({
  nomeInstituicao: { type: String, required: true, trim: true },
  endereco: { type: String, required: true, trim: true },
  telefoneContato: { type: String, trim: true }, // opcional, para contato direto
  responsavel: { type: String, trim: true }, // opcional, nome do responsável pela instituição
  email: { type: String, trim: true }, // opcional, para comunicação oficial
  dataRegistro: { type: Date, default: Date.now }
});

// Exporta o model
module.exports = mongoose.model("Instituicao", instituicaoSchema);
