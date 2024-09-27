import { Alerta } from "../interfaces/alerta";
import insertMysql from "../middlewares/insertMysql";
import { TipoAlerta, Condicao } from "../enums/alertaEnum";
import deleteMysql from "../middlewares/deleteMysql";

export default class AlertaController {

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

    
    static async deletarAlerta(id: number) {
        try {
          // Deletar o alerta com o id fornecido
          const result = await deleteMysql({ tabela: 'Alerta', where: `id = ${id}` });
          console.log('Alerta deletado com sucesso');
          
          return {
            success: true,
            message: 'Alerta deletado com sucesso',
            insertId: result
          };
        } catch (error) {
          console.error('Erro ao deletar Alerta:', error);
          return {
            success: false,
            message: 'Erro ao deletar Alerta',
            error
          };
        }
      }
      
}
