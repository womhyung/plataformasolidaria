const API_URL = "https://plataformasolidaria.onrender.com";
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

// Função para alternar seções
function showSection(sectionId) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
  const sec = document.getElementById(sectionId);
  if (sec) sec.classList.add("active");
}

// Cadastro integrado ao backend
document.getElementById("formCadastro")?.addEventListener("submit", async e => {
  e.preventDefault();
  const tipo = e.target.querySelector("select[name='tipo']").value;
  const nome = e.target.querySelector("input[name='nome']").value;
  const email = e.target.querySelector("input[name='email']").value;
  const senha = e.target.querySelector("input[name='senha']").value;

  try {
    const res = await fetch(`${API_URL}/instituicoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha, tipo })
    });
    if (res.ok) {
      usuarioLogado = { nome, email, tipo };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      alert("Cadastro realizado com sucesso como " + tipo);
      window.location.href = "perfil.html";
    } else {
      alert("Erro ao cadastrar ❌");
    }
  } catch (err) {
    console.error("Erro no cadastro:", err);
  }
});

// Login integrado ao backend (exemplo simples)
document.getElementById("formLogin")?.addEventListener("submit", async e => {
  e.preventDefault();
  const email = e.target.querySelector("input[name='email']").value;
  const senha = e.target.querySelector("input[name='senha']").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });
    if (res.ok) {
      const data = await res.json();
      usuarioLogado = data; // backend deve retornar {nome, email, tipo}
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      alert("Login realizado com sucesso!");
      window.location.href = "perfil.html";
    } else {
      alert("Email ou senha inválidos ❌");
    }
  } catch (err) {
    console.error("Erro no login:", err);
  }
});

// Logout
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

// Controle de perfis no perfil.html
function carregarPerfil() {
  if (!usuarioLogado) {
    alert("Faça login primeiro!");
    window.location.href = "index.html";
    return;
  }

  document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));

  switch (usuarioLogado.tipo) {
    case "doador":
      showSection("perfilDoador");
      carregarDoacoesDoador();
      break;
    case "ong":
      showSection("perfilOng");
      carregarPainelOng();
      break;
    case "instituicao_parceira":
      showSection("perfilInstituicaoParceira");
      carregarInstituicaoParceira();
      break;
    case "instituicao_receptora":
      showSection("perfilInstituicaoReceptora");
      carregarInstituicaoReceptora();
      break;
    case "admin":
      showSection("perfilAdmin");
      break;
  }
}

// 🔹 Funções de carregamento de dados

// Doações públicas (index.html)
async function carregarDoacoesPublicas() {
  const lista = document.getElementById("listaDoacoes");
  if (!lista) return;
  lista.innerHTML = "<li>Carregando...</li>";
  try {
    const res = await fetch(`${API_URL}/doacoes`);
    const doacoes = await res.json();
    lista.innerHTML = doacoes.map(d =>
      `<li>${d.nomeDoador} → ${d.instituicao} | ${d.alimento} (${d.quantidade})</li>`
    ).join("");
  } catch (err) {
    lista.innerHTML = "<li>Erro ao carregar doações ❌</li>";
    console.error(err);
  }
}

// Doações do doador logado
async function carregarDoacoesDoador() {
  const lista = document.getElementById("listaDoacoesDoador");
  if (!lista) return;
  lista.innerHTML = "";
  try {
    const res = await fetch(`${API_URL}/doacoes`);
    const doacoes = await res.json();
    doacoes.filter(d => d.nomeDoador === usuarioLogado.nome).forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.alimento} | ${d.quantidade} | ${d.instituicao}`;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar doações do doador", err);
  }
}

// Painel da ONG
async function carregarPainelOng() {
  const listaDoacoes = document.getElementById("listaDoacoesOng");
  const listaEntregas = document.getElementById("listaEntregasOng");
  if (!listaDoacoes || !listaEntregas) return;
  listaDoacoes.innerHTML = "";
  listaEntregas.innerHTML = "";
  try {
    const resDoacoes = await fetch(`${API_URL}/doacoes`);
    const doacoes = await resDoacoes.json();
    doacoes.filter(d => d.instituicao === usuarioLogado.nome).forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.alimento} | ${d.quantidade} | ${d.nomeDoador}`;
      listaDoacoes.appendChild(li);
    });

    const resEntregas = await fetch(`${API_URL}/entregas`);
    const entregas = await resEntregas.json();
    entregas.filter(e => e.voluntario === usuarioLogado.nome).forEach(e => {
      const li = document.createElement("li");
      li.textContent = `${e.alimentoEntregue} | ${e.familiaDestino}`;
      listaEntregas.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar painel da ONG", err);
  }
}

// Instituição Parceira
async function carregarInstituicaoParceira() {
  const lista = document.getElementById("listaDoacoesInstituicaoParceira");
  if (!lista) return;
  lista.innerHTML = "";
  try {
    const res = await fetch(`${API_URL}/doacoes`);
    const doacoes = await res.json();
    doacoes.filter(d => d.nomeDoador === usuarioLogado.nome).forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.alimento} | ${d.quantidade} | ${d.instituicao}`;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar instituição parceira", err);
  }
}

// Instituição Receptora
async function carregarInstituicaoReceptora() {
  const lista = document.getElementById("listaDoacoesInstituicaoReceptora");
  if (!lista) return;
  lista.innerHTML = "";
  try {
    const res = await fetch(`${API_URL}/doacoes`);
    const doacoes = await res.json();
    doacoes.filter(d => d.instituicao === usuarioLogado.nome).forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.alimento} | ${d.quantidade} | ${d.nomeDoador}`;
      lista.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar instituição receptora", err);
  }
}

// Executar ao abrir index.html
if (window.location.pathname.includes("index.html")) {
  carregarDoacoesPublicas();
}

// Executar ao abrir perfil.html
if (window.location.pathname.includes("perfil.html")) {
  carregarPerfil();
}
