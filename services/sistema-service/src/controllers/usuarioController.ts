import { connectToDatabase } from "../config";
import { Usuario } from "../interfaces/usuario";
import insertMysql from "../middlewares/insertMysql";

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
}