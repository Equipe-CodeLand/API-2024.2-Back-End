import { TipoAlerta, Condicao } from "../enums/alertaEnum"; // Importar os enums
import { Parametro } from "./parametro";

export interface Alerta {
    id: number;
    estacaoId: number;
    parametroId: number;
    mensagemAlerta: string;
    tipoAlerta: TipoAlerta;
    condicao: Condicao;      
    valor: number;       
}
