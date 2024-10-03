import { Request, Response } from "express";
import { db } from "../config";

const colecaoNotificacao = db.collection('Notificacao');

export default class NotificacaoController {

    static async cadastrarNotificacao(req: Request, res: Response){
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
    
            // Obter a data e hora atuais para os campos criadoEm e atualizadoEm
            const timestampAtual = new Date().toISOString();
    
            // Gravar nova estação no Firestore
            await novaNotificacaoRef.set({
                id: novaNotificacaoId,
                mensagemAlerta: dados.mensagemAlerta,
                dataNotificacao: timestampAtual,
                alertaId: alertaId,
                parametroId: parametroId, 
                estacaoId: estacaoId,
            });

            return res.status(201).json({ mensagem: "Notificação cadastrada com sucesso" });
        } catch (erro) {
            res.status(404).json({ erro: "Não foi cadastrar a notificação "})
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
            
        } catch (erro) {

        }
    }
}