const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Rota de login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Busca usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas ❌" });
    }

    // Compara senha informada com a criptografada
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Credenciais inválidas ❌" });
    }

    // Retorna sucesso e role do usuário
    res.json({ 
      message: "Login bem-sucedido ✅", 
      role: user.role,
      email: user.email 
    });

  } catch (err) {
    console.error("❌ Erro no login:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

module.exports = router;
