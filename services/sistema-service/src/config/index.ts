import mysql from 'mysql2/promise';

export async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'api',
  });

  console.log('Conectado ao banco de dados MySQL');
  return connection;
}
