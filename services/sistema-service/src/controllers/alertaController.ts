import { Alerta } from "../interfaces/alerta";
import { TipoAlerta, Condicao } from "../enums/alertaEnum"
import { db } from "../config";
import { Request, Response } from "express";
import isValorEnum from "../middleware/verificadorDadosJsonParaEnum";
import NotificacaoController from "./notificacaoController";

const colecaoAlerta = db.collection('Alerta');
const colecaoParametros = db.collection("Parametros");

// Função para buscar o valor do parâmetro atual
async function buscarValorParametro(parametroId: string) {
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

// Função para verificar a condição do alerta com base no valor do parâmetro atual
function verificarCondicao(valorAtual: number, valorAlerta: number, condicao: Condicao): boolean {
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

export default class AlertaController {

    // Função para cadastrar o alerta
    static async cadastrarAlerta(req: Request, res: Response) {
        const { estacaoId, parametroId, mensagemAlerta, tipoAlerta, condicao, valor } = req.body;

        try {
            // Verifica se os dados necessários estão presentes
            if (!estacaoId || !parametroId) {
                return res.status(400).json({ erro: "ID da estação e do parâmetro são obrigatórios." });
            }

            // Buscar o fator atual do parâmetro
            const fator = await buscarValorParametro(parametroId);
            if (fator === null) {
                return res.status(400).json({ erro: "Fator não encontrado." });
            }

            // Cadastrar o alerta no Firestore
            const novoAlertaRef = colecaoAlerta.doc();
            const novoAlertaId = novoAlertaRef.id;
            const timestampAtual = new Date().toISOString();

            await novoAlertaRef.set({
                id: novoAlertaId,
                estacaoId,
                parametroId,
                mensagemAlerta,
                tipoAlerta,
                condicao,
                valor,
                criadoEm: timestampAtual,
                atualizadoEm: timestampAtual,
            });

            // Buscar o valor atual do parâmetro da estação
            const parametroAtual = await buscarValorParametro(parametroId);
            console.log(`Parâmetro atual: ${parametroAtual}`);

            if (parametroAtual === null || parametroAtual === undefined) {
                return res.status(400).json({ erro: "Parâmetro atual não encontrado." });
            }

            // Verificar se o alerta é ativado
            const alertaAtivado = verificarCondicao(parametroAtual, valor, condicao);
            if (alertaAtivado) {
                // Cadastrar notificação
                const resultadoNotificacao = await NotificacaoController.cadastrarNotificacao({
                    body: {
                        parametroId,
                        alertaId: novoAlertaId,
                        mensagemAlerta,
                        estacaoId
                    },
                } as Request, res);

                if (resultadoNotificacao?.status && typeof resultadoNotificacao.status === 'number') {
                    console.log("Notificação cadastrada com sucesso:", resultadoNotificacao);
                } else {
                    console.error("Erro ao cadastrar notificação:", resultadoNotificacao);
                    if (!res.headersSent) {
                        return res.status(500).json({ erro: "Erro ao cadastrar notificação." });
                    }
                }
            }

            if (!res.headersSent) {
                return res.status(201).json({
                    id: novoAlertaId,
                    estacaoId,
                    parametroId,
                    mensagemAlerta,
                    tipoAlerta,
                    condicao,
                    valor,
                    criadoEm: timestampAtual,
                    atualizadoEm: timestampAtual,
                });
            }
        } catch (erro) {
            console.error("Erro ao cadastrar alerta:", erro);
            if (!res.headersSent) {
                res.status(500).json({ erro: "Erro ao cadastrar alerta" });
            }
        }
    }

    // Função para obter todos os alertas
    static async obterAlertas(req: Request, res: Response) {
        try {
            const alertas = await colecaoAlerta.get();
            const listaAlertas: Alerta[] = [];

            alertas.forEach((alerta) => {
                listaAlertas.push(alerta.data() as Alerta);
            });

            return res.status(200).json(listaAlertas);
        } catch (erro) {
            console.error("Erro ao buscar alertas:", erro);
            return res.status(500).json({ erro: "Erro ao buscar alertas" });
        }
    }

    // Função para obter os alertas por estação
    static async obterAlertaPorEstacao(req: Request, res: Response) {
        try {
            const estacaoId = req.params.id;
            const alertas = await colecaoAlerta.where('estacaoId', '==', estacaoId).get();
            const listaAlertas: Alerta[] = [];

            alertas.forEach((alerta) => {
                listaAlertas.push(alerta.data() as Alerta);
            });

            return res.status(200).json(listaAlertas);
        } catch (erro) {
            console.error("Erro ao buscar alertas:", erro);
            return res.status(500).json({ erro: "Erro ao buscar alertas" });
        }
    }

    // Função para atualizar os alertas
    static async atualizarAlerta(req: Request, res: Response) {
        try {
            const alertaId = req.body.id;
            const alerta = req.body;
    
            // Buscar o alerta no banco de dados
            const alertaDoc = await colecaoAlerta.doc(alertaId).get();
    
            if (!alertaDoc.exists) {
                return res.status(404).json({ erro: "Alerta não encontrado" });
            }
    
            // Verifica se o ID da estação está presente
            const estacaoId = alerta.estacaoId;
            if (!estacaoId) {
                return res.status(400).json({ erro: "ID da estação é obrigatório." });
            }
    
            // Verifica se o ID do parâmetro está presente
            const parametroId = alerta.parametroId;
            if (!parametroId) {
                return res.status(400).json({ erro: "ID do parâmetro é obrigatório." });
            }
    
            // Verifica se o tipo de alerta é válido
            if (!isValorEnum(TipoAlerta, alerta.tipoAlerta)) {
                return res.status(400).json({ erro: "Tipo de alerta inválido." });
            }
    
            // Verifica se a condição é válida
            if (!isValorEnum(Condicao, alerta.condicao)) {
                return res.status(400).json({ erro: "Condição inválida." });
            }
    
            // Obter a data e hora atuais para o campo atualizadoEm
            const timestampAtual = new Date().toISOString();
    
            // Atualizar o alerta no banco de dados
            await colecaoAlerta.doc(alertaId).update({
                estacaoId: estacaoId,
                parametroId: parametroId,
                mensagemAlerta: alerta.mensagemAlerta,
                tipoAlerta: alerta.tipoAlerta,
                condicao: alerta.condicao,
                valor: alerta.valor,
                criadoEm: alerta.criadoEm,
                atualizadoEm: timestampAtual,
            });
    
            return res.status(200).json({ message: 'Alerta atualizado com sucesso' });
        } catch (erro) {
            console.error("Erro ao atualizar alerta:", erro);
            res.status(500).json({ erro: "Erro ao atualizar alerta" });
        }
    }

    // Função para deletar por estação
    static async deletarAlerta(req: Request, res: Response) {
        try {
            const alertaId = req.body.id;
            await colecaoAlerta.doc(alertaId).delete();

            return res.status(200).json({ message: 'Alerta deletado com sucesso' });
        } catch (erro) {
            console.error("Erro ao deletar alerta:", erro);
            res.status(500).json({ erro: "Erro ao deletar alerta" });
        }
    }
}