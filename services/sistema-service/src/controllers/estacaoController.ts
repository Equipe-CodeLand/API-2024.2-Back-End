import { log } from "node:console";
import { Estacao } from "../interfaces/estacao";
import selectMysql from "../middlewares/selectMysql"
import ParametroController from "./parametroController";

export default class EstacaoController {

    static async buscarEstacoes() {
        const tabela = "estacao";
    
        try {
            const result = await selectMysql({ tabela }) as any;
    
            // Verifique se o resultado é um array
            if (Array.isArray(result) && result.length !== 0) {
                // Processar cada estação
                const estacoes = await Promise.all(result.map(async (estacao) => {    
                    // Buscar parâmetros e notificações da estação
                    estacao.parametros = await ParametroController.buscarParametrosEstacao(estacao.id);
                    estacao.status = await this.verificarAlertas(estacao.id);
                    return estacao;
                }));
    
                return estacoes;
            }
    
            // Caso não haja estações
            return [];
        } catch (error) {
            console.error('Erro ao buscar estação:', error);
            return {
                success: false,
                message: 'Erro ao buscar estação',
                error
            };
        }
    }
    

    static async verificarAlertas(estacaoId: number) {
        const tabela = "notificacao n"
        const joins = ` INNER JOIN alerta a ON a.id = n.alertaId INNER JOIN estacao e ON a.estacaoId = e.id`

        /* calcular 24 horas atrás */
        const hoje = new Date();
        const milissegundos = 86400000;
        const ontem = new Date(hoje.getTime() - milissegundos);

        const where = `a.estacaoId = ${estacaoId} AND dataNotificacao > ${ontem.getDate()}`

        try {
            const result = await selectMysql({ tabela, where, joins })
            if (Array.isArray(result)) {
                if (result.length > 0) {
                    return 'Alerta'
                }
            }
            return 'Ok'
        } catch (error) {
            console.error('Erro ao buscar alertas:', error);
            return {
                success: false,
                message: 'Erro ao buscar alertas',
                error
            };
        }
    }
}