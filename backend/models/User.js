const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true }, // campo nome adicionado
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  role: { 
    type: String, 
    enum: [
      "admin", 
      "ong", 
      "beneficiario", 
      "doador", 
      "instituicao_parceira", 
      "instituicao_receptora"
    ], 
    default: "ong" 
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
