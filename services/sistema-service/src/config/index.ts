import admin from "firebase-admin";
import dotenv from "dotenv";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { backupFirestore } from "../controllers/backupController";
import { Storage } from "@google-cloud/storage";

dotenv.config();

const isLocal = process.env.FIREBASE_LOCAL === 'true';

if (!admin.apps.length) {
  if (isLocal) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    const firestore = admin.firestore();
    firestore.settings({
      host: 'localhost:8080', // Conectar ao emulador
      ssl: false, // Desabilitar SSL para a conexão local
    });
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'; 
    console.log("Conectado ao Firestore local");
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log("Conectado ao Firestore de produção");
  }
}

const db = admin.firestore();

// Configurações do Firebase Client SDK
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Inicialização do Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

// Inicializa o Firebase Client SDK
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Função principal para fazer backup do Firestore
// (async () => {
//   try {
//     await backupFirestore();
//   } catch (error) {
//     console.error('Erro ao fazer backup do Firestore:', error);
//   }
// })();

// Função para obter o ID token de um usuário autenticado
async function getIdToken(customToken: string): Promise<string> {
  if (isLocal) {
    // Usar emulador de autenticação para obter o token no modo local
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
    firebase.auth().useEmulator('http://localhost:9099/');
    await firebase.auth().signInWithCustomToken(customToken);
    const user = firebase.auth().currentUser;
    if (user) {
      return user.getIdToken();
    }
    throw new Error("Não foi possível obter o ID token.");
  } else {
    await firebase.auth().signInWithCustomToken(customToken);
    const user = firebase.auth().currentUser;
    if (user) {
      return user.getIdToken();
    }
    throw new Error("Não foi possível obter o ID token.");
  }
}


export { db, getIdToken, storage };
