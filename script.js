// ---------------------
// CARREGAR RECEITAS SALVAS AO ABRIR A PÁGINA
// ---------------------
let receitaSelecionada = null;
window.onload = () => {
  // Sempre que abre o Diário roda o código abaixo para puxar as receitas novamente.
  const receitasSalvas = JSON.parse(localStorage.getItem("receitas")) || []; // Busca no LocalStorage do Site o Receitas, se não ele cria!
  // JSON.parse transforma num Array e guarda bonitinho!
  receitasSalvas.forEach((r) => {
    // Roda uma receita por vez.
    const nomesReceitas = document.getElementById("nomesReceitas");
    const idDaDescricao = r.nome.toLowerCase().replace(/ /g, "-"); // Cria uma ID para puxar as receitas e ajusta legal.

    const li = document.createElement("li");
    const link = document.createElement("a");

    link.textContent = r.nome; // Coloca o nome da receita no linkzinho.
    link.href = "#" + idDaDescricao; // Cria o vulgo link.

    // Adiciona o Resto das infos.
    link.addEventListener("click", () => {
      receitaSelecionada = r;
      document.getElementById("descrição").textContent = r.descricao;
      document.getElementById("ingredientes").textContent = r.ingredientes;
      document.getElementById("preparo").textContent = r.preparo;
      // Se tiver imagem ele coloca junto.
      if (r.imagem) {
        document.getElementById("comida").src = r.imagem;
      } else {
        document.getElementById("comida").src = "";
      }
    });

    li.appendChild(link); // Coloca o link na <li>.
    nomesReceitas.appendChild(li); // Coloca a <li> dentro da <ul>.
  });
};
// ---------------------
// FUNÇÃO PARA ENVIAR RECEITAS
// ---------------------
document.getElementById("enviar").addEventListener("click", () => {
  // Função alerta para abrir aba de Inputs.
  Swal.fire({
    title: "Preencha sua Receita!",
    // Cria os Inputs.
    html: ` 
      <label for='file' class='file-label'>Envie uma foto!</label>
      <input type="file" accept=".png, .jpg, .jpeg" id="swal-imagem" class="custom-file-input">

      <input type="text" id="swal-nome" class="swal2-input" placeholder="Nome da Receita">
      <input type="text" id="swal-descricao" class="swal2-input" placeholder="Descreva sua Receita">
      <input type="text" id="swal-ingredientes" class="swal2-input" placeholder="Ingredientes">
      <input type="text" id="swal-preparo" class="swal2-input" placeholder="Modo de Preparo">
    `,
    confirmButtonText: "Enviar",
    focusConfirm: false,

    preConfirm: () => {
      // Confirma os valores e salva as Váriaveis!
      const imagem = document.getElementById("swal-imagem").files[0];
      const nome = document.getElementById("swal-nome").value;
      const descricao = document.getElementById("swal-descricao").value;
      const ingredientes = document.getElementById("swal-ingredientes").value;
      const preparo = document.getElementById("swal-preparo").value;

      // Caso não preencha algo não dá Return.

      if (!descricao || !ingredientes || !preparo || !nome) {
        Swal.showValidationMessage("Preencha tudo!");
        return false;
      }

      return new Promise((resolve) => {
        if (!imagem) {
          resolve({
            nome,
            descricao,
            ingredientes,
            preparo,
            imagemBase64: null,
          });
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            nome,
            descricao,
            ingredientes,
            preparo,
            imagemBase64: reader.result,
          });
        };
        reader.readAsDataURL(imagem);
      });
    },
  }).then((result) => {
    // Com tudo preenchido ele segue o código.
    if (!result.isConfirmed) return;

    // Cria e ajusta os ID, link e etc. Lá em cima recria para o usuário com base no Storage, aqui ele cria com base nos Elementos novos.
    const { nome, descricao, ingredientes, preparo, imagemBase64 } =
      result.value;
    const idDaDescricao = nome.toLowerCase().replace(/ /g, "-");
    const nomesReceitas = document.getElementById("nomesReceitas");
    const novaReceita = document.createElement("li");
    const link = document.createElement("a");

    link.textContent = nome;
    link.href = "#" + idDaDescricao;

    // Garante que gere a receita assim que salvar.
    link.addEventListener("click", () => {
      receitaSelecionada = {
        nome,
        descricao,
        ingredientes,
        preparo,
        imagem: imagemBase64,
      };
      document.getElementById("descrição").textContent = descricao;
      document.getElementById("ingredientes").textContent = ingredientes;
      document.getElementById("preparo").textContent = preparo;

      if (imagemBase64) {
        document.getElementById("comida").src = imagemBase64;
      } else {
        document.getElementById("comida").src = "";
      }
    });

    novaReceita.appendChild(link);
    nomesReceitas.appendChild(novaReceita);

    // ⬇️ Força um click auto pra aparecer!
    link.click();

    // ---------------------------------------
    // SALVAR NO LOCALSTORAGE
    // ---------------------------------------

    // Com tudo preenchido, declara novamente para salvar no JSON.
    let receitasSalvas = JSON.parse(localStorage.getItem("receitas")) || [];
    // Acrescenta as receitas para o Storage no JSON.
    receitasSalvas.push({
      nome,
      descricao,
      ingredientes,
      preparo,
      imagem: result.value.imagemBase64,
    });

    localStorage.setItem("receitas", JSON.stringify(receitasSalvas));
  });
});
// ---------------------
// FUNÇÃO PARA APAGAR RECEITAS
// ---------------------
document.getElementById("remover").addEventListener("click", () => {
  // Primeiro verifica se tem algo selecionado.
  if (!receitaSelecionada) {
    alert("Nenhuma receita selecionada!");
    return;
  }

  // Busca no storage.
  let receitas = JSON.parse(localStorage.getItem("receitas")) || [];

  // Remove a receita do localStorage
  receitas = receitas.filter((r) => r.nome !== receitaSelecionada.nome);
  localStorage.setItem("receitas", JSON.stringify(receitas));

  // Remove da lista visual
  const nomesReceitas = document.getElementById("nomesReceitas");
  const links = nomesReceitas.querySelectorAll("a");

  links.forEach((a) => {
    if (a.textContent === receitaSelecionada.nome) {
      a.parentElement.remove();
    }
  });

  // Limpar a descrição visual
  document.getElementById("descrição").textContent = "";
  document.getElementById("ingredientes").textContent = "";
  document.getElementById("preparo").textContent = "";
  document.getElementById("comida").src = "";

  // Reseta
  receitaSelecionada = null;

  alert("Receita removida!");
});

// Por hoje é só, apanhei que nem cachorro.
