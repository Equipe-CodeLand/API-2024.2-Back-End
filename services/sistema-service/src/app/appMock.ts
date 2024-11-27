import express from "express";
import { mockAlertaController } from "../../__mocks__/alertaControllerMocks";

const appMock = express();
appMock.use(express.json());

// Simulação das rotas com os mocks
appMock.post("/alertas", mockAlertaController.cadastrarAlerta);
appMock.get("/alertas", mockAlertaController.obterAlertas);

export { appMock };
