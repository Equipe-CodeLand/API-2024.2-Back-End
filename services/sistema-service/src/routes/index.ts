// src/routes/router.ts
import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";
import ParametroController from "../controllers/parametroController";
import EstacaoController from "../controllers/estacaoController";
import AlertaController from "../controllers/alertaController";
import NotificacaoController from "../controllers/notificacaoController";
import LoginController from "../controllers/loginController";
import { verificarAdmin } from "../middleware/verificarAdmin";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Usuário
 *     description: Rotas de usuário
 *   - name: Parâmetro
 *     description: Rotas de parâmetros
 *   - name: Estação
 *     description: Rotas de estações
 *   - name: Alerta
 *     description: Rotas de alertas
 *   - name: Notificação
 *     description: Rotas de notificações
 */

// Rota para o login de usuários
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Usuário]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', LoginController.login);

// Rotas do CRUD do usuário
/**
 * @swagger
 * /usuario/cadastro:
 *   post:
 *     summary: Cadastro de usuário
 *     tags: [Usuário]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 */
router.post('/usuario/cadastro', UsuarioController.cadastrarUsuario);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Busca todos os usuários
 *     tags: [Usuário]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/usuarios', verificarAdmin, UsuarioController.buscarUsuarios);

/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Busca um usuário por ID
 *     tags: [Usuário]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do usuário
 */
router.get('/usuario/:id', verificarAdmin, UsuarioController.buscarUsuarioPorId);

/**
 * @swagger
 * /usuario/atualizar:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuário]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
router.put("/usuario/atualizar", verificarAdmin, UsuarioController.atualizarUsuario);

/**
 * @swagger
 * /usuario/deletar:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [Usuário]
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 */
router.delete("/usuario/deletar", verificarAdmin, UsuarioController.deletarUsuario);

// Rotas do CRUD de parâmetros
/**
 * @swagger
 * /parametro/cadastro:
 *   post:
 *     summary: Cadastro de parâmetro
 *     tags: [Parâmetro]
 */
router.post('/parametro/cadastro', verificarAdmin, ParametroController.cadastrarParametro);

/**
 * @swagger
 * /parametros:
 *   get:
 *     summary: Busca todos os parâmetros
 *     tags: [Parâmetro]
 */
router.get('/parametros', ParametroController.buscarParametros);

/**
 * @swagger
 * /parametro/atualizar/{id}:
 *   put:
 *     summary: Atualiza um parâmetro
 *     tags: [Parâmetro]
 */
router.put('/parametro/atualizar/:id', verificarAdmin, ParametroController.atualizarParametro);

/**
 * @swagger
 * /parametro/deletar/{id}:
 *   delete:
 *     summary: Deleta um parâmetro
 *     tags: [Parâmetro]
 */
router.delete('/parametro/deletar/:id', verificarAdmin, ParametroController.deletarParametro);

// Rotas do CRUD de estação
/**
 * @swagger
 * /estacao/cadastro:
 *   post:
 *     summary: Cadastro de estação
 *     tags: [Estação]
 */
router.post('/estacao/cadastro', verificarAdmin, EstacaoController.cadastrarEstacao);

/**
 * @swagger
 * /estacoes:
 *   get:
 *     summary: Busca todas as estações
 *     tags: [Estação]
 */
router.get('/estacoes', EstacaoController.buscarEstacoes);

/**
 * @swagger
 * /estacao/{id}:
 *   get:
 *     summary: Busca uma estação por ID
 *     tags: [Estação]
 */
router.get('/estacao/:id', EstacaoController.buscarEstacaoPorId);

/**
 * @swagger
 * /estacao/atualizar:
 *   put:
 *     summary: Atualiza uma estação
 *     tags: [Estação]
 */
router.put("/estacao/atualizar", verificarAdmin, EstacaoController.atualizarEstacao);

/**
 * @swagger
 * /estacao/deletar/{id}:
 *   delete:
 *     summary: Deleta uma estação
 *     tags: [Estação]
 */
router.delete('/estacao/deletar/:id', verificarAdmin, EstacaoController.deletarEstacao);

// Rotas do CRUD de alertas
/**
 * @swagger
 * /alerta/cadastro:
 *   post:
 *     summary: Cadastro de alerta
 *     tags: [Alerta]
 */
router.post('/alerta/cadastro', verificarAdmin, AlertaController.cadastrarAlerta);

/**
 * @swagger
 * /alertas:
 *   get:
 *     summary: Busca todos os alertas
 *     tags: [Alerta]
 */
router.get('/alertas', AlertaController.obterAlertas);

/**
 * @swagger
 * /alerta/atualizar/{id}:
 *   put:
 *     summary: Atualiza um alerta
 *     tags: [Alerta]
 */
router.put("/alerta/atualizar/:id", verificarAdmin, AlertaController.atualizarAlerta);

/**
 * @swagger
 * /alerta/deletar/{id}:
 *   delete:
 *     summary: Deleta um alerta
 *     tags: [Alerta]
 */
router.delete('/alerta/deletar/:id', verificarAdmin, AlertaController.deletarAlerta);

// Rotas do CRUD de notificação
/**
 * @swagger
 * /notificacoes:
 *   get:
 *     summary: Busca todas as notificações
 *     tags: [Notificação]
 */
router.get('/notificacoes', NotificacaoController.obterNotificacoes);

/**
 * @swagger
 * /notificacao/estacao:
 *   get:
 *     summary: Busca notificações por estação
 *     tags: [Notificação]
 */
router.get('/notificacao/estacao', NotificacaoController.buscarNotificacaoPorEstacao);

/**
 * @swagger
 * /notificacao24h:
 *   get:
 *     summary: Busca notificações das últimas 24 horas
 *     tags: [Notificação]
 */
router.get('/notificacao24h', NotificacaoController.buscarNotificacaoDaEstacaoNasUltimas24Horas);

export default router;
