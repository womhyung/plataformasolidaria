const express = require("express");
const router = express.Router();
const Instituicao = require("../models/Instituicao");

// CREATE - inserir nova instituição
router.post("/", async (req, res) => {
  try {
    const novaInstituicao = new Instituicao(req.body);
    await novaInstituicao.save();
    res.status(201).json(novaInstituicao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ - listar todas as instituições
router.get("/", async (req, res) => {
  try {
    const instituicoes = await Instituicao.find();
    res.json(instituicoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - atualizar instituição por ID
router.put("/:id", async (req, res) => {
  try {
    const atualizada = await Instituicao.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizada) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - excluir instituição por ID
router.delete("/:id", async (req, res) => {
  try {
    const deletada = await Instituicao.findByIdAndDelete(req.params.id);
    if (!deletada) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }
    res.json({ message: "Instituição excluída com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
