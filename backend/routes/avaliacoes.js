const express = require("express");
const router = express.Router();
const Avaliacao = require("../models/Avaliacao");

// CREATE - inserir nova avaliação
router.post("/", async (req, res) => {
  try {
    const novaAvaliacao = new Avaliacao(req.body);
    await novaAvaliacao.save();
    res.status(201).json(novaAvaliacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ - listar todas as avaliações
router.get("/", async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find();
    res.json(avaliacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - atualizar avaliação por ID
router.put("/:id", async (req, res) => {
  try {
    const atualizada = await Avaliacao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizada) {
      return res.status(404).json({ message: "Avaliação não encontrada" });
    }
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - excluir avaliação por ID
router.delete("/:id", async (req, res) => {
  try {
    const deletada = await Avaliacao.findByIdAndDelete(req.params.id);
    if (!deletada) {
      return res.status(404).json({ message: "Avaliação não encontrada" });
    }
    res.json({ message: "Avaliação excluída com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
