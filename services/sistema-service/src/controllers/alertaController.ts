import { Alerta } from "../interfaces/alerta";
import insertMysql from "../middlewares/insertMysql";
import { TipoAlerta, Condicao } from "../enums/alertaEnum";
import deleteMysql from "../middlewares/deleteMysql";
import selectAlertaMysql from "../middlewares/selectAlertaMysql";
export default class AlertaController {
    // Função para cadastrar um novo alerta
    static async cadastrarAlerta(alerta: Alerta) {
        const tabela = 'Alerta'; 
        const colunas = [
            'estacaoId', 
            'parametroId', 
            'mensagemAlerta', 
            'tipoAlerta', 
            'condicao', 
            'valor'
        ]; 
        
        const valores = [
            alerta.estacaoId,
            alerta.parametroId,
            alerta.mensagemAlerta,
            alerta.tipoAlerta,
            alerta.condicao,
            alerta.valor
        ];
        
        if (valores.some(val => val === undefined)) {
            throw new Error('Todos os campos obrigatórios devem estar preenchidos.');
        }        
             
        try {
        
            const result: any = await insertMysql({ tabela, colunas, valores });
            console.log('Alerta inserido com sucesso');

            return {
                success: true,
                message: 'Alerta cadastrado com sucesso',
                result: result
            };
        } catch (error) {
            console.error('Erro ao cadastrar Alerta:', error);
            return {
                success: false,
                message: 'Erro ao cadastrar Alerta',
                error
            };
        }
    }      
      
    static async obterAlertas() {
        try {
            // Definindo as colunas que você deseja selecionar, incluindo o nome do parâmetro
            const selectColumns = `A.*, E.nome AS nomeEstacao, P.nome AS nomeParametro`;
            
            // Especificando as joins necessárias
            const joins = `
                JOIN Estacao E ON A.estacaoId = E.id
                JOIN Parametro P ON A.parametroId = P.id
            `;
    
            // Chamada ao selectMysql com as novas opções
            const result = await selectAlertaMysql({
                tabela: 'Alerta A', // Usando alias para Alerta
                select: selectColumns,
                joins: joins,
            });
    
            // Verifica se o resultado existe e contém dados
            if (Array.isArray(result) && result.length > 0) {
                return {
                    success: true,
                    alertas: result,
                };
            } else {
                return {
                    success: false,
                    message: 'Nenhum alerta encontrado',
                };
            }
        } catch (error) {
            console.error('Erro ao buscar alerta:', error);
            return {
                success: false,
                message: 'Erro ao buscar alerta',
                error,
            };
        }
    }

    static async deletarAlerta(alertaId: number) {
        const tabela = 'Alerta';
        const where = `id = ${alertaId}`; // Adicionando a condição no formato esperado
    
        try {
            const result: any = await deleteMysql({ tabela, where });
            if (result.affectedRows > 0) {
                console.log('Alerta deletado com sucesso');
                return {
                    success: true,
                    message: 'Alerta deletado com sucesso',
                    result: result
                };
            } else {
                return {
                    success: false,
                    message: 'Nenhum alerta encontrado com o ID fornecido',
                };
            }
        } catch (error) {
            console.error('Erro ao deletar alerta:', error);
            return {
                success: false,
                message: 'Erro ao deletar alerta',
                error
            };
        }
    }
    

}
