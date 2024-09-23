import { Alerta } from "../interfaces/alerta";
import insertMysql from "../middlewares/insertMysql";
import { TipoAlerta, Condicao } from "../enums/alertaEnum"; // Importar os enums

export default class AlertaController {
    // Função para cadastrar um novo alerta
    static async cadastrarAlerta(alerta: Alerta) {
        const tabela = 'Alerta'; // Nome da tabela no banco de dados (com 'A' maiúsculo conforme a definição da tabela)
        const colunas = [
            'estacaoId', 
            'parametroId', 
            'mensagemAlerta', 
            'tipoAlerta', 
            'condicao', 
            'valor'
        ]; // Colunas que vão ser inseridas na tabela Alerta

        // Verifica se os campos obrigatórios estão presentes e usa os enums
        const valores = [
            alerta.estacaoId,
            alerta.parametroId,
            alerta.mensagemAlerta,
            alerta.tipoAlerta,
            alerta.condicao,
            alerta.valor
        ];
        
        // Verifica se algum valor é undefined
        if (valores.some(val => val === undefined)) {
            throw new Error('Todos os campos obrigatórios devem estar preenchidos.');
        }        
             

        try {
            // Inserir o alerta na tabela 'Alerta'
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
}
