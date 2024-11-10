import dotenv from 'dotenv';
import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from "../routes";
import backupRouter from '../routes/backupRoute';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Usa as rotas definidas no arquivo routes.ts
app.use(router);
app.use('/backup', backupRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});