const mongoose = require("mongoose");

const entregaSchema = new mongoose.Schema({
  voluntario: { type: String, required: true, trim: true },
  familiaDestino: { type: String, trim: true }, // pode ser família
  instituicaoDestino: { type: String, trim: true }, // ou instituição
  doacaoId: { type: mongoose.Schema.Types.ObjectId, ref: "Doacao", required: true }, // vínculo com a doação

  // Lista de alimentos entregues
  itensEntregues: [
    {
      alimento: { type: String, required: true, trim: true },
      quantidade: { type: Number, required: true, min: 1 }
    }
  ],

  dataEntrega: { type: Date, default: Date.now }
});

// Exporta o model
module.exports = mongoose.model("Entrega", entregaSchema);
