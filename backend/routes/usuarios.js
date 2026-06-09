const express = require("express");
const router = express.Router();
const User = require("../models/User");
const autenticarToken = require("../middleware/auth");

// CREATE - apenas admin pode criar novos usuários
router.post("/", autenticarToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Somente administradores podem criar usuários" });
    }

    const novoUsuario = new User({
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha, // lembre-se de aplicar hash no modelo User
      role: req.body.role,
      bio: req.body.bio,
      foto: req.body.foto
    });

    await novoUsuario.save();
    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ - obter dados do usuário logado
router.get("/me", autenticarToken, async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id).select("-senha");
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - editar perfil do usuário
router.put("/:id", autenticarToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Não autorizado" });
    }

    const atualizado = await User.findByIdAndUpdate(
      req.params.id,
      {
        nome: req.body.nome,
        bio: req.body.bio,
        foto: req.body.foto
      },
      { new: true }
    ).select("-senha");

    if (!atualizado) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - excluir usuário
router.delete("/:id", autenticarToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Não autorizado" });
    }

    const deletado = await User.findByIdAndDelete(req.params.id);
    if (!deletado) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json({ message: "Usuário excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
