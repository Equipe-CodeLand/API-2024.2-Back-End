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

      if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
      }

      // Buscar o usuário no Firestore
      const usuarioSnapshot = await colecaoUsuarios.where("email", "==", email).get();

      if (usuarioSnapshot.empty) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      const usuarioDoc = usuarioSnapshot.docs[0];
      const usuario = usuarioDoc.data() as Usuario;

      // Verificar a senha
      if (usuario.senha !== senha) {
        return res.status(401).json({ erro: "Senha incorreta." });
      }

      // Gerar o token JWT customizado usando o Firebase Authentication
      const customToken = await admin.auth().createCustomToken(usuarioDoc.id, {
        perfil: usuario.perfil // Envia o perfil como parte das claims
      });

      // Enviar o token na resposta
      res.status(200).json({
        message: "Login bem-sucedido.",
        token: customToken, // Token JWT customizado
        usuarioId: usuarioDoc.id,
        perfil: usuario.perfil // Inclui informações do perfil
      });
      
    } catch (erro) {
      console.error("Erro no login:", erro);
      res.status(500).json({ erro: "Falha no login. Tente novamente." });
    }
  }
}