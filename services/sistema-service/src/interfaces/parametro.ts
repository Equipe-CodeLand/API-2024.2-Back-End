export interface Parametro {
    id?: string; 
    nome: string;
    unidade: string;
    fator: number;
    offset: number;
    descricao?: string; 
    criadoEm?: string; 
    atualizadoEm?: string;
  }