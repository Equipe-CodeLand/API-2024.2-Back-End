import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";

const router = Router();

// Rota para cadastrar um usuário
router.post('/usuario/cadastro', async (req, res) => {
  const usuario = req.body;
  const result = await UsuarioController.cadastrarUsuario(usuario);

  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
});

router.get('/usuarios', async (req, res) => {
  const result = await UsuarioController.buscarUsuarios();

  if (result.success) {
    res.status(200).json(result.usuarios); // Certifique-se de que 'result.usuarios' é um array
  } else {
    res.status(500).json(result);
  }
});


export default router;
