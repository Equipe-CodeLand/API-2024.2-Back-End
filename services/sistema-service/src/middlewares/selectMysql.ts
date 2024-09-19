import { connectToDatabase } from "../config";

interface Props {
    tabela: string;
    select?: string;
    where?: string;
    joins?: string;
}

export default async function selectMysql(props: Props) {
    try {
        const connection = await connectToDatabase();

        // Criação do SQL dinâmico para fazer um select
        let query = ""
        if (props.select) {
            query += ` ${props.select}`;
        } else{
            query += `SELECT * FROM `;
        }

        query += `${props.tabela} `

        // Adiciona as joins, se fornecidas
        if (props.joins) {
            query += ` ${props.joins}`;
        }

        // Verificação se há um WHERE
        if (props.where) { // Se houver, adicionar ao final da query
            query += ` WHERE ${props.where}`;
        }

        // Execução da query com os valores
        const [result] = await connection.execute(query);

        connection.end()
        return result; // Retornar o resultado se necessário
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
}
