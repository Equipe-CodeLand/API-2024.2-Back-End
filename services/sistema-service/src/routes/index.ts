import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";

const rotas = Router();

rotas.post('/usuario/cadastro', async (req, res) => {
    const usuario = req.body; // Pega os dados do corpo da requisição
    const result = await UsuarioController.cadastrarUsuario(usuario);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
});

export default rotas;