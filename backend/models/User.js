const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
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
  },
  bio: { type: String, default: "" },
  foto: { type: String, default: "default-avatar.png" }
}, { timestamps: true });

// Antes de salvar, aplica hash na senha
UserSchema.pre("save", async function(next) {
  if (!this.isModified("senha")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senha no login
UserSchema.methods.compararSenha = async function(senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model("User", UserSchema);
