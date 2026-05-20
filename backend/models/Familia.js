const mongoose = require("mongoose");

const familiaSchema = new mongoose.Schema({
  nomeFamilia: { type: String, required: true, trim: true },
  endereco: { type: String, required: true, trim: true },
  membros: { type: Number, required: true, min: 1 }, // pelo menos 1 membro
  telefoneContato: { type: String, trim: true }, // opcional, útil para comunicação
  necessidadesEspecificas: { type: String, trim: true }, // opcional, ex: restrições alimentares
  dataRegistro: { type: Date, default: Date.now }
});

// Exporta o model
module.exports = mongoose.model("Familia", familiaSchema);
