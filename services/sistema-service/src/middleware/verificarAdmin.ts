import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { getIdToken } from "../config";

declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

// Middleware para verificar se o usuário é Administrador
export const verificarAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // Extrai o token da autorização Bearer
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token recebido:", token);

  // Verifica se o token foi fornecido
  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido." });
  }

  try {
    // Troca o custom token por um ID token
    const idToken = await getIdToken(token);
    console.log("ID Token obtido:", idToken);

    // Verifica o ID token usando o Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Token decodificado:", decodedToken);

    // Verifica se o perfil do usuário é "Administrador
    if (decodedToken.perfil !== "Administrador") {
      return res.status(403).json({ erro: "Acesso negado. Usuário não é administrador." });
    }

    // Adiciona as informações do usuário à requisição
    req.user = decodedToken;

    // Continua para a próxima função no middleware
    next();

  } catch (erro) {
    console.error("Erro ao verificar o token:", erro);
    return res.status(403).json({ erro: "Token inválido ou expirado." });
  }
};
