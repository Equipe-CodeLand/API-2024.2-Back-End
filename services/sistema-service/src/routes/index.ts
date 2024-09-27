import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";
import EstacaoController from "../controllers/estacaoController";
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

router.get('/parametros', async (req, res) => {
  const parametros = await ParametroController.buscarParametros()

  if(parametros){
    res.status(200).json(parametros)
  } else {
    res.status(500)
  }
})

router.get('/parametro/estacao/:id', async (req,res) => {
  const idEstacao = parseInt(req.params.id)
  const parametros = await ParametroController.buscarParametrosEstacao(idEstacao)

  if (parametros) {
    res.status(200).json(parametros)
  } else {
    res.status(500)
  }
})

router.get('/estacao', async (req, res) => {
  const estacoes = await EstacaoController.buscarEstacoes()

  if (estacoes) {
    res.status(200).json(estacoes)
  } else {
    res.status(500)
  }
})

router.post('/estacao/cadastro', async (req, res) => {
  const estacao = req.body;
  const result = await EstacaoController.cadastrarEstacao(estacao);

  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
});

router.put("/estacao/atualizar/:id", async (req, res) => {
  const estacaoId = req.params.id; // Captura o ID da estação da URL
  const estacao = req.body; // Captura o corpo da requisição
  const parametros = estacao.parametros; // Extraí os parâmetros do corpo da requisição

  const result = await EstacaoController.atualizarEstacao({ ...estacao, id: estacaoId }, parametros); // Chama o controlador

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

// Rota para atualizar usuário
router.put("/usuario/atualizar", async (req, res) => {
  const usuario = req.body;
  const result = await UsuarioController.atualizarUsuario(usuario);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

// Rota para deletar usuário
router.delete("/usuario/deletar", async (req, res) => {
  const { id } = req.body;
  const result = await UsuarioController.deletarUsuario(id);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

router.get('/estacao/alerta/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const alerta = await EstacaoController.verificarAlertas(id)
    res.status(200).json(alerta)
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    res.status(500)
  }
})

// Rota para atualizar um parâmetro
router.put('/parametro/atualizar/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const parametro = req.body;
  const result = await ParametroController.atualizarParametro(id, parametro);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

export default router;