import admin from "firebase-admin";
import dotenv from "dotenv";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

dotenv.config();

// Inicializa o Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Configurações do Firebase Client SDK
const firebaseConfig = {
  apiKey: "AIzaSyBiQlW32muvBhZd-p_qxkcPEDgUEub8wfY",
  authDomain: "api-tecsus-fb8bd.firebaseapp.com",
  databaseURL: "https://api-tecsus-fb8bd-default-rtdb.firebaseio.com",
  projectId: "api-tecsus-fb8bd",
  storageBucket: "api-tecsus-fb8bd.appspot.com",
  messagingSenderId: "69413262372",
  appId: "1:69413262372:web:66c7925bea38d2defdb4b1"
};

// Inicializa o Firebase Client SDK
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Função para obter o ID token de um usuário autenticado
async function getIdToken(customToken: string): Promise<string> {
  await firebase.auth().signInWithCustomToken(customToken);
  const user = firebase.auth().currentUser;
  if (user) {
    return user.getIdToken();
  }
  throw new Error("Não foi possível obter o ID token.");
}

const db = admin.firestore();
export { db, getIdToken };