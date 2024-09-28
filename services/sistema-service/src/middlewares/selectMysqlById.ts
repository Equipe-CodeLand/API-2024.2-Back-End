import { connectToDatabase } from "../config";

interface Props {
    tabela: string;
    id: number | string; // O ID pode ser um número ou string, dependendo do tipo do campo no banco de dados
}

export default async function selectMysqlById(props: Props) {
    try {
        const connection = await connectToDatabase();

        // Criação da query para buscar pelo ID
        const query = `SELECT * FROM ${props.tabela} WHERE id = ?`;

        // Executa a query com o ID fornecido
        const [result] = await connection.execute(query, [props.id]);

        // Garante que o resultado é um array
        connection.end();
        return Array.isArray(result) && result.length > 0 ? result[0] : null; // Retorna o primeiro resultado ou null
    } catch (error) {
        console.error('Error selecting data by ID:', error);
        throw error;
    }
}
