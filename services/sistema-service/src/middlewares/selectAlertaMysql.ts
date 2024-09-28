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
        let query = `SELECT ${props.select || '*'} FROM ${props.tabela}`;

        // Adiciona as joins, se fornecidas
        if (props.joins) {
            query += ` ${props.joins}`;
        }

        // Verificação se há um WHERE
        if (props.where) {
            query += ` WHERE ${props.where}`;
        }

        console.log('Consulta SQL:', query); // Log da consulta para debugging
        const [result] = await connection.execute(query);

        // Garante que o resultado é um array
        connection.end();
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.error('Error selecting data:', error);
        throw error;
    }
}
