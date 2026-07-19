import { db, auth } from "./firebase.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const botao = document.getElementById("salvar");

botao.addEventListener("click", async () => {

    const empresa = document.getElementById("empresa").value.trim();
    const quantidade = document.getElementById("quantidade").value;
    const horario = document.getElementById("horario").value;
    const texto = document.getElementById("texto").value.trim();
    const numeros = document.getElementById("numeros").value.split("\n").map(n => n.trim()).filter(n => n !== "");

    const usuario = auth.currentUser;

    if (!usuario) {
        alert("Usuário não autenticado.");
        return;
    }

    if (!empresa || !quantidade || !horario || !texto || !numeros) {
        alert("Preencha todos os campos obrigatórios.");
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

        if (dadosUsuario.tipo === "admin") {
        window.location.href = "admin.html";
        } else {
        window.location.href = "dashboard.html";
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
