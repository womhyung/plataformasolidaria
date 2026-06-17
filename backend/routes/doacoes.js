const express = require("express");
const router = express.Router();
const Doacao = require("../models/Doacao");
const autenticarToken = require("../middleware/auth");
const User = require("../models/User");

// CREATE - inserir nova doação (vinculada ao usuário logado)
router.post("/", autenticarToken, async (req, res) => {
  try {
    const { alimento, quantidade, validade, localizacao, categoria, status } = req.body;

    // validação simples
    if (!alimento || !quantidade || !localizacao || !categoria) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const usuario = await User.findById(req.user.id);

   const novaDoacao = await Doacao.create({
    nomeDoador: "TESTE",
    alimento,
    quantidade,
    validade,
    localizacao,
    categoria,
    status: status || "pendente"
  });

    res.status(201).json(novaDoacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// READ - listar todas as doações (visão geral)
router.get("/", async (req, res) => {
  try {
    const doacoes = await Doacao.find();
    res.json(doacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - listar apenas as doações do usuário logado
router.get("/minhas", autenticarToken, async (req, res) => {
  try {
    const doacoes = await Doacao.find({ nomeDoador: req.user.nome });
    res.json(doacoes);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar doações ❌" });
  }
});

// UPDATE - atualizar doação por ID
router.put("/:id", autenticarToken, async (req, res) => {
  try {
    const atualizada = await Doacao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizada) {
      return res.status(404).json({ message: "Doação não encontrada" });
    }
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - excluir doação por ID
router.delete("/:id", autenticarToken, async (req, res) => {
  try {
    const deletada = await Doacao.findByIdAndDelete(req.params.id);
    if (!deletada) {
      return res.status(404).json({ message: "Doação não encontrada" });
    }
    res.json({ message: "Doação excluída com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
