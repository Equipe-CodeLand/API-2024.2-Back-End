export interface Parametro {
  id?: string; 
  nome: string;
  unidade: string;
  fator: number;
  offset: number;
  sigla: string;
  descricao?: string; 
  criadoEm?: string; 
  atualizadoEm?: string;
}