import { Request, Response } from "express";
import { db } from "../config";
import admin from "firebase-admin";
import { Usuario } from "../interfaces/usuario";

const colecaoUsuarios = db.collection("Usuario");

export default class LoginController {
  
  // Função para login de usuário
  static async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      // Verifica se o email e senha foram fornecidos
      if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
      }

      // Busca o usuário no Firestore com base no email
      const usuarioSnapshot = await colecaoUsuarios.where("email", "==", email).get();

      if (usuarioSnapshot.empty) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      const usuarioDoc = usuarioSnapshot.docs[0];
      const usuario = usuarioDoc.data() as Usuario;

      // Verifica se a senha está correta
      if (usuario.senha !== senha) {
        return res.status(401).json({ erro: "Senha incorreta." });
      }

      // Cria um token personalizado usando o Firebase Admin SDK
      const customToken = await admin.auth().createCustomToken(usuarioDoc.id);

      // Retorna o token gerado para o frontend
      res.status(200).json({
        message: "Login bem-sucedido.",
        token: customToken,
        usuarioId: usuarioDoc.id
      });
    } catch (erro) {
      console.error("Erro no login:", erro);
      res.status(500).json({ erro: "Falha no login. Tente novamente." });
    }
  }

  // Função para verificar o token de autenticação (opcional, caso queira rotas protegidas)
  static async verificarToken(req: Request, res: Response) {
    const { token } = req.body;

    try {
      // Verifica se o token é válido
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;

      res.status(200).json({ message: "Token válido.", uid });
    } catch (erro) {
      res.status(401).json({ erro: "Token inválido." });
    }
  }
}
