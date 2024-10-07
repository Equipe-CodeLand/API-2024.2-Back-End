import { Condicao } from "../enums/alertaEnum";

// Função para verificar a condição do alerta com base no valor do parâmetro atual
export function verificarCondicao(valorAtual: number, valorAlerta: number, condicao: Condicao): boolean {
    switch (condicao) {
        case Condicao.Maior:
            return valorAtual > valorAlerta;
        case Condicao.Menor:
            return valorAtual < valorAlerta;
        case Condicao.MaiorIgual:
            return valorAtual >= valorAlerta;
        case Condicao.MenorIgual:
            return valorAtual <= valorAlerta;
        case Condicao.Igual:
            return valorAtual === valorAlerta;
        default:
            return false;
    }
}
