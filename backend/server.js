// Importações
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config(); // para usar variáveis de ambiente

const app = express();

// Middleware
const autenticarToken = require("./middleware/auth");

// Configuração de CORS — libera acesso para qualquer origem
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Conectado ao MongoDB");
  criarAdmin(); // cria admin ao iniciar
}).catch(err => console.error("❌ Erro ao conectar:", err));

const User = require("./models/User");

// Função para criar admin automaticamente
async function criarAdmin() {
  try {
    const existe = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existe) {
      const senhaCriptografada = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({
        nome: process.env.ADMIN_NAME || "Administrador", // nome obrigatório
        email: process.env.ADMIN_EMAIL,
        senha: senhaCriptografada,
        role: "admin"
      });
      console.log("✅ Usuário administrador criado via .env");
    } else {
      console.log("ℹ️ Usuário administrador já existe");
    }
  } catch (err) {
    console.error("❌ Erro ao criar admin:", err);
  }
}

// Rotas
app.use("/auth", require("./routes/auth"));
app.use("/doacoes", require("./routes/doacoes"));
app.use("/instituicoes", require("./routes/instituicoes"));
app.use("/familias", require("./routes/familias"));
app.use("/entregas", require("./routes/entregas"));
app.use("/avaliacoes", require("./routes/avaliacoes"));
app.use("/usuarios", require("./routes/usuarios"));


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

// Porta dinâmica para Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
);
