import { db, auth } from "./firebase.js";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const botao = document.getElementById("salvar");

botao.addEventListener("click", async () => {

    const empresa = document.getElementById("empresa").value.trim();
    const quantidade = document.getElementById("quantidade").value;
    const horario = document.getElementById("horario").value;
    const texto = document.getElementById("texto").value.trim();
    const numeros = document.getElementById("numeros").value
        .split("\n")
        .map(n => n.trim())
        .filter(n => n !== "");

    const agora = new Date();
    const dia = agora.getDate()
    const horas = agora.getHours();


    const usuario = auth.currentUser;

    if (!usuario) {
        alert("Usuário não autenticado.");
        return;
    }

    // Busca o usuário no Firestore (mesma lógica do login)
    const referencia = doc(db, "usuarios", usuario.uid);
    const dados = await getDoc(referencia);

    if (!dados.exists()) {
        alert("Usuário não encontrado no sistema.");
        return;
    }

    const tipo = dados.data().tipo;

    if (!empresa || !quantidade || !horario || !texto || numeros.length === 0) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    If (!dia){
        alert("Os agendamentos devem ser feitos com 1 dia de antecedência");
        return;
    }
        

    botao.disabled = true;
    botao.textContent = "Salvando...";

    try {

        const formData = new FormData();

        formData.append("nomeDisparo", empresa);

        const arquivo = document.getElementById("arquivo").files[0];
        const imagem = document.getElementById("imagem").files[0];
        const comprovante = document.getElementById("comprovante").files[0];

        if (arquivo) formData.append("arquivo", arquivo);
        if (imagem) formData.append("imagem", imagem);
        if (comprovante) formData.append("comprovante", comprovante);

        const resposta = await fetch("https://agendamentos-disparos.onrender.com/upload", {
            method: "POST",
            body: formData
        });

        if (!resposta.ok) {
            throw new Error("Erro ao enviar os arquivos.");
        }

        const resultado = await resposta.json();

        if (!resultado.sucesso) {
            throw new Error(resultado.erro || "Erro no upload.");
        }

        const idAgendamento = `${empresa}_${Date.now()}`;

        await setDoc(doc(db, "agendamentos", idAgendamento), {

            empresa,
            quantidade,
            horario,
            texto,
            numeros,

            parceiro: usuario.email,

            arquivo: resultado.links.arquivo || "",
            imagem: resultado.links.imagem || "",
            comprovante: resultado.links.comprovante || "",

            status: "pendente",

            criadoEm: serverTimestamp()

        });

        alert("Agendamento enviado com sucesso!");

        // Mesmo redirecionamento do login
        if (tipo === "Admin") {

            window.location.href = "admin.html";

        } else if (tipo === "Parceiro") {

            window.location.href = "dashboard.html";

        } else {

            alert("Tipo de usuário não configurado.");

        }

    } catch (erro) {

        console.error(erro);
        alert(erro.message);

    } finally {

        botao.disabled = false;
        botao.textContent = "Salvar Agendamento";

    }

});

function configurarUpload(idInput) {

    const input = document.getElementById(idInput);

    const card = input.closest(".upload");

    const titulo = card.querySelector("h3");

    const status = card.querySelector(".status");

    const nomeOriginal = titulo.textContent;

    input.addEventListener("change", () => {

        if (input.files.length > 0) {

            titulo.textContent = input.files[0].name;
            status.textContent = "✔ Arquivo anexado";
            card.classList.add("selecionado");

        } else {

            titulo.textContent = nomeOriginal;
            status.textContent = "Clique para selecionar";
            card.classList.remove("selecionado");

        }

    });

}

configurarUpload("arquivo");
configurarUpload("imagem");
configurarUpload("comprovante");
