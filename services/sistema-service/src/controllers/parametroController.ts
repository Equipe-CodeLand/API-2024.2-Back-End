import { Request, Response } from "express";
import { db } from "../config";
import { Parametro } from "../interfaces/parametro";
import TimestampFormatado from "../middleware/timestampFormatado";

const colecaoParametros = db.collection("Parametros");

export default class ParametroController {

  // Função para cadastrar um novo parâmetro
  static async cadastrarParametro(req: Request, res: Response) {
    try {
      const dados: Parametro = req.body;
      const novoParametro = await colecaoParametros.add(dados); // Adiciona um novo documento na coleção 'Parametros'

      // Gravar novo parâmetro no Firestore
      await novoParametro.set({
        id: novoParametro.id,
        nome: dados.nome,
        unidade: dados.unidade,
        fator: dados.fator,
        offset: dados.offset,
        descricao: dados.descricao,
        sigla: dados.sigla,
        criadoEm: TimestampFormatado(),
        atualizadoEm: TimestampFormatado(),
      })

      res.status(201).json({ novoParametro });
    } catch (erro) {
      console.error("Erro ao cadastrar parâmetro:", erro);
      res.status(500).json({ erro: "Falha ao cadastrar parâmetro" });
    }
  }

  // Função para buscar todos os parâmetros
  static async buscarParametros(req: Request, res: Response) {
    try {
      const parametrosSnapshot = await colecaoParametros.get(); // Busca todos os documentos da coleção 'Parametros'

      // Mapear os dados dos parâmetros
      const parametros = parametrosSnapshot.docs.map(doc => ({
        id: doc.id, // ID gerado pelo Firestore
        ...doc.data() as Omit<Parametro, 'id'> // Dados do parâmetro
      }));

      res.status(200).json(parametros);
    } catch (error) {
      console.error("Erro ao listar parâmetros:", error);
      res.status(500).json({ erro: "Falha ao listar parâmetros" });
    }
  }

  // Função para buscar um parâmetro por ID
  static async buscarParametroPorId(req: Request, res: Response): Promise<void> {
    try {
      const parametroId = req.body;
      const parametroRef = colecaoParametros.doc(parametroId.id); // Referência para o documento do parâmetro
      const parametroEncontrado = await parametroRef.get(); // Busca o parâmetro no Firestore

      res.status(200).json(parametroEncontrado);
    } catch (error) {
      console.error("Erro ao listar parâmetro por ID:", error);
      res.status(500).json({ erro: "Falha ao listar parâmetros" });
    }
  }

  // Função para atualizar um parâmetro
  static async atualizarParametro(req: Request, res: Response) {
    try {
      const dadosAtualizados = req.body;

      // Verificar se o ID do parâmetro está presente
      if (!dadosAtualizados.id) {
        res.status(400).json({ erro: "ID do parâmetro é obrigatório" });
        return;
      }
  
      const parametroRef = colecaoParametros.doc(dadosAtualizados.id); // Referência para o documento do parâmetro
      const parametroAtualizado = await parametroRef.get(); // Busca o parâmetro no Firestore
  
      // Verificar se o parâmetro foi encontrado
      if (!parametroAtualizado.exists) {
        res.status(404).json({ erro: "Parâmetro não encontrado" });
        return;
      }

      // Usar a função timestampFormatado para formatar a data atual
      dadosAtualizados.atualizado = TimestampFormatado(); 
  
      await parametroRef.update(dadosAtualizados);
      res.status(200).json({ dadosAtualizados });
    } catch (error) {
      console.error("Erro ao atualizar parâmetro:", error);
      res.status(500).json({ erro: "Falha ao editar parâmetro" });
    }
  }

  // Função para deletar um parâmetro
  static async deletarParametro(req: Request, res: Response) {
    try {
      const parametroId = req.params.id;
      await colecaoParametros.doc(parametroId).delete(); // Deleta o parâmetro no Firestore

      res.status(200).json({ success: true, message: 'Parâmetro deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar parâmetro:', error);
      res.status(500).json({ erro: 'Falha ao deletar parâmetro' });
    }
  }
}