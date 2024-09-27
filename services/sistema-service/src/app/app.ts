import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from "../routes";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Usa as rotas definidas no arquivo routes.ts
app.use(router);

app.listen(PORT, () => {
  console.log(`Express server is listening at http://localhost:${PORT}`);
});
