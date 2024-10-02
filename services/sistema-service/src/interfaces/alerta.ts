import { TipoAlerta, Condicao } from "../enums/alertaEnum"; // Importar os enums

export interface Alerta {
    id: string;
    estacaoId: string;
    parametroId: string;
    mensagemAlerta: string;
    tipoAlerta: TipoAlerta;
    condicao: Condicao;      
    valor: number;          
}
