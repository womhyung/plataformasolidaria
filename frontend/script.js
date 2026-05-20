// =========================
// Configuração inicial
// =========================
const API_URL = "https://plataformasolidaria.onrender.com";
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

// =========================
// Alternar seções
// =========================
function showSection(sectionId) {
  document.querySelectorAll("main section").forEach(sec => {
    sec.classList.remove("active");
    sec.style.display = "none";
  });
  const sec = document.getElementById(sectionId);
  if (sec) {
    sec.classList.add("active");
    sec.style.display = "block";
  }
}

// =========================
// Cadastro
// =========================
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

// =========================
// Login
// =========================
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
      usuarioLogado = data;
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

// =========================
// Logout
// =========================
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

// =========================
// Controle de perfis
// =========================
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
      gerarGraficoInstituicaoParceira();
      break;
    case "instituicao_receptora":
      showSection("perfilInstituicaoReceptora");
      carregarInstituicaoReceptora();
      carregarFeedImagens();
      break;
    case "admin":
      showSection("perfilAdmin");
      break;
  }
}

// =========================
// Funções de carregamento
// =========================
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

// =========================
// Funções genéricas CRUD
// =========================
async function carregarLista(elementId, collection) {
  const lista = document.getElementById(elementId);
  if (!lista) return;
  lista.innerHTML = "<li>Carregando...</li>";
  try {
    const res = await fetch(`${API_URL}/${collection}`);
    const dados = await res.json();
    lista.innerHTML = "";
    dados.forEach(item => {
      const li = document.createElement("li");
      li.textContent =
        `${item.nomeDoador || item.instituicao || item.nomeFamilia || item.nomeInstituicao || ""} | ` +
        `${item.alimento || item.feedback || item.endereco || item.familiaDestino || ""} | ` +
        `${item.quantidade || item.membros || item.alimentoEntregue || ""}`;

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.onclick = () => editarRegistro(collection, item._id);

            const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.onclick = () => excluirRegistro(collection, item._id, li);

      li.appendChild(btnEditar);
      li.appendChild(btnExcluir);
      lista.appendChild(li);
    });
  } catch (err) {
    lista.innerHTML = "<li>Erro ao carregar ❌</li>";
    console.error("Erro ao carregar lista:", err);
  }
}

// =========================
// Editar registro
// =========================
async function editarRegistro(collection, id) {
  try {
    const res = await fetch(`${API_URL}/${collection}/${id}`);
    const item = await res.json();

    const novoValor = prompt("Editar registro (JSON):", JSON.stringify(item));
    if (!novoValor) return;

    const resUpdate = await fetch(`${API_URL}/${collection}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: novoValor
    });

    if (resUpdate.ok) {
      alert("Registro atualizado ✅");
      carregarLista(`lista${collection.charAt(0).toUpperCase() + collection.slice(1)}`, collection);
    } else {
      alert("Erro ao atualizar ❌");
    }
  } catch (err) {
    console.error("Erro ao editar registro:", err);
  }
}

// =========================
// Excluir registro
// =========================
async function excluirRegistro(collection, id, li) {
  if (!confirm("Deseja realmente excluir este registro?")) return;
  try {
    const res = await fetch(`${API_URL}/${collection}/${id}`, { method: "DELETE" });
    if (res.ok) {
      li.remove();
      alert("Registro excluído ✅");
    } else {
      alert("Erro ao excluir ❌");
    }
  } catch (err) {
    console.error("Erro ao excluir registro:", err);
  }
}

// =========================
// Extras: filtros e gráficos
// =========================
function filtrarOng() {
  const mes = document.getElementById("filtroOngMes")?.value;
  if (!mes) return;
  // Aqui você pode aplicar filtros nas listas já carregadas
  alert("Filtro aplicado para o mês: " + mes);
}

async function gerarGraficoInstituicaoParceira() {
  const ctx = document.getElementById("graficoInstituicaoParceira")?.getContext("2d");
  if (!ctx) return;
  try {
    const res = await fetch(`${API_URL}/doacoes`);
    const doacoes = await res.json();
    const dados = {};
    doacoes.filter(d => d.nomeDoador === usuarioLogado.nome).forEach(d => {
      dados[d.alimento] = (dados[d.alimento] || 0) + d.quantidade;
    });
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(dados),
        datasets: [{
          data: Object.values(dados),
          backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#E91E63"]
        }]
      }
    });
  } catch (err) {
    console.error("Erro ao gerar gráfico:", err);
  }
}

function carregarFeedImagens() {
  const feed = document.getElementById("feedImagens");
  if (!feed) return;
  feed.innerHTML = "<p>Feed de imagens em construção...</p>";
}
