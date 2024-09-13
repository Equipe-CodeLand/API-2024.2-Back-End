import { connectToDatabase } from "../config";

interface UpdateProps {
    tabela: string;        // Nome da tabela
    colunas: string[];     // Colunas a serem atualizadas
    valores: any[];        // Novos valores para as colunas
    where: string;         // Cláusula WHERE para especificar qual linha atualizar
}

export default async function updateMysql(props: UpdateProps) {
    try {
        const connection = await connectToDatabase();

        // Verificando se a cláusula WHERE foi passada
        if (!props.where) {
            throw new Error("A cláusula WHERE é necessária para atualizar uma linha.");
        }

        // Gerando as partes da query com placeholders
        const setClause = props.colunas.map(coluna => `${coluna} = ?`).join(', ');

        // Criação da query dinâmica de UPDATE
        const query = `UPDATE ${props.tabela} SET ${setClause} WHERE ${props.where}`;

        // Execução da query com os valores fornecidos
        const [result] = await connection.execute(query, props.valores);

        return result; // Retornar o resultado se necessário
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}
