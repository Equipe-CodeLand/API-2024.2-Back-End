import selectMysql from "../middlewares/selectMysql";

export default class ParametroController {

    static async buscarParametros() {
        const tabela = "parametro"

        try {
            const result = selectMysql({ tabela })
            return result
        } catch (error) {
            console.error('Erro ao buscar parâmetro:', error);
            return {
                success: false,
                message: 'Erro ao buscar parâmetro',
                error
            };
        }
    }

    static async buscarParametrosEstacao(idEstacao: number) {
        try {
            const result = await selectMysql({
                tabela: 'parametro p',
                joins: `
                    INNER JOIN estacao_parametro ep ON p.id = ep.parametro_id
                    INNER JOIN estacao e ON ep.estacao_id = e.id`,
                where: `e.id = ${idEstacao}`
            });
            return result
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