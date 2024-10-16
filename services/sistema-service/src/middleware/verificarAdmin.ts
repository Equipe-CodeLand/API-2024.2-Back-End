import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// Middleware para verificar se o usuário é Administrador
export const verificarAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtém o cabeçalho de autorização
    const authHeader = req.headers['authorization'];
    
    // Verifica se o cabeçalho está presente
    if (!authHeader) {
      return res.status(403).json({ erro: "Token não fornecido." });
    }

    // O token deve estar no formato "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    // Verifica se o token foi fornecido
    if (!token) {
      return res.status(403).json({ erro: "Token não fornecido." });
    }

    // Verifica o token e decodifica o payload
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Verifica se o perfil do usuário é Administrador
    if (decodedToken.perfil !== "Administrador") {
      return res.status(403).json({ erro: "Acesso negado. Apenas administradores podem realizar esta ação." });
    }

    // Continua para a rota se o perfil for Administrador
    next();
  } catch (erro) {
    console.error("Erro ao verificar o token:", erro);
    res.status(401).json({ erro: "Token inválido." });
  }
};
