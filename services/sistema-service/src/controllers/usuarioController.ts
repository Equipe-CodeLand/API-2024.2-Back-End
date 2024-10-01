import { Request, Response } from "express";
import { db } from "../config";
import { Usuario } from "../interfaces/usuario";

const colecaoUsuarios = db.collection("Usuario");

export default class UsuarioController {

  // Função para cadastrar um novo usuário
  static async cadastrarUsuario(req: Request, res: Response) {
    try {
      const dados: Usuario = req.body;
      const novoUsuario = await colecaoUsuarios.add(dados);

      const { id, ...dadosSemId } = dados;
      res.status(201).json({ id: novoUsuario.id, ...dadosSemId });
    } catch (erro) {
        res.status(500).json({ erro: "Falha ao cadastrar usuário" });
    }
  }

  static async buscarUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuariosSnapshot = await colecaoUsuarios.get();
      const usuarios = usuariosSnapshot.docs.map(doc => ({
        id: doc.id, // ID gerado pelo Firestore
        ...doc.data() as Omit<Usuario, 'id'>
    }));

    res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ erro: "Falha ao listar usuários" });
    }
  }  

 
  static async buscarUsuarioPorId(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = req.params.id; //busca o id pela rota, e não pelo body
      const usuarioRef = colecaoUsuarios.doc(usuarioId);
      const usuarioEncontrado = await usuarioRef.get();

      if (!usuarioEncontrado.exists) {
        res.status(404).json({ erro: "Usuário não encontrado" });
        return;
      }

      const dados = usuarioEncontrado.data();
      res.status(200).json({ id: usuarioEncontrado.id, ...dados });
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      res.status(500).json({ erro: "Falha ao buscar usuário" });
    }
  }


  static async atualizarUsuario(req: Request, res: Response) {
    try {
      const dadosAtualizados = req.body;
      console.log("Dados recebidos para atualização:", dadosAtualizados);
  
      if (!dadosAtualizados.id) {
        res.status(400).json({ erro: "ID do usuário é obrigatório" });
        return;
      }
  
      const usuarioRef = colecaoUsuarios.doc(dadosAtualizados.id);
      const usuarioAtualizado = await usuarioRef.get();
  
      if (!usuarioAtualizado.exists) {
        res.status(404).json({ erro: "Usuário não encontrado" });
        return;
      }
  
      await usuarioRef.update(dadosAtualizados);
      res.status(200).json({ id: dadosAtualizados.id, ...dadosAtualizados });
    } catch (erro) {
      console.error("Erro ao atualizar usuário:", erro); // Log completo do erro
      res.status(500).json({ erro: "Falha ao editar usuário" });
    }
  }

  static async deletarUsuario(req: Request, res: Response){
    try {
      const usuario = req.body;
      await colecaoUsuarios.doc(usuario.id).delete();
      res.status(204).end();
    } catch (erro) {
        res.status(500).json({ erro: "Falha ao excluir usuário" });
    }
  } 
}