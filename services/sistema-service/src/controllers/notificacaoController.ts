import { db } from "../config";

const colecaoNotificacao = db.collection('Notificacao');

export default class NotificacaoController {
    static async obterNotificacoes() {}

    static async buscarNotificacaoPorEstacao() {}
}