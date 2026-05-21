const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["admin", "ong", "beneficiario"], 
    default: "ong" 
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
