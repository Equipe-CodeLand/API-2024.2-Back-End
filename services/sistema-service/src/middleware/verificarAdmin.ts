import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

// Middleware para verificar se o usuário é Administrador
export const verificarAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  // Verifica se o cabeçalho de autorização foi fornecido
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).json({ erro: "Token não fornecido ou malformado." });
  }

  try {
    // Extração do token do cabeçalho de autorização
    const token = authorization.split(" ")[1];

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
    res.status(401).json({ erro: "Token inválido ou erro na verificação do token." });
  }
};