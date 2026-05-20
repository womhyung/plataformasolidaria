const express = require("express");
const router = express.Router();
const Entrega = require("../models/Entrega");

// CREATE - inserir nova entrega
router.post("/", async (req, res) => {
  try {
    const novaEntrega = new Entrega(req.body);
    await novaEntrega.save();
    res.status(201).json(novaEntrega);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ - listar todas as entregas
router.get("/", async (req, res) => {
  try {
    const entregas = await Entrega.find().populate("doacaoId"); 
    res.json(entregas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - atualizar entrega por ID
router.put("/:id", async (req, res) => {
  try {
    const atualizada = await Entrega.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!atualizada) {
      return res.status(404).json({ message: "Entrega não encontrada" });
    }
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - excluir entrega por ID
router.delete("/:id", async (req, res) => {
  try {
    const deletada = await Entrega.findByIdAndDelete(req.params.id);
    if (!deletada) {
      return res.status(404).json({ message: "Entrega não encontrada" });
    }
    res.json({ message: "Entrega excluída com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
