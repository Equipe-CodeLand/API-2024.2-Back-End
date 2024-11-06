import dotenv from 'dotenv';
import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from "../routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;

// Usa as rotas definidas no arquivo routes.ts
app.use(router);

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on this port ${PORT}`);
});