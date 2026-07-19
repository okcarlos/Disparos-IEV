import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const botao = document.getElementById("entrar");


botao.addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;


    try {

        const resultado = await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );


        // pega o usuário que acabou de entrar
        const usuario = resultado.user;


        // procura ele no Firestore
        const referencia = doc(
            db,
            "usuarios",
            usuario.uid
        );


        const dados = await getDoc(referencia);


        if(dados.exists()){


            const tipo = dados.data().tipo;


            if(tipo === "Admin"){

                window.location = "admin.html";

            }


            else if(tipo === "Parceiro"){

                window.location = "dashboard.html";

            }


            else {

                alert("Tipo de usuário não configurado");

            }


        } else {

            alert("Usuário não encontrado no sistema");

        }



    } catch (erro) {

        alert(erro.message);

    }

});
