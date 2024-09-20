import { Parametro } from "./parametro"

export interface Estacao{
    id: number,
    nome: string,
    uid: string,
    cep: string,
    numero: number,
    bairro: string,
    cidade: string,
    rua: string,
    parametros: Parametro[]
    status?: boolean
}