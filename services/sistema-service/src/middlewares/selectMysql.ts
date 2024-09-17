import { connectToDatabase } from "../config";

interface Props {
    tabela: string;
    where?: string;
}

export default async function selectMysql(props: Props) {
    try {
        const connection = await connectToDatabase();
        let query = `SELECT * FROM ${props.tabela}; `;
        if (props.where) {
            query += ` WHERE ${props.where};`;
        }
        const [result] = await connection.execute(query);

        // Garante que o resultado é um array
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
}
