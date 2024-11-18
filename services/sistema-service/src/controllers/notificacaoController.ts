import { Request, Response } from "express";
import { db } from "../config";
import TimestampFormatado from "../middleware/timestampFormatado";

const colecaoNotificacao = db.collection('Notificacao');

export default class NotificacaoController {

    // Função para cadastrar notificação
    static async cadastrarNotificacao(req: Request, res: Response) {
        try {
            const dados = req.body;

            // Verifica se o ID do parâmetro está presente
            const parametroId = dados.parametroId;
            if (!parametroId) {
                console.log(parametroId)
                return res.status(400).json({ erro: "ID do parâmetro é obrigatório." });
            }

            // Verifica se o ID do parâmetro está presente
            const estacaoId = dados.estacaoId;
            if (!estacaoId) {
                console.log(estacaoId)
                return res.status(400).json({ erro: "ID do parâmetro é obrigatório." });
            }

            // Verifica se o ID do parâmetro está presente
            const alertaId = dados.alertaId;
            if (!alertaId) {
                console.log(alertaId)
                return res.status(400).json({ erro: "ID do alerta é obrigatório." });
            }

            // Criar referência para a nova estação
            const novaNotificacaoRef = colecaoNotificacao.doc();
            const novaNotificacaoId = novaNotificacaoRef.id;

            // Gravar nova estação no Firestore
            await novaNotificacaoRef.set({
                id: novaNotificacaoId,
                mensagemAlerta: dados.mensagemAlerta,
                dataNotificacao: TimestampFormatado(),
                alertaId: alertaId,
                parametroId: parametroId,
                estacaoId: estacaoId,
            });

            return res.status(201).json({ mensagem: "Notificação cadastrada com sucesso" });
        } catch (erro) {
            console.error("Erro ao cadastrar notificação:", erro);
            res.status(404).json({ erro: "Não foi cadastrar a notificação " })
        }
    }

    // Função para obter notificações
    static async obterNotificacoes(req: Request, res: Response) {
        try {
            // Buscar todas as notificações no banco de dados
            const notificacoesSnapshot = await colecaoNotificacao.get();

            if (notificacoesSnapshot.empty) {
                return res.status(404).json({ erro: "Nenhuma notificação encontrada" });
            }

            // Retornar a lista de notificações encontradas
            const notificacoes = notificacoesSnapshot.docs.map(doc => doc.data());
            return res.status(200).json(notificacoes);
        } catch (erro) {
            console.error("Erro ao obter notificações:", erro);
            res.status(500).json({ erro: "Erro ao obter notificações" });
        }
    }

    // Função para buscar notificação por estação
    static async buscarNotificacaoPorEstacao(req: Request, res: Response) {
        try {
            const estacaoId = req.body.estacaoId;

            // Verificar se o ID da estação foi informado
            if (!estacaoId) {
                return res.status(400).json({ erro: "ID da estação é obrigatório." });
            }

            // Buscar notificações pelo ID da estação
            const notificacoesSnapshot = await colecaoNotificacao.where('estacaoId', '==', estacaoId).get();

            // Verificar se foram encontradas notificações
            if (notificacoesSnapshot.empty) {
                return res.status(404).json({ erro: "Nenhuma notificação encontrada para esta estação." });
            }

            // Retornar a lista de notificações encontradas
            const notificacoes = notificacoesSnapshot.docs.map(doc => doc.data());
            return res.status(200).json(notificacoes);
        } catch (erro) {
            console.error("Erro ao buscar notificações por estação:", erro);
            res.status(500).json({ erro: "Erro ao buscar notificações por estação" });
        }
    }

    // Função para buscar as notificações da estação nas últimas 24 horas
    static async buscarNotificacaoDaEstacaoNasUltimas24Horas(req: Request, res: Response) {
        try {
            const estacaoId = req.body.estacaoId;
    
            // Verificar se o ID da estação foi informado
            if (!estacaoId) {
                return res.status(400).json({ erro: "ID da estação é obrigatório." });
            }
    
            // Obter a data e hora atuais
            const dataAtual = new Date();
    
            // Subtrair 24 horas da data e hora atuais
            const data24HorasAtras = new Date(dataAtual.getTime() - 24 * 60 * 60 * 1000);
    
            // Função para converter uma string no formato "dd/mm/yyyy hh:mm:ss" para um objeto Date
            function converterParaData(dataStr: string): Date {
                const [dia, mes, anoHora] = dataStr.split('/');
                const [ano, hora] = anoHora.split(' ');
                const [horas, minutos, segundos] = hora.split(':');
                return new Date(
                    Number(ano),
                    Number(mes) - 1, // Mês em JavaScript começa de 0 (janeiro é 0)
                    Number(dia),
                    Number(horas),
                    Number(minutos),
                    Number(segundos)
                );
            }
    
            // Buscar notificações pelo ID da estação
            const notificacoesSnapshot = await colecaoNotificacao
                .where('estacaoId', '==', estacaoId)
                .get();
    
            // Verificar se foram encontradas notificações
            if (notificacoesSnapshot.empty) {
                return res.status(404).json({ erro: "Nenhuma notificação encontrada para esta estação nas últimas 24 horas." });
            }
    
            // Filtrar notificações das últimas 24 horas
            const notificacoes = notificacoesSnapshot.docs
                .map(doc => doc.data())
                .filter((notificacao) => {
                    const dataNotificacao = converterParaData(notificacao.dataNotificacao);
                    return dataNotificacao >= data24HorasAtras;
                });
    
            // Verificar se foram encontradas notificações nas últimas 24 horas
            if (notificacoes.length === 0) {
                return res.status(404).json({ erro: "Nenhuma notificação encontrada para esta estação nas últimas 24 horas." });
            }
    
            // Retornar a lista de notificações encontradas
            return res.status(200).json(notificacoes);
        } catch (erro) {
            console.error("Erro ao buscar notificações da estação nas últimas 24 horas:", erro);
            res.status(500).json({ erro: "Erro ao buscar notificações da estação nas últimas 24 horas" });
        }
    }    
}