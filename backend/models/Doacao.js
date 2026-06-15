const mongoose = require("mongoose");

const DoacaoSchema = new mongoose.Schema({
  nomeDoador: { type: String, required: true },
  alimento: { type: String, required: true },
  quantidade: { type: Number, required: true },
  validade: { type: String },
  localizacao: { type: String },
  categoria: { type: String, required: true }, // usado nos gráficos
  status: { type: String, default: "pendente" } // usado nos gráficos
}, { timestamps: true }); // cria automaticamente createdAt

module.exports = mongoose.model("Doacao", DoacaoSchema);
