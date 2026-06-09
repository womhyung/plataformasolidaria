const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // se quiser gerar token
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

    // Gera token JWT (opcional, mas recomendado)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "segredo",
      { expiresIn: "1h" }
    );

    // Retorna sucesso e dados do usuário
    res.json({ 
      message: "Login bem-sucedido ✅", 
      role: user.role,
      email: user.email,
      token
    });

  } catch (err) {
    console.error("❌ Erro no login:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// Rota de cadastro
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    // Verifica se já existe usuário com esse email
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "Email já cadastrado ❌" });
    }

    // Criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria novo usuário
    const novoUsuario = new User({ nome, email, senha: senhaHash, role });
    await novoUsuario.save();

    res.status(201).json({ message: "Usuário cadastrado com sucesso ✅" });
  } catch (err) {
    console.error("❌ Erro no cadastro:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

module.exports = router;
