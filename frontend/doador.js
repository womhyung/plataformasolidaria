// ---------- Carregar Doações ----------
async function carregarDoacoes() {
  try {
    const token = JSON.parse(localStorage.getItem("usuarioLogado"))?.token;
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
        <h3>${d.alimento}</h3>
        <p>Quantidade: ${d.quantidade}</p>
        <p>Validade: ${d.validade}</p>
        <p>Localização: ${d.localizacao}</p>
        <p>Data: ${new Date(d.dataRegistro).toLocaleDateString()}</p>
        <button onclick="abrirFormularioEditarDoacao('${d._id}', '${d.alimento}', '${d.quantidade}', '${d.validade}', '${d.localizacao}')">Editar</button>
        <button onclick="excluirDoacao('${d._id}')">Excluir</button>
      `;
      feed.appendChild(card);
    });

    document.getElementById("contadorDoacoes").innerText = `${doacoes.length} doações`;
  } catch (err) {
    console.error("Erro ao carregar doações:", err);
  }
}

// ---------- Nova Doação ----------
function abrirFormularioDoacao() {
  document.getElementById("formNovaDoacao").style.display = "block";
}
function fecharFormularioDoacao() {
  document.getElementById("formNovaDoacao").style.display = "none";
}

document.getElementById("novaDoacaoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = JSON.parse(localStorage.getItem("usuarioLogado"))?.token;

  const formData = {
    alimento: e.target.alimento.value,
    quantidade: e.target.quantidade.value,
    validade: e.target.validade.value,
    localizacao: e.target.localizacao.value
  };

  try {
    const res = await fetch("/doacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert("✅ Doação cadastrada com sucesso!");
      fecharFormularioDoacao();
      carregarDoacoes();
    } else {
      const erro = await res.json();
      alert("❌ Erro ao cadastrar: " + erro.message);
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro de conexão com o servidor");
  }
});

// ---------- Editar Doação ----------
function abrirFormularioEditarDoacao(id, alimento, quantidade, validade, localizacao) {
  const form = document.getElementById("novaDoacaoForm");
  document.getElementById("formNovaDoacao").style.display = "block";

  form.alimento.value = alimento;
  form.quantidade.value = quantidade;
  form.validade.value = validade;
  form.localizacao.value = localizacao;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("usuarioLogado"))?.token;

    const formData = {
      alimento: e.target.alimento.value,
      quantidade: e.target.quantidade.value,
      validade: e.target.validade.value,
      localizacao: e.target.localizacao.value
    };

    try {
      const res = await fetch(`/doacoes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("✅ Doação atualizada com sucesso!");
        fecharFormularioDoacao();
        carregarDoacoes();
      } else {
        const erro = await res.json();
        alert("❌ Erro ao atualizar: " + erro.message);
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro de conexão com o servidor");
    }
  };
}

// ---------- Excluir Doação ----------
async function excluirDoacao(id) {
  if (!confirm("Tem certeza que deseja excluir esta doação?")) return;

  const token = JSON.parse(localStorage.getItem("usuarioLogado"))?.token;

  try {
    const res = await fetch(`/doacoes/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (res.ok) {
      alert("✅ Doação excluída com sucesso!");
      carregarDoacoes();
    } else {
      const erro = await res.json();
      alert("❌ Erro ao excluir: " + erro.message);
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro de conexão com o servidor");
  }
}

// ---------- Editar Perfil ----------
function abrirFormularioEditarPerfil() {
  document.getElementById("formEditarPerfil").style.display = "block";
}
function fecharFormularioEditarPerfil() {
  document.getElementById("formEditarPerfil").style.display = "none";
}

document.getElementById("editarPerfilForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const token = usuario?.token;

  const formData = {
    nome: e.target.nome.value,
    bio: e.target.bio.value,
    foto: e.target.foto.value
  };

  try {
    const res = await fetch(`/usuarios/${usuario.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert("✅ Perfil atualizado com sucesso!");
      document.getElementById("nomeDoador").innerText = formData.nome;
      document.getElementById("bio").innerText = formData.bio;
      document.querySelector(".foto-perfil").src = formData.foto || "default-avatar.png";
      fecharFormularioEditarPerfil();
    } else {
      const erro = await res.json();
      alert("❌ Erro ao atualizar: " + erro.message);
    }
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro de conexão com o servidor");
  }
});

// ---------- Logout ----------
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "/login.html";
}

// Carrega doações ao abrir página
carregarDoacoes();
