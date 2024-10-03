import { Request, Response } from "express";
import { db } from "../config";

const colecaoNotificacao = db.collection('Notificacao');

export default class NotificacaoController {

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

            // Obter a data e hora atuais
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
            const ano = dataAtual.getFullYear();
            const horas = String(dataAtual.getHours()).padStart(2, '0');
            const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
            const segundos = String(dataAtual.getSeconds()).padStart(2, '0');
            
            const timestampFormatado = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;

            // Gravar nova estação no Firestore
            await novaNotificacaoRef.set({
                id: novaNotificacaoId,
                mensagemAlerta: dados.mensagemAlerta,
                dataNotificacao: timestampFormatado,
                alertaId: alertaId,
                parametroId: parametroId,
                estacaoId: estacaoId,
            });

            return res.status(201).json({ mensagem: "Notificação cadastrada com sucesso" });
        } catch (erro) {
            res.status(404).json({ erro: "Não foi cadastrar a notificação " })
        }
    }

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

    static async buscarNotificacaoPorEstacao(req: Request, res: Response) {
        try {
            const estacaoId = req.body.estacaoId;

            if (!estacaoId) {
                return res.status(400).json({ erro: "ID da estação é obrigatório." });
            }

            // Buscar notificações pelo ID da estação
            const notificacoesSnapshot = await colecaoNotificacao.where('estacaoId', '==', estacaoId).get();

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

    static async buscarNotificacaoDaEstacaoNasUltimas24Horas(req: Request, res: Response) {
        try {
            const estacaoId = req.body.estacaoId;

            if (!estacaoId) {
                return res.status(400).json({ erro: "ID da estação é obrigatório." });
            }

            // Obter a data e hora atuais
            const dataAtual = new Date();

            // Subtrair 24 horas da data e hora atuais
            const data24HorasAtras = new Date(dataAtual.getTime() - 24 * 60 * 60 * 1000);

            // Buscar notificações pelo ID da estação e pela data de notificação
            const notificacoesSnapshot = await colecaoNotificacao
                .where('estacaoId', '==', estacaoId)
                .where('dataNotificacao', '>=', data24HorasAtras.toISOString())
                .get();

            if (notificacoesSnapshot.empty) {
                return res.status(404).json({ erro: "Nenhuma notificação encontrada para esta estação nas últimas 24 horas." });
            }

            // Retornar a lista de notificações encontradas
            const notificacoes = notificacoesSnapshot.docs.map(doc => doc.data());
            return res.status(200).json(notificacoes);
        } catch (erro) {
            console.error("Erro ao buscar notificações da estação nas últimas 24 horas:", erro);
            res.status(500).json({ erro: "Erro ao buscar notificações da estação nas últimas 24 horas" });
        }
    }
}