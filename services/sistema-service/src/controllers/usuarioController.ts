import { connectToDatabase } from "../config";
import { Usuario } from "../interfaces/usuario";
import deleteMysql from "../middlewares/deleteMysql";
import insertMysql from "../middlewares/insertMysql";
import selectMysql from "../middlewares/selectMysql";
import updateMysql from "../middlewares/updateMysql";

export default class UsuarioController {

  // Função para cadastrar um novo usuário
  static async cadastrarUsuario(usuario: Usuario) {
    const tabela = 'Usuario'; // Nome da tabela no banco de dados
    const colunas = ['nome', 'email', 'senha', 'cpf', 'perfil']; // Colunas que vão ser inseridas
    const valores = [
      usuario.nome,
      usuario.email,
      usuario.senha,
      usuario.cpf,
      usuario.perfil ?? 'Leitor' // Valor padrão para perfil
    ];

    try {
      // INSERÇÃO de um novo usuário no banco de dados
      const result = await insertMysql({ tabela, colunas, valores });
      console.log('Usuário inserido com sucesso');
      
      return {
        success: true,
        message: 'Usuário cadastrado com sucesso',
        insertId: result
      };
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      return {
        success: false,
        message: 'Erro ao cadastrar usuário',
        error
      };
    }
  }

  static async buscarUsuarios() {
    try {
      // Seleciona todos os usuários da tabela "Usuario"
      const result = await selectMysql({ tabela: 'Usuario' });
  
      // Verifica se o resultado existe e contém dados
      if (Array.isArray(result) && result.length > 0) {
        return {
          success: true,
          usuarios: result,
        };
      } else {
        return {
          success: false,
          message: 'Nenhum usuário encontrado',
        };
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return {
        success: false,
        message: 'Erro ao buscar usuários',
        error,
      };
    }
  }  

  static async buscarUsuarioPorId(id: number){
    const result = await selectMysql({ tabela: 'Usuario', where: `id = ${id}` });
    return result
  }

  static async atualizarUsuario(usuario: Usuario){
    console.log('Usuario:', usuario);
    if (usuario.id === undefined || (await this.buscarUsuarioPorId(usuario.id)).length === 0) {
      return {
        success: false,
        message: 'Usuário não encontrado',
      };
    }
    const tabela = 'Usuario'; // Nome da tabela no banco de dados
    const colunas = ['nome', 'email', 'senha', 'cpf', 'perfil']; // Colunas que vão ser atualizadas
    const valores = [
      usuario.nome,
      usuario.email,
      usuario.senha,
      usuario.cpf,
      usuario.perfil ?? 'Leitor' // Valor padrão para perfil
    ];

    try {
      // ATUALIZAÇÃO de um usuário no banco de dados
      const result = await updateMysql({ tabela, colunas, valores, where: `id = ${usuario.id}` });
      console.log('Usuário atualizado com sucesso');
      
      return {
        success: true,
        message: 'Usuário atualizado com sucesso',
        insertId: result
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return {
        success: false,
        message: 'Erro ao atualizar usuário',
        error
      };
    }
  }

  static async deletarUsuario(id: number){
    try {
      // DELEÇÃO de um usuário no banco de dados
      const result = await deleteMysql({ tabela: 'Usuario', where: `id = ${id}` });
      console.log('Usuário deletado com sucesso');
      
      return {
        success: true,
        message: 'Usuário deletado com sucesso',
        insertId: result
      };
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return {
        success: false,
        message: 'Erro ao deletar usuário',
        error
      };
    }
  }
}