import { Router } from "express";
import UsuarioController from "../controllers/usuarioController";
import EstacaoController from "../controllers/estacaoController";
import ParametroController from "../controllers/parametroController";

const rotas = Router();

rotas.post('/usuario/cadastro', async (req, res) => {
    const usuario = req.body; // Pega os dados do corpo da requisição
    const result = await UsuarioController.cadastrarUsuario(usuario);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
});

rotas.get('/parametro/estacao/:id', async (req,res) => {
  const idEstacao = parseInt(req.params.id)
  const parametros = await ParametroController.buscarParametrosEstacao(idEstacao)

  if (parametros) {
    res.status(200).json(parametros)
  } else {
    res.status(500)
  }
})

rotas.get('/estacao', async (req, res) => {
  const estacoes = await EstacaoController.buscarEstacoes()

  if (estacoes) {
    res.status(200).json(estacoes)
  } else {
    res.status(500)
  }
})

export default rotas;