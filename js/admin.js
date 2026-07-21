import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    doc,
    updateDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const lista = document.getElementById("listaAgendamentos");
const usuario = document.getElementById("usuario");
const logout = document.getElementById("logout");

onAuthStateChanged(auth, (user) => {

    if (!user) {
        location.href = "login.html";
        return;
    }

    usuario.innerHTML = "Admin logado: " + user.email;

    onSnapshot(collection(db, "agendamentos"), (resultado) => {

        lista.innerHTML = "";

        if (resultado.empty) {
            lista.innerHTML = "Nenhum agendamento encontrado.";
            return;
        }

        resultado.forEach((documento) => {

            const dados = documento.data();

            lista.innerHTML += `

<div>

<h2>${dados.empresa}</h2>

<p>
<strong>Parceiro:</strong>
${dados.parceiro}
</p>

<p>
<strong>Quantidade:</strong>
${dados.quantidade}
</p>

<p>
<strong>Horário:</strong>
${dados.horario}
</p>

<p>
<strong>Mensagem:</strong>
${dados.texto}
</p>

<p>
<strong>Números:</strong><br>
${dados.numeros.join("<br>")}
</p>

<p>
<strong>Status:</strong>
<select class="status" data-id="${documento.id}">
    <option value="pendente" ${dados.status === "pendente" ? "selected" : ""}>Pendente</option>
    <option value="em andamento" ${dados.status === "em andamento" ? "selected" : ""}>Em andamento</option>
    <option value="concluido" ${dados.status === "concluido" ? "selected" : ""}>Concluído</option>
    <option value="cancelado" ${dados.status === "cancelado" ? "selected" : ""}>Cancelado</option>
</select>
</p>

<p>
<strong>Anexos:</strong>

<br>

${
                dados.arquivo
                    ? `<a href="${dados.arquivo}" target="_blank">
        📄 Arquivo
       </a><br>`
                    : ""
            }

${
                dados.imagem
                    ? `<a href="${dados.imagem}" target="_blank">
        🖼️ Imagem
       </a><br>`
                    : ""
            }

${
                dados.comprovante
                    ? `<a href="${dados.comprovante}" target="_blank">
        💳 Comprovante
       </a>`
                    : ""
            }

${
                !dados.arquivo &&
                !dados.imagem &&
                !dados.comprovante

                    ? "Nenhum arquivo anexado"

                    : ""
            }

</p>

</div>

<hr>

`;

        });

        document.querySelectorAll(".status").forEach(select => {

            select.addEventListener("change", async () => {

                await updateDoc(
                    doc(db, "agendamentos", select.dataset.id),
                    {
                        status: select.value
                    }
                );

            });

        });

    });

});

logout.addEventListener("click", async () => {

    await signOut(auth);

    location.href = "index.html";

});
