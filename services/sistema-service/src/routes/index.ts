import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";
import EstacaoController from "../controllers/estacaoController";
import ParametroController from "../controllers/parametroController";
import AlertaController from "../controllers/alertaController";
import obterAlertas from "../controllers/alertaController";
import deletarAlerta from "../controllers/alertaController"

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

router.get('/parametro', async (req, res) => {
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

// Rota para atualizar estacão
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

// Rota para atualizar usuário
router.put("/usuario/atualizar", async (req, res) => {
  const usuario = req.body;
  const result = await UsuarioController.atualizarUsario(usuario);

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

// Cadastro de alerta
router.post('/alerta/cadastro', async (req, res) => {
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

// Rota para deletar uma estação
router.delete('/estacao/deletar/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await EstacaoController.deletarEstacao(id);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});


router.get('/alertas', async (req, res) => {
  try {
    const alertas = await AlertaController.obterAlertas();
    res.status(200).json(alertas);
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    res.status(500).json({ error: 'Erro ao buscar alertas' });
  }
});

router.delete('/alerta/deletar/:id', async (req, res) => {
  const alertaId = parseInt(req.params.id); // Captura o ID do alerta da URL

  try {
    const result = await AlertaController.deletarAlerta(alertaId); // Chama a função de deletar alerta

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Alerta não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar alerta:', error);
    res.status(500).json({ error: 'Erro ao deletar alerta' });
  }
});

export default router;
