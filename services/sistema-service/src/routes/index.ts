import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";
import ParametroController from "../controllers/parametroController";

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

/* router.get('/parametro/estacao/:id', async (req,res) => {
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

// Rota para atualizar um alerta
router.put("/alerta/atualizar/:id", async (req, res) => {
  const alertaId = req.params.id; 
  const alerta = req.body; 

  try {
    const result = await AlertaController.atualizarAlerta({ ...alerta, id: alertaId }); 
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result); 
    }
  } catch (error) {
    console.error("Erro ao atualizar alerta:", error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
}); */


export default router;
