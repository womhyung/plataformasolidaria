const express = require("express");
const router = express.Router();
const Familia = require("../models/Familia");

// CREATE - inserir nova família
router.post("/", async (req, res) => {
  try {
    const novaFamilia = new Familia(req.body);
    await novaFamilia.save();
    res.status(201).json(novaFamilia);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ - listar todas as famílias
router.get("/", async (req, res) => {
  try {
    const familias = await Familia.find();
    res.json(familias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - atualizar família por ID
router.put("/:id", async (req, res) => {
  try {
    const atualizada = await Familia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizada) {
      return res.status(404).json({ message: "Família não encontrada" });
    }
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - excluir família por ID
router.delete("/:id", async (req, res) => {
  try {
    const deletada = await Familia.findByIdAndDelete(req.params.id);
    if (!deletada) {
      return res.status(404).json({ message: "Família não encontrada" });
    }
    res.json({ message: "Família excluída com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
