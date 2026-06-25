const API_URL = "https://plataformasolidaria.onrender.com";

function abrirDoacao() {
  document.getElementById("modalDoacao").style.display = "block";
}

function fecharDoacao() {
  document.getElementById("modalDoacao").style.display = "none";
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "login.html";
}

// FEED estilo Instagram
async function carregarDoacoes() {
  const token = JSON.parse(localStorage.getItem("usuarioLogado"))?.token;

  const res = await fetch("/doacoes/minhas", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  const feed = document.getElementById("feedDoacoes");

  feed.innerHTML = "";

  data.forEach(d => {
    const post = document.createElement("div");
    post.className = "post";

    post.innerHTML = `
      <div class="post-header">
        <img src="default-avatar.png" class="post-avatar">
        <span>${d.nomeDoador || "Você"}</span>
      </div>

      <div class="post-body">
        <p><b>${d.alimento}</b></p>
        <p>${d.quantidade} unidades</p>
        <p>Validade: ${d.validade}</p>
        <p>📍 ${d.localizacao}</p>
      </div>

      <div class="post-actions">
        <button onclick="editar('${d._id}')">Editar</button>
        <button onclick="excluir('${d._id}')">Excluir</button>
      </div>
    `;

    feed.appendChild(post);
  });

  document.getElementById("contadorDoacoes").innerText = `${data.length} publicações`;
}

// CREATE / UPDATE
document.getElementById("formDoacao").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = JSON.parse(localStorage.getItem("usuarioLogado"))?.token;

  const data = {
    alimento: e.target.alimento.value,
    quantidade: e.target.quantidade.value,
    validade: e.target.validade.value,
    localizacao: e.target.localizacao.value
  };

  await fetch("/doacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  fecharDoacao();
  carregarDoacoes();
});

// DELETE
async function excluir(id) {
  const token = JSON.parse(localStorage.getItem("usuarioLogado"))?.token;

  await fetch(`/doacoes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  carregarDoacoes();
}

// EDIT simples (abre modal preenchido)
function editar(id) {
  alert("Você pode evoluir isso depois (modo IG real).");
}

carregarDoacoes();