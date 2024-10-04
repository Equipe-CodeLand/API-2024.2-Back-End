import { Request, Response } from "express";
import { db } from "../config";
import { Usuario } from "../interfaces/usuario";
import { Perfil } from "../enums/usuarioEnum";
import TimestampFormatado from "../middleware/timestampFormatado";

const colecaoUsuarios = db.collection("Usuario");

export default class UsuarioController {

  // Função para cadastrar um novo usuário
  static async cadastrarUsuario(req: Request, res: Response) {
    try {
      const dados: Usuario = req.body;

      // Verifica se o perfil é válido
      if (!dados.perfil || !Object.values(Perfil).includes(dados.perfil)) {
        return res.status(400).json({ erro: "Perfil inválido." });
      }

      const novoUsuario = await colecaoUsuarios.add(dados); // Adiciona um novo documento na coleção 'Usuario'

      // Gravar novo usuário no Firestore
      await novoUsuario.set({
        id: novoUsuario.id,
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        cpf: dados.cpf,
        perfil: dados.perfil,
        criadoEm: TimestampFormatado(),
        atualizadoEm: TimestampFormatado(),
      })

      res.status(201).json({ novoUsuario }); // Retorna o novo usuário cadastrado
    } catch (erro) {
        res.status(500).json({ erro: "Falha ao cadastrar usuário" });
    }
  }

  // Função para buscar todos os usuários
  static async buscarUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuariosSnapshot = await colecaoUsuarios.get(); // Busca todos os documentos da coleção 'Usuario'
      const usuarios = usuariosSnapshot.docs.map(doc => ({
        id: doc.id, // ID gerado pelo Firestore
        ...doc.data() as Omit<Usuario, 'id'> // Dados do usuário
    }));

    res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ erro: "Falha ao listar usuários" });
    }
  }  

  // Função para buscar um usuário por ID
  static async buscarUsuarioPorId(req: Request, res: Response): Promise<void> {
    try {
      const usuarioId = req.params.id; //busca o id pela rota, e não pelo body
      const usuarioRef = colecaoUsuarios.doc(usuarioId); // Referência para o documento do usuário
      const usuarioEncontrado = await usuarioRef.get(); // Busca o usuário no Firestore

      // Verifica se o usuário foi encontrado
      if (!usuarioEncontrado.exists) {
        res.status(404).json({ erro: "Usuário não encontrado" });
        return;
      }

      const dados = usuarioEncontrado.data(); // Dados do usuário
      res.status(200).json({ dados });
    } catch (error) {
      res.status(500).json({ erro: "Falha ao buscar usuário" });
    }
  }

  // Função para atualizar um usuário
  static async atualizarUsuario(req: Request, res: Response) {
    try {
        const dadosAtualizados = req.body;

        // Verificar se o ID do usuário está presente
        if (!dadosAtualizados.id) {
            res.status(400).json({ erro: "ID do usuário é obrigatório" });
            return;
        }
    
        const usuarioRef = colecaoUsuarios.doc(dadosAtualizados.id); // Referência para o documento do usuário
        const usuarioAtualizado = await usuarioRef.get(); // Busca o usuário no Firestore
    
        // Verificar se o usuário foi encontrado
        if (!usuarioAtualizado.exists) {
            res.status(404).json({ erro: "Usuário não encontrado" });
            return;
        }
    
        // Usar a função timestampFormatado para formatar a data atual
        dadosAtualizados.atualizado = TimestampFormatado(); 

        await usuarioRef.update(dadosAtualizados);
        res.status(200).json({ dadosAtualizados });
    } catch (erro) {
        console.error("Erro ao atualizar usuário:", erro);
        res.status(500).json({ erro: "Falha ao editar usuário" });
    }
  }

  // Função para deletar um usuário
  static async deletarUsuario(req: Request, res: Response){
    try {
      const usuario = req.body;
      await colecaoUsuarios.doc(usuario.id).delete(); // Deleta o usuário no Firestore

      res.status(204).end();
    } catch (erro) {
        res.status(500).json({ erro: "Falha ao excluir usuário" });
    }
  } 
}