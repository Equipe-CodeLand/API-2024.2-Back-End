import { Perfil } from "../enums/usuarioEnum";

export interface Usuario{
    id?: number,
    nome: string,
    email: string,
    senha: string,
    cpf: string,
    perfil?: Perfil,
    criado: Date,
    atualizado: Date
}