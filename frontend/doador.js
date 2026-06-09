async function carregarDoacoes() {
  try {
    const token = localStorage.getItem("token"); // token JWT do login
    const res = await fetch("/doacoes/minhas", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const doacoes = await res.json();

    const feed = document.getElementById("feedDoacoes");
    feed.innerHTML = "";

    doacoes.forEach(d => {
      const card = document.createElement("div");
      card.className = "doacao-card";
      card.innerHTML = `
        <h3>${d.tipo}</h3>
        <p>Instituição: ${d.instituicao}</p>
        <p>Data: ${new Date(d.data).toLocaleDateString()}</p>
        <p>Status: ${d.status}</p>
      `;
      feed.appendChild(card);
    });

    document.getElementById("contadorDoacoes").innerText = `${doacoes.length} doações`;
  } catch (err) {
    console.error("Erro ao carregar doações:", err);
  }
}

function abrirFormularioDoacao() {
  alert("Aqui abriria o formulário de nova doação.");
}

function editarPerfil() {
  alert("Aqui abriria a edição do perfil.");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

// Carrega doações ao abrir página
carregarDoacoes();
