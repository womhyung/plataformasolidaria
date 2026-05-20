const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email, senha });
  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas ❌" });
  }
  res.json({ message: "Login bem-sucedido ✅", role: user.role });
});

module.exports = router;
