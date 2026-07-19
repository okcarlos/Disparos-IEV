import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const usuario = document.getElementById("usuario");
const lista = document.getElementById("listaAgendamentos");
const logout = document.getElementById("logout");

onAuthStateChanged(auth, (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    usuario.innerHTML = "Logado como: " + user.email;

    const busca = query(
        collection(db, "agendamentos"),
        where("parceiro", "==", user.email)
    );

    onSnapshot(busca, (resultado) => {

        lista.innerHTML = "";

        if (resultado.empty) {
            lista.innerHTML = "Nenhum agendamento cadastrado.";
            return;
        }

        resultado.forEach((doc) => {

            const agendamento = doc.data();

            lista.innerHTML += `

<div>

<h3>${agendamento.empresa}</h3>

<p>
<strong>Quantidade:</strong>
${agendamento.quantidade}
</p>

<p>
<strong>Horário:</strong>
${agendamento.horario}
</p>

<p>
<strong>Status:</strong>
${agendamento.status}
</p>

<p>
<strong>Mensagem:</strong>
${agendamento.texto}
</p>

<p>
<strong>Anexos:</strong>

<br>

${
                agendamento.arquivo
                    ? `<a href="${agendamento.arquivo}" target="_blank">📄 Arquivo</a><br>`
                    : ""
            }

${
                agendamento.imagem
                    ? `<a href="${agendamento.imagem}" target="_blank">🖼️ Imagem</a><br>`
                    : ""
            }

${
                agendamento.comprovante
                    ? `<a href="${agendamento.comprovante}" target="_blank">💳 Comprovante</a>`
                    : ""
            }

</p>

</div>

<hr>

`;

        });

    });

});

logout.addEventListener("click", async () => {

    await signOut(auth);

    location.href = "index.html";

});