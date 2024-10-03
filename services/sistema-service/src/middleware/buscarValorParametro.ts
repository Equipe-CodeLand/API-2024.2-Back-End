import { db } from "../config";

const colecaoParametros = db.collection("Parametros");

// Função para buscar o valor do parâmetro atual
export async function buscarValorParametro(parametroId: string) {
    console.log(`Buscando valor para o parametroId: ${parametroId}`);
    try {
        const parametroRef = colecaoParametros.doc(parametroId);
        const parametroEncontrado = await parametroRef.get();

        if (!parametroEncontrado.exists) {
            console.error("Parâmetro não encontrado");
            return null;
        }

        const dadosParametro = parametroEncontrado.data();

        console.log(`Dados do parâmetro encontrados: ${JSON.stringify(dadosParametro)}`);

        if (!dadosParametro || typeof dadosParametro.fator === 'undefined') {
            console.error("Valor do parâmetro não encontrado ou está indefinido");
            return null;
        }

        console.log(`Valor do fator encontrado: ${dadosParametro.fator}`);

        return dadosParametro.fator;
    } catch (error) {
        console.error("Erro ao buscar valor do parâmetro:", error);
        return null;
    }
}