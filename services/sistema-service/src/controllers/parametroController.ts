import { Request, Response } from "express";
import { db } from "../config";
import { Parametro } from "../interfaces/parametro";

const colecaoParametros = db.collection("Parametros");

export default class ParametroController {

  // Função para cadastrar um novo parâmetro
  static async cadastrarParametro(req: Request, res: Response) {
    try {
      const dados: Parametro = req.body;
      const novoParametro = await colecaoParametros.add(dados);

      // Obter a data e hora atuais
      const dataAtual = new Date();
      const dia = String(dataAtual.getDate()).padStart(2, '0');
      const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
      const ano = dataAtual.getFullYear();
      const horas = String(dataAtual.getHours()).padStart(2, '0');
      const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
      const segundos = String(dataAtual.getSeconds()).padStart(2, '0');
      
      const timestampFormatado = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;

      await novoParametro.set({
        id: novoParametro.id,
        nome: dados.nome,
        unidade: dados.unidade,
        fator: dados.fator,
        offset: dados.offset,
        descricao: dados.descricao,
        criadoEm: timestampFormatado,
        atualizadoEm: timestampFormatado,
      })

      const { id, ...dadosSemId } = dados;
      res.status(201).json({ id: novoParametro.id, ...dadosSemId });
    } catch (erro) {
        res.status(500).json({ erro: "Falha ao cadastrar parâmetro" });
    }
  }

  // Função para buscar todos os parâmetros
  static async buscarParametros(req: Request, res: Response) {
    try {
      const parametrosSnapshot = await colecaoParametros.get();
      const parametros = parametrosSnapshot.docs.map(doc => ({
        id: doc.id, // ID gerado pelo Firestore
        ...doc.data() as Omit<Parametro, 'id'>
      }));

      res.status(200).json(parametros);
    } catch (error) {
      res.status(500).json({ erro: "Falha ao listar parâmetros" });
    }
  }

  // Função para buscar um parâmetro por ID
  static async buscarParametroPorId(req: Request, res: Response): Promise<void> {
    try {
      const parametroId = req.body;
      const parametroRef = colecaoParametros.doc(parametroId.id);
      const parametroEncontrado = await parametroRef.get();

      res.status(200).json(parametroEncontrado);
    } catch (error) {
      res.status(500).json({ erro: "Falha ao listar parâmetros" });
    }
  }

  // Função para atualizar um parâmetro
  static async atualizarParametro(req: Request, res: Response) {
    try {
      const dadosAtualizados = req.body;
      console.log("Dados recebidos para atualização:", dadosAtualizados);
  
      if (!dadosAtualizados.id) {
        res.status(400).json({ erro: "ID do parâmetro é obrigatório" });
        return;
      }
  
      const parametroRef = colecaoParametros.doc(dadosAtualizados.id);
      const parametroAtualizado = await parametroRef.get();
  
      if (!parametroAtualizado.exists) {
        res.status(404).json({ erro: "Parâmetro não encontrado" });
        return;
      }
  
      await parametroRef.update(dadosAtualizados);
      res.status(200).json({ id: dadosAtualizados.id, ...dadosAtualizados });
    } catch (error) {
      console.error("Erro ao atualizar parâmetro:", error);
      res.status(500).json({ erro: "Falha ao editar parâmetro" });
    }
  }

  // Função para deletar um parâmetro
  static async deletarParametro(req: Request, res: Response) {
    try {
      const parametroId = req.params.id;
      await colecaoParametros.doc(parametroId).delete();

      res.status(200).json({ success: true, message: 'Parâmetro deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar parâmetro:', error);
      res.status(500).json({ erro: 'Falha ao deletar parâmetro' });
    }
  }
} 