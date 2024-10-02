import { Alerta } from "../interfaces/alerta";
import { TipoAlerta, Condicao } from "../enums/alertaEnum"
import { db } from "../config";
import { Request, Response } from "express";

const colecaoAlerta = db.collection('Alerta');

function isValorEnum<T extends object>(enumObj: T, valor: string): boolean {
    return Object.values(enumObj).includes(valor as unknown as T[keyof T]);
}
export default class AlertaController {

    // Função para cadastrar um novo alerta
    static async cadastrarAlerta(req: Request, res: Response) {
        try {
            const dados: Alerta = req.body;
    
            // Verifica se o ID da estação está presente
            const estacaoId = dados.estacaoId;
            if (!estacaoId) {
                return res.status(400).json({ erro: "ID da estação é obrigatório." });
            }
    
            // Verifica se o ID do parâmetro está presente
            const parametroId = dados.parametroId;
            if (!parametroId) {
                return res.status(400).json({ erro: "ID do parâmetro é obrigatório." });
            }
    
            // Verifica se o tipo de alerta é válido
            if (!isValorEnum(TipoAlerta, dados.tipoAlerta)) {
                return res.status(400).json({ erro: "Tipo de alerta inválido." });
            }
    
            // Verifica se a condição é válida
            if (!isValorEnum(Condicao, dados.condicao)) {
                return res.status(400).json({ erro: "Condição inválida." });
            }
    
            // Criar referência para o novo alerta
            const novoAlertaRef = colecaoAlerta.doc();
            const novoAlertaId = novoAlertaRef.id;
    
            // Obter a data e hora atuais para os campos criadoEm e atualizadoEm
            const timestampAtual = new Date().toISOString();
    
            // Gravar novo alerta no Firestore
            await novoAlertaRef.set({
                id: novoAlertaId,
                estacaoId: estacaoId,
                parametroId: parametroId,
                mensagemAlerta: dados.mensagemAlerta,
                tipoAlerta: dados.tipoAlerta,
                condicao: dados.condicao,
                valor: dados.valor,
                criadoEm: timestampAtual,
                atualizadoEm: timestampAtual,
            });
    
            // Retornar a resposta com o ID do novo alerta e os dados do alerta
            const { id, ...dadosSemId } = dados;
            return res.status(201).json({ id: novoAlertaId, ...dadosSemId, criadoEm: timestampAtual, atualizadoEm: timestampAtual });
        } catch (erro) {
            console.error("Erro ao cadastrar alerta:", erro);
            res.status(500).json({ erro: "Erro ao cadastrar alerta" });
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