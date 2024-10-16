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

      const usuarioSnapshot = await colecaoUsuarios.where("email", "==", email).get();

      if (usuarioSnapshot.empty) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      const usuarioDoc = usuarioSnapshot.docs[0];
      const usuario = usuarioDoc.data() as Usuario;

      if (usuario.senha !== senha) {
        return res.status(401).json({ erro: "Senha incorreta." });
      }

      // Incluir o perfil do usuário no token gerado
      const customToken = await admin.auth().createCustomToken(usuarioDoc.id, {
        perfil: usuario.perfil  // Inclui o perfil no token
      });

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
}
