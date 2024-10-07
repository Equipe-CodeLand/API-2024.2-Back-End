import { Alerta } from "../interfaces/alerta";
import { TipoAlerta, Condicao } from "../enums/alertaEnum"
import { db } from "../config";
import { Request, Response } from "express";
import isValorEnum from "../middleware/verificadorDadosJsonParaEnum";
import NotificacaoController from "./notificacaoController";
import { buscarValorParametro } from "../middleware/buscarValorParametro";
import { verificarCondicao } from "../middleware/verificadorCondicaoAlerta";
import TimestampFormatado from "../middleware/timestampFormatado";

const colecaoAlerta = db.collection('Alerta');
export default class AlertaController {

    // Função para cadastrar o alerta
    static async cadastrarAlerta(req: Request, res: Response) {
        const { estacaoId, parametroId, mensagemAlerta, tipoAlerta, condicao, valor } = req.body;
    
        try {
            // Verifica se o id da estação e do parâmetro estão presentes
            if (!estacaoId || !parametroId) {
                return res.status(400).json({ erro: "ID da estação e do parâmetro são obrigatórios." });
            }
    
            // Buscar o fator atual do parâmetro
            const fator = await buscarValorParametro(parametroId);
            if (fator === null) {
                return res.status(400).json({ erro: "Fator não encontrado." });
            }
    
            // Criação uma nova referência de documento na coleção 'colecaoAlerta' no Firestore e pegando o id do alerta
            const novoAlertaRef = colecaoAlerta.doc();
            const novoAlertaId = novoAlertaRef.id;
    
            // Cadastrar o alerta no Firestore
            await novoAlertaRef.set({
                id: novoAlertaId,
                estacaoId,
                parametroId,
                mensagemAlerta,
                tipoAlerta,
                condicao,
                valor,
                criadoEm: TimestampFormatado(), // Formatação da data e hora atual (função no middleware)
                atualizadoEm: TimestampFormatado(), // Formatação da data e hora atual (função no middleware)
            });
    
            // Buscar o valor atual do parâmetro da estação
            const parametroAtual = await buscarValorParametro(parametroId);
            console.log(`Parâmetro atual: ${parametroAtual}`);
    
            // Verificar se o parâmetro atual foi encontrado
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
    
                // Verificar se a notificação foi cadastrada com sucesso
                if (resultadoNotificacao?.status && typeof resultadoNotificacao.status === 'number') {
                    console.log("Notificação cadastrada com sucesso:", resultadoNotificacao);
                } else {
                    if (!res.headersSent) {
                        return res.status(500).json({ erro: "Erro ao cadastrar notificação." });
                    }
                }
            }
    
            // Retornar o alerta cadastrado
            if (!res.headersSent) {
                return res.status(201).json({
                    id: novoAlertaId,
                    estacaoId,
                    parametroId,
                    mensagemAlerta,
                    tipoAlerta,
                    condicao,
                    valor,
                    criadoEm: TimestampFormatado(),
                    atualizadoEm: TimestampFormatado(),
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
            const alertas = await colecaoAlerta.get(); // Buscar todos os alertas
            const listaAlertas: Alerta[] = []; // Lista de alertas

            // Adicionar os alertas na lista
            alertas.forEach((alerta) => {
                listaAlertas.push(alerta.data() as Alerta);
            });

            return res.status(200).json(listaAlertas); // Retornar a lista de alertas
        } catch (erro) {
            console.error("Erro ao buscar alertas:", erro);
            return res.status(500).json({ erro: "Erro ao buscar alertas" });
        }
    }

    // Função para obter os alertas por estação
    static async obterAlertaPorEstacao(req: Request, res: Response) {
        try {
            const estacaoId = req.params.id; // ID da estação
            const alertas = await colecaoAlerta.where('estacaoId', '==', estacaoId).get(); // Buscar os alertas da estação
            const listaAlertas: Alerta[] = []; // Lista de alertas

            // Adicionar os alertas na lista
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
            const alertaId = req.body.id; // ID do alerta
            const alerta = req.body; // Alerta
    
            // Buscar o alerta no banco de dados
            const alertaDoc = await colecaoAlerta.doc(alertaId).get();
    
            // Verifica se o alerta foi encontrado
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
    
            // Atualizar o alerta no banco de dados
            await colecaoAlerta.doc(alertaId).update({
                estacaoId: estacaoId,
                parametroId: parametroId,
                mensagemAlerta: alerta.mensagemAlerta,
                tipoAlerta: alerta.tipoAlerta,
                condicao: alerta.condicao,
                valor: alerta.valor,
                criadoEm: alerta.criadoEm,
                atualizadoEm: TimestampFormatado(),
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
            const alertaId = req.body.id; // ID do alerta
            await colecaoAlerta.doc(alertaId).delete(); // Deletar o alerta

            return res.status(200).json({ message: 'Alerta deletado com sucesso' });
        } catch (erro) {
            console.error("Erro ao deletar alerta:", erro);
            res.status(500).json({ erro: "Erro ao deletar alerta" });
        }
    }
}