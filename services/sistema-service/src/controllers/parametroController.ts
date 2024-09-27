import { connectToDatabase } from "../config";
import { Parametro } from "../interfaces/parametro";
import deleteMysql from "../middlewares/deleteMysql";
import insertMysql from "../middlewares/insertMysql";
import selectMysql from "../middlewares/selectMysql";
import updateMysql from "../middlewares/updateMysql";

export default class ParametroController {

  // Função para cadastrar um novo parâmetro
  static async cadastrarParametro(parametro: Parametro) {
    const tabela = 'Parametro'; // Nome da tabela no banco de dados
    const colunas = ['nome', 'unidade', 'fator', 'offset', 'descricao']; // Colunas que vão ser inseridas
    const valores = [
      parametro.nome,
      parametro.unidade,
      parametro.fator,
      parametro.offset,
      parametro.descricao
    ];

    try {
      // INSERÇÃO de um novo parâmetro no banco de dados
      const result = await insertMysql({ tabela, colunas, valores });
      console.log('Parâmetro inserido com sucesso');
      
      return {
        success: true,
        message: 'Parâmetro cadastrado com sucesso',
        insertId: result
      };
    } catch (error) {
      console.error('Erro ao cadastrar parâmetro:', error);
      return {
        success: false,
        message: 'Erro ao cadastrar parâmetro',
        error
      };
    }
  }

  // Função para buscar todos os parâmetros
  static async buscarParametros() {
    try {
      // Seleciona todos os parâmetros da tabela "Parametro"
      const result = await selectMysql({ tabela: 'Parametro' });
      // Verifica se o resultado existe e contém dados
      if (Array.isArray(result) && result.length > 0) {
        return {
          success: true,
          parametros: result,
        };
      } else {
        return {
          success: false,
          message: 'Nenhum parâmetro encontrado',
        };
      }
    } catch (error) {
      console.error('Erro ao buscar parâmetros:', error);
      return {
        success: false,
        message: 'Erro ao buscar parâmetros',
        error,
      };
    }
  }

  // Função para buscar um parâmetro por ID
  static async buscarParametroPorId(id: number) {
    try {
      const result = await selectMysql({ tabela: 'Parametro', where: `id = ${id}` });
      if (result.length > 0) {
        return {
          success: true,
          parametro: result[0],
        };
      } else {
        return {
          success: false,
          message: 'Parâmetro não encontrado',
        };
      }
    } catch (error) {
      console.error('Erro ao buscar parâmetro por ID:', error);
      return {
        success: false,
        message: 'Erro ao buscar parâmetro por ID',
        error,
      };
    }
  }

  // Função para atualizar um parâmetro
  static async atualizarParametro(id: number, parametro: Parametro) {
    const tabela = 'Parametro';
    const colunas = ['nome', 'unidade', 'fator', 'offset', 'descricao'];
    const valores = [
      parametro.nome,
      parametro.unidade,
      parametro.fator,
      parametro.offset,
      parametro.descricao
    ];

    try {
      // ATUALIZAÇÃO de um parâmetro no banco de dados
      const result = await updateMysql({ tabela, colunas, valores, where: `id = ${id}` });
      console.log('Parâmetro atualizado com sucesso');
      
      return {
        success: true,
        message: 'Parâmetro atualizado com sucesso',
        updatedId: result
      };
    } catch (error) {
      console.error('Erro ao atualizar parâmetro:', error);
      return {
        success: false,
        message: 'Erro ao atualizar parâmetro',
        error
      };
    }
  }

  // Função para deletar um parâmetro
  static async deletarParametro(id: number) {
    try {
      const result = await deleteMysql({ tabela: 'Parametro', where: `id = ${id}` });
      console.log('Parâmetro deletado com sucesso');
      
      return {
        success: true,
        message: 'Parâmetro deletado com sucesso',
        deletedId: result
      };
    } catch (error) {
      console.error('Erro ao deletar parâmetro:', error);
      return {
        success: false,
        message: 'Erro ao deletar parâmetro',
        error
      };
    }
  }

  static async buscarParametrosEstacao(idEstacao: number) {
    try {
      const result = await selectMysql({
        select: 'select p.id, p.unidade, p.fator, p.offset, p.descricao from ',
        tabela: 'parametro p',
        joins: ` INNER JOIN estacao_parametro ep ON p.id = ep.parametro_id INNER JOIN estacao e ON ep.estacao_id = e.id`,
        where: `e.id = ${idEstacao}`
      });
      return result;
    } catch (error) {
      console.error('Erro ao buscar parâmetro:', error);
      return {
        success: false,
        message: 'Erro ao buscar parâmetro',
        error
      };
    }
  }
}

    // static async buscarParametros() {
    //     const tabela = "parametro"

    //     try {
    //         const result = selectMysql({ tabela })
    //         return result
    //     } catch (error) {
    //         console.error('Erro ao buscar parâmetro:', error);
    //         return {
    //             success: false,
    //             message: 'Erro ao buscar parâmetro',
    //             error
    //         };
    //     }
    // }
