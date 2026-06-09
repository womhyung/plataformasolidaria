const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const autenticarToken = require("../middleware/auth");

// LOGIN - qualquer usuário pode acessar
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Busca usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas ❌" });
    }

    // Usa método compararSenha do modelo
    const senhaValida = await user.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Credenciais inválidas ❌" });
    }

    // Gera token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "segredo",
      { expiresIn: "1h" }
    );

    // Retorna dados completos do usuário
    res.json({
      message: "Login bem-sucedido ✅",
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        bio: user.bio,
        foto: user.foto
      },
      token
    });
  } catch (err) {
    console.error("❌ Erro no login:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// REGISTER - apenas admin pode criar novos usuários
router.post("/register", autenticarToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Somente administradores podem criar usuários" });
    }

    const { nome, email, senha, role, bio, foto } = req.body;

    // Verifica se já existe usuário com esse email
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "Email já cadastrado ❌" });
    }

    // Cria novo usuário (hash da senha é feito no pre-save do modelo User)
    const novoUsuario = new User({ nome, email, senha, role, bio, foto });
    await novoUsuario.save();

    res.status(201).json({ 
      message: "Usuário cadastrado com sucesso ✅", 
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        role: novoUsuario.role,
        bio: novoUsuario.bio,
        foto: novoUsuario.foto
      }
    });
  } catch (err) {
    console.error("❌ Erro no cadastro:", err);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

module.exports = router;
