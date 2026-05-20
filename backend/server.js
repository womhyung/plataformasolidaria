// Importações
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // para usar variáveis de ambiente

const app = express();
app.use(express.json());

// Configuração de CORS — libera acesso para qualquer origem
app.use(cors());

// Conexão com MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("❌ Erro de conexão:", err));

// Rota raiz opcional (teste rápido)
app.get("/", (req, res) => {
  res.send("API Plataforma Solidária está rodando 🚀");
});

// Rota de saúde para testar conexão
app.get("/ping", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.json({ status: "ok", message: "Banco conectado ✅" });
  } else {
    res.status(500).json({ status: "error", message: "Banco não conectado ❌" });
  }
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
