import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


document
    .getElementById("criar")
    .addEventListener("click", async ()=>{

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const confirma = document.getElementById("confirma-senha").value;


        if(confirma !== senha){

            alert("Confirmação de senha inválida");
            return;

        }


        try{

// Cria a conta no Firebase Auth

            const usuario = await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );


// Pega o ID único do usuário

            const uid = usuario.user.uid;


// Salva as informações no Firestore

            await setDoc(doc(db,"usuarios",uid),{

                nome: nome,
                email: email,
                tipo: "Parceiro",
                creditos: 0

            });


            alert("Conta criada!");

            location.href="index.html";


        }catch(e){

            alert(e.message);

        }


    });
