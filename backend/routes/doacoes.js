const express = require("express");
const router = express.Router();
const Doacao = require("../models/Doacao");

// CREATE - inserir nova doação
router.post("/", async (req, res) => {
  try {
    const novaDoacao = new Doacao(req.body);
    await novaDoacao.save();
    res.status(201).json(novaDoacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ - listar todas as doações
router.get("/", async (req, res) => {
  try {
    const doacoes = await Doacao.find();
    res.json(doacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - atualizar doação por ID
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
