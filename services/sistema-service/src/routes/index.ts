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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               unidade:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Parâmetro cadastrado com sucesso
 */
router.post('/parametro/cadastro', verificarAdmin, ParametroController.cadastrarParametro);

/**
 * @swagger
 * /parametros:
 *   get:
 *     summary: Busca todos os parâmetros
 *     tags: [Parâmetro]
 *     responses:
 *       200:
 *         description: Lista de parâmetros
 */
router.get('/parametros', ParametroController.buscarParametros);


/**
 * @swagger
 * /parametro/atualizar/{id}:
 *   put:
 *     summary: Atualiza um parâmetro
 *     tags: [Parâmetro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               unidade:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Parâmetro atualizado com sucesso
 */
router.put('/parametro/atualizar/:id', verificarAdmin, ParametroController.atualizarParametro);


/**
 * @swagger
 * /parametro/deletar/{id}:
 *   delete:
 *     summary: Deleta um parâmetro
 *     tags: [Parâmetro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parâmetro deletado com sucesso
 */
router.delete('/parametro/deletar/:id', verificarAdmin, ParametroController.deletarParametro);


// Rotas do CRUD de estação
/**
 * @swagger
 * /estacao/cadastro:
 *   post:
 *     summary: Cadastra uma nova estação
 *     tags: [Estação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               uid:
 *                 type: string
 *               cep:
 *                 type: string
 *               numero:
 *                 type: string
 *               bairro:
 *                 type: string
 *               cidade:
 *                 type: string
 *               rua:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               parametros:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Estação cadastrada com sucesso
 *       400:
 *         description: IDs dos parâmetros são obrigatórios
 *       500:
 *         description: Falha ao cadastrar estação
 */
router.post('/estacao/cadastro', verificarAdmin, EstacaoController.cadastrarEstacao);

/**
 * @swagger
 * /estacoes:
 *   get:
 *     summary: Busca todas estações
 *     tags: [Estação]
 *     responses:
 *       200:
 *         description: Lista de estações
 */
router.get('/estacoes', EstacaoController.buscarEstacoes);

/**
 * @swagger
 * /estacao/{id}:
 *   get:
 *     summary: Retorna uma estação pelo ID
 *     tags: [Estação]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da estação
 *     responses:
 *       200:
 *         description: Dados da estação encontrada
 *       404:
 *         description: Estação não encontrada
 *       500:
 *         description: Falha ao buscar estação
 */
router.get('/estacao/:id', EstacaoController.buscarEstacaoPorId);

/**
 * @swagger
 * /estacao/atualizar:
 *   put:
 *     summary: Atualiza uma estação existente pelo ID
 *     tags: [Estação]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da estação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               uid:
 *                 type: string
 *               cep:
 *                 type: string
 *               numero:
 *                 type: string
 *               bairro:
 *                 type: string
 *               cidade:
 *                 type: string
 *               rua:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               parametros:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Estação atualizada com sucesso
 *       400:
 *         description: ID da estação é obrigatório
 *       404:
 *         description: Estação não encontrada
 *       500:
 *         description: Falha ao atualizar estação
 */
router.put("/estacao/atualizar", verificarAdmin, EstacaoController.atualizarEstacao);

/**
 * @swagger
 * /estacao/deletar/{id}:
 *   delete:
 *     summary: Deleta uma estação pelo ID
 *     tags: [Estação]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da estação
 *     responses:
 *       204:
 *         description: Estação deletada com sucesso
 *       500:
 *         description: Falha ao excluir estação
 */
router.delete('/estacao/deletar/:id', verificarAdmin, EstacaoController.deletarEstacao);

