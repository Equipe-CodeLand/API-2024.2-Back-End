import selectMysql from "../middlewares/selectMysql"

export default class EstacaoController {

    static async buscarEstacoes(){
        const tabela = "estacao"

        try {
            const result = selectMysql({ tabela })
            return result
        } catch (error) {
            console.error('Erro ao buscar estação:', error);
            return {
              success: false,
              message: 'Erro ao buscar estação',
              error
            };
        }
    }
}