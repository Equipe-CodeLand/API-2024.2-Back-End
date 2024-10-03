import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";
import ParametroController from "../controllers/parametroController";
import EstacaoController from "../controllers/estacaoController";
import AlertaController from "../controllers/alertaController";
import NotificacaoController from "../controllers/notificacaoController";

const router = Router();

// Rotas do CRUD do usuário
router.post('/usuario/cadastro', UsuarioController.cadastrarUsuario); 

router.get('/usuarios', UsuarioController.buscarUsuarios);

router.get('/usuario/:id', UsuarioController.buscarUsuarioPorId);

router.put("/usuario/atualizar", UsuarioController.atualizarUsuario);

router.delete("/usuario/deletar", UsuarioController.deletarUsuario);


// Rotas do CRUD de parâmetros
router.post('/parametro/cadastro', ParametroController.cadastrarParametro);

router.get('/parametros', ParametroController.buscarParametros)

router.put('/parametro/atualizar/:id', ParametroController.atualizarParametro);

router.delete('/parametro/:id', ParametroController.deletarParametro);


// Rotas do CRUD de estação
router.post('/estacao/cadastro', EstacaoController.cadastrarEstacao);

router.get('/estacoes', EstacaoController.buscarEstacoes);

router.put("/estacao/atualizar", EstacaoController.atualizarEstacao);

router.delete('/estacao/deletar/:id', EstacaoController.deletarEstacao);


// Rotas do CRUD de alertas
router.post('/alerta/cadastro', AlertaController.cadastrarAlerta);

router.get('/alertas', AlertaController.obterAlertas);

router.put("/alerta/atualizar", AlertaController.atualizarAlerta);

router.delete('/alerta/deletar', AlertaController.deletarAlerta);

router.post('/notificacao/cadastro', NotificacaoController.cadastrarNotificacao)

/* 

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
 */


export default router;
