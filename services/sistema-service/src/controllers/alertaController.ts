import { Alerta } from "../interfaces/alerta";
import { TipoAlerta, Condicao } from "../enums/alertaEnum"
import { db } from "../config";
import { Request, Response } from "express";
import isValorEnum from "../middleware/verificadorDadosJsonParaEnum";
import NotificacaoController from "./notificacaoController";
import { buscarValorParametro } from "../middleware/buscarValorParametro";
import { verificarCondicao } from "../middleware/verificadorCondicaoAlerta";

const colecaoAlerta = db.collection('Alerta');
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
            
            // Obter a data e hora atuais
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
            const ano = dataAtual.getFullYear();
            const horas = String(dataAtual.getHours()).padStart(2, '0');
            const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
            const segundos = String(dataAtual.getSeconds()).padStart(2, '0');
            
            const timestampFormatado = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    
            await novoAlertaRef.set({
                id: novoAlertaId,
                estacaoId,
                parametroId,
                mensagemAlerta,
                tipoAlerta,
                condicao,
                valor,
                criadoEm: timestampFormatado,
                atualizadoEm: timestampFormatado,
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
                    criadoEm: timestampFormatado,
                    atualizadoEm: timestampFormatado,
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