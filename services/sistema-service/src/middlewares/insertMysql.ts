import { connectToDatabase } from "../config";

interface Props {
    tabela: string;
    colunas: string[];  // Espera-se um array de strings para as colunas
    valores: any[];     // Array de valores a serem inseridos
}

export default async function insertMysql(props: Props) {
    try {
        const connection = await connectToDatabase();

        // Criação de placeholders (por exemplo, ?, ?, ?)
        const placeholders = props.colunas.map(() => '?').join(', ');

        // Criação do SQL dinâmico
        const query = `INSERT INTO ${props.tabela} (${props.colunas.join(', ')}) VALUES (${placeholders})`;

        // Execução da query com os valores
        const [result] = await connection.execute(query, props.valores);

        return result; // Retornar o resultado se necessário
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
}
