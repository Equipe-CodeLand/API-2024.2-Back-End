import { connectToDatabase } from "../config";

interface DeleteProps {
    tabela: string;  // Nome da tabela
    where: string;   // Cláusula WHERE para especificar qual linha excluir
}

export default async function deleteMysql(props: DeleteProps) {
    try {
        const connection = await connectToDatabase();

        // Verificando se a cláusula WHERE foi passada
        if (!props.where) {
            throw new Error("A cláusula WHERE é necessária para excluir uma linha.");
        }

        // Criação da query para exclusão
        const query = `DELETE FROM ${props.tabela} WHERE ${props.where}`;

        // Execução da query
        const [result] = await connection.execute(query);

        return result; // Retornar o resultado se necessário
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
}
