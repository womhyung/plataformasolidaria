const jwt = require("jsonwebtoken");

// Middleware para autenticar token JWT
function autenticarToken(req, res, next) {
  // Pega o cabeçalho Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Se não houver token, bloqueia
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido ❌" });
  }

  try {
    // Verifica se o token é válido usando o segredo do .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Salva os dados do usuário no objeto req
    req.user = decoded;

    // Continua para a rota
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido ❌" });
  }
}

module.exports = autenticarToken;