// Rotas do CRUD de alertas
/**
 * @swagger
 * /alerta/cadastro:
 *   post:
 *     summary: Cadastro de alerta
 *     tags: [Alerta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estacaoId:
 *                 type: string
 *                 description: ID da estação associada ao alerta
 *               parametroId:
 *                 type: string
 *                 description: ID do parâmetro que será monitorado
 *               mensagemAlerta:
 *                 type: string
 *                 description: Mensagem a ser exibida quando o alerta for acionado
 *               tipoAlerta:
 *                 type: string
 *                 enum: [Crítico, Informativo]
 *                 description: Tipo do alerta
 *               condicao:
 *                 type: string
 *                 enum: [Maior que, Menor que, Igual]
 *                 description: Condição para ativação do alerta
 *               valor:
 *                 type: number
 *                 description: Valor de referência para a condição do alerta
 *     responses:
 *       201:
 *         description: Alerta cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do alerta cadastrado
 *                 estacaoId:
 *                   type: string
 *                   description: ID da estação
 *                 parametroId:
 *                   type: string
 *                   description: ID do parâmetro
 *                 mensagemAlerta:
 *                   type: string
 *                   description: Mensagem do alerta
 *                 tipoAlerta:
 *                   type: string
 *                   description: Tipo do alerta
 *                 condicao:
 *                   type: string
 *                   description: Condição para o alerta
 *                 valor:
 *                   type: number
 *                   description: Valor de referência para a condição
 *                 criadoEm:
 *                   type: string
 *                   description: Data e hora de criação
 *                 atualizadoEm:
 *                   type: string
 *                   description: Data e hora da última atualização
 *       400:
 *         description: Dados inválidos fornecidos
 *       500:
 *         description: Erro ao cadastrar alerta
 */
router.post('/alerta/cadastro', verificarAdmin, AlertaController.cadastrarAlerta);


/**
 * @swagger
 * /alertas:
 *   get:
 *     summary: Busca todos os alertas
 *     tags: [Alerta]
 *     responses:
 *       200:
 *         description: Lista de alertas
 */
router.get('/alertas', AlertaController.obterAlertas);

/**
 * @swagger
 * /alerta/atualizar/{id}:
 *   put:
 *     summary: Atualiza um alerta existente
 *     tags: [Alerta]
 *     description: Atualiza os detalhes de um alerta específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do alerta a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estacaoId:
 *                 type: string
 *               parametroId:
 *                 type: string
 *               mensagemAlerta:
 *                 type: string
 *               tipoAlerta:
 *                 type: string
 *               condicao:
 *                 type: string
 *               valor:
 *                 type: number
 *     responses:
 *       200:
 *         description: Alerta atualizado com sucesso.
 *       400:
 *         description: Dados inválidos fornecidos.
 *       404:
 *         description: Alerta não encontrado.
 *       500:
 *         description: Erro ao atualizar alerta.
 */
router.put("/alerta/atualizar/:id", verificarAdmin, AlertaController.atualizarAlerta);

/**
 * @swagger
 * /alerta/deletar/{id}:
 *   delete:
 *     summary: Deleta um alerta específico
 *     tags: [Alerta]
 *     description: Remove um alerta do sistema com base em seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do alerta a ser deletado.
 *     responses:
 *       200:
 *         description: Alerta deletado com sucesso.
 *       404:
 *         description: Alerta não encontrado.
 *       500:
 *         description: Erro ao deletar alerta.
 */
router.delete('/alerta/deletar/:id', verificarAdmin, AlertaController.deletarAlerta);

// Rotas do CRUD de notificação
/**
 * @swagger
 * /notificacoes:
 *   get:
 *     summary: Busca todas as notificações
 *     tags: [Notificação]
 *     responses:
 *       200:
 *         description: Lista de notificações
 */
router.get('/notificacoes', NotificacaoController.obterNotificacoes);

/**
 * @swagger
 * /notificacao/estacao:
 *   get:
 *     summary: Busca todas as notificações das estações
 *     tags: [Notificação]
 *     responses:
 *       200:
 *         description: Lista de notificações das estações
 */
router.get('/notificacao/estacao', NotificacaoController.buscarNotificacaoPorEstacao);

/**
 * @swagger
 * /notificacao24h:
 *   get:
 *     summary: Busca todas as notificações das ultimas 24h
 *     tags: [Notificação]
 *     responses:
 *       200:
 *         description: Lista de notificações das ultimas 24h
 */
router.get('/notificacao24h', NotificacaoController.buscarNotificacaoDaEstacaoNasUltimas24Horas);

export default router;
