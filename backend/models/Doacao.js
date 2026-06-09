const express = require("express");
const router = express.Router();
const Doacao = require("../models/Doacao");
const autenticarToken = require("../middleware/auth");

// Rota para listar todas as doações do usuário logado
router.get("/minhas", autenticarToken, async (req, res) => {
  try {
    // Filtra pelo nome do usuário que vem do token JWT
    const doacoes = await Doacao.find({ nomeDoador: req.user.nome });
    res.json(doacoes);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar doações ❌" });
  }
});

// Rota para cadastrar nova doação
router.post("/", autenticarToken, async (req, res) => {
  try {
    const novaDoacao = await Doacao.create({
      nomeDoador: req.user.nome, // pega o nome do usuário do token
      alimento: req.body.alimento,
      quantidade: req.body.quantidade,
      validade: req.body.validade,
      localizacao: req.body.localizacao
    });
    res.status(201).json(novaDoacao);
  } catch (err) {
    res.status(500).json({ message: "Erro ao cadastrar doação ❌" });
  }
});

// (Opcional) rota para listar todas as doações do sistema
router.get("/", async (req, res) => {
  try {
    const doacoes = await Doacao.find();
    res.json(doacoes);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar todas as doações ❌" });
  }
});

module.exports = router;
