import { Perfil } from "../enums/usuarioEnum";

export interface Usuario {
    id?: string;
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    perfil?: Perfil;  // O tipo `Perfil` já está importado corretamente
    criado: Date;
    atualizado: Date;
}
