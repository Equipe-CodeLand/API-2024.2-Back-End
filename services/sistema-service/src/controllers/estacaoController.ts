import { Request, Response } from "express";
import { Estacao } from "../interfaces/estacao";
import { db } from "../config";

const colecaoEstacao = db.collection("Estacao");
const colecaoParametros = db.collection("Parametros");

export default class EstacaoController {

    static async cadastrarEstacao(req: Request, res: Response) {
        try {
            const dados: Estacao = req.body;
            console.log(req.body)

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
            const parametrosEncontrados = await Promise.all(parametrosPromises);

            // Se chegou aqui, todos os parâmetros foram encontrados
            console.log('Parâmetros encontrados:', parametrosEncontrados);

            // Criar referência para a nova estação
            const novaEstacaoRef = colecaoEstacao.doc();
            const novaEstacaoId = novaEstacaoRef.id;

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
                atualizadoEm: timestampFormatado,
                criadoEm: timestampFormatado,
                parametros: parametros, // IDs dos parâmetros vinculados
            });

            // Retornar a resposta com o ID da nova estação e os dados da estação
            const { id, ...dadosSemId } = dados;
            console.log("cadastro feito com sucesso")
            return res.status(201).json({ id: novaEstacaoId, ...dadosSemId, parametros, criadoEm: timestampFormatado, atualizadoEm: timestampFormatado });
        } catch (error) {
            console.error("Erro ao cadastrar estação:", error);
            return res.status(500).json({ erro: "Falha ao cadastrar estação." });
        }
    }


    static async buscarEstacoes(req: Request, res: Response) {
        try {
            const estacaoSnapshot = await colecaoEstacao.get();
            const estacoes = estacaoSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<Estacao, 'id'>
            }))

            res.status(200).json(estacoes);
        } catch (error) {
            res.status(500).json({ erro: "Falha ao buscar estações" });
        }
    }

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

    static async atualizarEstacao(req: Request, res: Response) {
        try {
            const dadosAtualizados = req.body;
            console.log("Dados recebidos para atualização:", dadosAtualizados);

            if (!dadosAtualizados.id) {
                res.status(400).json({ erro: "ID do estação é obrigatório" });
                console.log("ID do estação é obrigatório");
            }

            const estacaoRef = colecaoEstacao.doc(dadosAtualizados.id);
            const estacaoAtualizada = await estacaoRef.get();

            if (!estacaoAtualizada.exists) {
                res.status(404).json({ erro: "Estação não encontrado" });
                console.log("Estação não encontrado");
            }

            await estacaoRef.update(dadosAtualizados);
            res.status(200).json({ mensagem: "Estação atualizada com sucesso!", id: dadosAtualizados.id });
            console.log("Estação atualizada com sucesso!");
        } catch (erro) {
            console.error("Erro ao atualizar estação:", erro); // Log completo do erro
            res.status(500).json({ erro: "Falha ao editar estação" });
        }
    }

    static async deletarEstacao(req: Request, res: Response) {
        try {
            const { id } = req.params; // Obtém o ID da URL
            console.log("deletar o id:", id);
            await colecaoEstacao.doc(id).delete();
            res.status(204).end();
            console.log("deletado com sucesso!");
        } catch (erro) {
            res.status(500).json({ erro: "Falha ao excluir estação" });
            console.log("Falha ao excluir estação");
        }
    }
}
