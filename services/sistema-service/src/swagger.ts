// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentação',
      version: '1.0.0',
      description: 'Documentação da API do seu sistema',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos de rotas para os comentários Swagger
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export default swaggerDocs;
