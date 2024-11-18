import { Request, Response } from "express";
import { Estacao } from "../interfaces/estacao";
import { db } from "../config";
import TimestampFormatado from "../middleware/timestampFormatado";

const colecaoEstacao = db.collection("Estacao");
const colecaoParametros = db.collection("Parametros");

export default class EstacaoController {

    // Função para cadastrar estação
    static async cadastrarEstacao(req: Request, res: Response) {
        try {
            const dados: Estacao = req.body;

            // Verifica se os IDs dos parâmetros estão presentes
            const parametros = dados.parametros;
            if (!parametros || !Array.isArray(parametros) || parametros.length === 0) {
                return res.status(400).json({ erro: "IDs dos parâmetros são obrigatórios." });
            }

            // Buscar cada parâmetro pelo ID no Firestore
            const parametrosPromises = parametros.map(async (parametroId) => {
                const parametroRef = colecaoParametros.doc(parametroId);
                const parametroEncontrado = await parametroRef.get();
                if (!parametroEncontrado.exists) {
                    throw new Error(`Parâmetro com ID ${parametroId} não encontrado.`);
                }
                return parametroEncontrado.data();
            });

            // Executa todas as promessas para buscar os parâmetros
            await Promise.all(parametrosPromises);

            // Criar referência para a nova estação
            const novaEstacaoRef = colecaoEstacao.doc();
            const novaEstacaoId = novaEstacaoRef.id;

            // Gravar nova estação no Firestore
            await novaEstacaoRef.set({
                id: novaEstacaoId,
                nome: dados.nome,
                uid: dados.uid,
                cep: dados.cep,
                numero: dados.numero,
                bairro: dados.bairro,
                cidade: dados.cidade,
                rua: dados.rua,
                latitude: dados.latitude || null,
                longitude: dados.longitude || null,
                atualizadoEm: TimestampFormatado(),
                criadoEm: TimestampFormatado(),
                parametros: parametros, // IDs dos parâmetros vinculados
            });

            // Retornar a resposta com o ID da nova estação e os dados da estação
            const { ...dadosSemId } = dados;
            console.log("cadastro feito com sucesso")
            return res.status(201).json({ ...dadosSemId, id: novaEstacaoId, parametros, criadoEm: TimestampFormatado(), atualizadoEm: TimestampFormatado() });
        } catch (error) {
            console.error("Erro ao cadastrar estação:", error);
            return res.status(500).json({ erro: "Falha ao cadastrar estação." });
        }
    }

    // Função para buscar todas as estações
    static async buscarEstacoes(req: Request, res: Response) {
        try {
            const estacaoSnapshot = await colecaoEstacao.get();
            const estacoes = estacaoSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<Estacao, 'id'>
            }))

            res.status(200).json(estacoes);
        } catch (error) {
            console.error("Erro ao buscar estações:", error);
            res.status(500).json({ erro: "Falha ao buscar estações" });
        }
    }

    // Função para buscar estação por ID
    static async buscarEstacaoPorId(req: Request, res: Response) {
        try {
            const estacaoId = req.params.id; //busca o id pela rota, e não pelo body
            const estacaoRef = colecaoEstacao.doc(estacaoId);
            const estacaoEncontrada = await estacaoRef.get();

            if (!estacaoEncontrada.exists) {
                res.status(404).json({ erro: "Estação não encontrada" });
                return;
            }

            const dados = estacaoEncontrada.data();
            res.status(200).json({ id: estacaoEncontrada.id, ...dados });
        } catch (error) {
            console.error("Erro ao buscar estação por ID:", error);
            res.status(500).json({ erro: "Falha ao buscar estação" });
        }
    }

    // Função para atualizar estação
    static async atualizarEstacao(req: Request, res: Response) {
        try {
            const dadosAtualizados = req.body;

            // Verifica se o ID da estação foi informado
            if (!dadosAtualizados.id) {
                res.status(400).json({ erro: "ID do estação é obrigatório" });
                console.log("ID do estação é obrigatório");
            }

            // Buscar a estação no Firestore
            const estacaoRef = colecaoEstacao.doc(dadosAtualizados.id);
            const estacaoAtualizada = await estacaoRef.get();

            // Verifica se a estação foi encontrada
            if (!estacaoAtualizada.exists) {
                res.status(404).json({ erro: "Estação não encontrado" });
                console.log("Estação não encontrado");
            }

            // Usar a função timestampFormatado para formatar a data atual
            dadosAtualizados.atualizado = TimestampFormatado(); 

            await estacaoRef.update(dadosAtualizados); // Atualizar a estação
            res.status(200).json({ mensagem: "Estação atualizada com sucesso!", id: dadosAtualizados.id });
        } catch (error) {
            console.error("Erro ao atualizar estação:", error); // Log completo do erro
            res.status(500).json({ erro: "Falha ao editar estação" });
        }
    }

    // Função para deletar estação
    static async deletarEstacao(req: Request, res: Response) {
        try {
            const { id } = req.params; // Obtém o ID da URL
            await colecaoEstacao.doc(id).delete();

            res.status(204).end();
        } catch (error) {
            console.error("Erro ao excluir estação:", error);
            res.status(500).json({ erro: "Falha ao excluir estação" });
        }
    }
}