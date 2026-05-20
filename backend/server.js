// Importações
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // para usar variáveis de ambiente

const app = express();
app.use(express.json());

// Configuração de CORS — importante para GitHub Pages e Render
app.use(
  cors({
    origin: [
      "https://womhyung.github.io", // frontend no GitHub Pages
      "https://plataforma-solidaria.onrender.com" // backend no Render
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Conexão com MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("❌ Erro de conexão:", err));

// Rota raiz opcional
app.get("/", (req, res) => {
  res.send("API Plataforma Solidária está rodando 🚀");
});

// Rotas CRUD
app.use("/doacoes", require("./routes/doacoes"));
app.use("/instituicoes", require("./routes/instituicoes"));
app.use("/familias", require("./routes/familias"));
app.use("/entregas", require("./routes/entregas"));
app.use("/avaliacoes", require("./routes/avaliacoes"));

// Porta dinâmica para Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
);
