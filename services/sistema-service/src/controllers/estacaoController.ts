import { log } from "node:console";
import { Estacao } from "../interfaces/estacao";
import selectMysql from "../middlewares/selectMysql"
import ParametroController from "./parametroController";
import insertMysql from "../middlewares/insertMysql";

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
        const tabela = "notificacao n";
        const joins = `INNER JOIN alerta a ON a.id = n.alertaId INNER JOIN estacao e ON a.estacaoId = e.id`;
    
        // Calcular a data de 24 horas atrás
        const hoje = new Date();
        const milissegundos = 97200000;
        const ontem = new Date(hoje.getTime() - milissegundos);
    
        // Formatar a data de 'ontem' no formato SQL (YYYY-MM-DD HH:MM:SS)
        const ontemISO = ontem.toISOString().slice(0, 19).replace('T', ' ');
    
        console.log(ontemISO);
        const where = `a.estacaoId = ${estacaoId} AND n.dataNotificacao > '${ontemISO}'`;
    
        try {
            const result = await selectMysql({ tabela, where, joins });
            if (Array.isArray(result) && result.length > 0) {
                return 'Alerta';
            }
            return 'Ok';
        } catch (error) {
            console.error('Erro ao buscar alertas:', error);
            return {
                success: false,
                message: 'Erro ao buscar alertas',
                error
            };
        }
    }
    

    // Função para cadastrar uma nova estacao
    static async cadastrarEstacao(estacao: Estacao) {
        const tabela = 'estacao'; // Nome da tabela no banco de dados
        const colunas = ['nome', 'uid', 'cep', 'bairro', 'cidade', 'rua', 'numero']; // Colunas que vão ser inseridas
        const valores = [
            estacao.nome,
            estacao.uid,
            estacao.cep,
            estacao.bairro,
            estacao.cidade,
            estacao.rua,
            estacao.numero
        ];

        try {
            const result: any = await insertMysql({ tabela, colunas, valores });
            console.log('Estação inserido com sucesso');


            await Promise.all(
                estacao.parametros.map(async parametro => {
                    return insertMysql({
                        tabela: 'estacao_parametro',
                        colunas: ['estacao_id', 'parametro_id'],
                        valores: [result.insertId, parametro]
                    });
                })
            );

            return {
                success: true,
                message: 'Estação cadastrado com sucesso',
                result: result
            };
        } catch (error) {
            console.error('Erro ao cadastrar Estação:', error);
            return {
                success: false,
                message: 'Erro ao cadastrar Estação',
                error
            };
        }
    }
}
