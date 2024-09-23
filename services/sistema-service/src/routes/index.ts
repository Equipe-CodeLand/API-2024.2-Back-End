import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";
import EstacaoController from "../controllers/estacaoController";
import ParametroController from "../controllers/parametroController";
import AlertaController from "../controllers/alertaController"; // Importa o AlertaController

const rotas = Router();

// Cadastro de usuário
rotas.post('/usuario/cadastro', async (req, res) => {
    const usuario = req.body; // Pega os dados do corpo da requisição
    const result = await UsuarioController.cadastrarUsuario(usuario);
    
    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(500).json(result);
    }
});

// Buscar parâmetros
rotas.get('/parametro', async (req, res) => {
    const parametros = await ParametroController.buscarParametros();

    if (parametros) {
        res.status(200).json(parametros);
    } else {
        res.status(500).json({ error: "Erro ao buscar parâmetros" });
    }
});

// Buscar parâmetros por estação
rotas.get('/parametro/estacao/:id', async (req, res) => {
    const idEstacao = parseInt(req.params.id);
    const parametros = await ParametroController.buscarParametrosEstacao(idEstacao);

    if (parametros) {
        res.status(200).json(parametros);
    } else {
        res.status(500).json({ error: "Erro ao buscar parâmetros por estação" });
    }
});

// Buscar todas as estações
rotas.get('/estacao', async (req, res) => {
    const estacoes = await EstacaoController.buscarEstacoes();

    if (estacoes) {
        res.status(200).json(estacoes);
    } else {
        res.status(500).json({ error: "Erro ao buscar estações" });
    }
});

// Cadastro de estação
rotas.post('/estacao/cadastro', async (req, res) => {
    const estacao = req.body;
    const result = await EstacaoController.cadastrarEstacao(estacao);
  
    if (result.success) {
        res.status(201).json(result);
    } else {
        res.status(500).json(result);
    }
});

// Verificar alertas por estação
rotas.get('/estacao/alerta/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const alerta = await EstacaoController.verificarAlertas(id);
        res.status(200).json(alerta);
    } catch (error) {
        console.error('Erro ao buscar alertas:', error);
        res.status(500).json({ error: "Erro ao buscar alertas" });
    }
});

// Cadastro de alerta
rotas.post('/alerta/cadastro', async (req, res) => {
  const alerta = req.body;

  try {
      const result = await AlertaController.cadastrarAlerta(alerta); 

      if (result.success) {
          res.status(201).json(result);
      } else {
          res.status(500).json(result);
      }
  } catch (error) {
      console.error('Erro ao cadastrar alerta:', error);
      res.status(500).json({ error: 'Erro ao cadastrar alerta' });
  }
});


export default rotas;
