import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";
import ParametroController from "../controllers/parametroController";

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
;

// Rota para cadastrar um parâmetro
router.post('/parametro/cadastro', async (req, res) => {
  const parametro = req.body; // Parâmetros recebidos do frontend
  const result = await ParametroController.cadastrarParametro(parametro);

  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
});

// Rota para listar os parâmetros
router.get('/parametros', async (req, res) => {
  const result = await ParametroController.buscarParametros();

  if (result.success) {
    res.status(200).json(result.parametros);
  } else {
    res.status(500).json(result);
  }
});

// Rota para editar um parâmetro
router.put('/parametro/:id', async (req, res) => {
  const parametro = req.body;
  const id = parseInt(req.params.id);
  const result = await ParametroController.atualizarParametro({ ...parametro, id });

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

// Rota para deletar um parâmetro
router.delete('/parametro/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await ParametroController.deletarParametro(id);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

export default router;
