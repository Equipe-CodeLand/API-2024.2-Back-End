import mysql from 'mysql2/promise';

export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'api',
    });

    return connection;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados MySQL:', error);
    throw error; // Opcional: relançar o erro para ser tratado em outro lugar
  }
}
