import { TipoAlerta, Condicao } from "../enums/alertaEnum"; // Importar os enums

export interface Alerta {
    id: number;
    estacaoId: number;
    parametroId: number;
    mensagemAlerta: string;
    tipoAlerta: TipoAlerta;
    condicao: Condicao;      
    valor: number;          
}
