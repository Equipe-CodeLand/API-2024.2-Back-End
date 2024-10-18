import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";
import ParametroController from "../controllers/parametroController";
import EstacaoController from "../controllers/estacaoController";
import AlertaController from "../controllers/alertaController";
import NotificacaoController from "../controllers/notificacaoController";
import LoginController from "../controllers/loginController";
import { verificarAdmin } from "../middleware/verificarAdmin";

const router = Router();

// Rota para o login de usuários
router.post('/login', LoginController.login); // Adiciona a rota para login

// Rotas do CRUD do usuário
router.post('/usuario/cadastro', verificarAdmin, UsuarioController.cadastrarUsuario); 

router.get('/usuarios', verificarAdmin, UsuarioController.buscarUsuarios);

router.get('/usuario/:id', verificarAdmin, UsuarioController.buscarUsuarioPorId);

router.put("/usuario/atualizar", verificarAdmin, UsuarioController.atualizarUsuario);

router.delete("/usuario/deletar", verificarAdmin, UsuarioController.deletarUsuario);


// Rotas do CRUD de parâmetros
router.post('/parametro/cadastro', verificarAdmin, ParametroController.cadastrarParametro);

router.get('/parametros',  ParametroController.buscarParametros);

router.put('/parametro/atualizar/:id', verificarAdmin, ParametroController.atualizarParametro);

router.delete('/parametro/deletar/:id', verificarAdmin, ParametroController.deletarParametro);


// Rotas do CRUD de estação
router.post('/estacao/cadastro', verificarAdmin, EstacaoController.cadastrarEstacao);

router.get('/estacoes', EstacaoController.buscarEstacoes);

router.get('/estacao/:id', verificarAdmin,  EstacaoController.buscarEstacaoPorId);

router.put("/estacao/atualizar", verificarAdmin, EstacaoController.atualizarEstacao);

router.delete('/estacao/deletar/:id', verificarAdmin, EstacaoController.deletarEstacao);


// Rotas do CRUD de alertas
router.post('/alerta/cadastro', verificarAdmin, AlertaController.cadastrarAlerta);

router.get('/alertas', AlertaController.obterAlertas);

router.put("/alerta/atualizar/:id", verificarAdmin, AlertaController.atualizarAlerta);

router.delete('/alerta/deletar/:id', verificarAdmin, AlertaController.deletarAlerta);


// Rotas do CRUD de notificação
router.get('/notificacoes', NotificacaoController.obterNotificacoes);

router.get('/notificacao/estacao', NotificacaoController.buscarNotificacaoPorEstacao);

router.get('/notificacao24h', NotificacaoController.buscarNotificacaoDaEstacaoNasUltimas24Horas);

export default router;