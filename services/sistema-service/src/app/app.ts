import dotenv from 'dotenv';
import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from "../routes";
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../swagger';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Usa as rotas definidas no arquivo routes.ts
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});