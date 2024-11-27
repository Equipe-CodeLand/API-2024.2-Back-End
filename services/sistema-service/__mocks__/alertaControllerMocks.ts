import { Alerta } from '../src/interfaces/alerta';
import { Request, Response } from "express";

// Mock da coleção Firestore para os alertas
export const Alertas = {
  doc: jest.fn(() => ({
    id: "mockAlertId",
    set: jest.fn(),
    get: jest.fn(() => ({ exists: true, data: () => ({ id: "mockAlertId" }) })), // Mock de dados
    update: jest.fn(),
    delete: jest.fn(),
  })),
  where: jest.fn(() => ({
    get: jest.fn(() => ({
      forEach: jest.fn((callback) =>
        callback({ data: () => ({ id: "mockAlertId" }) })
      ),
    })),
  })),
  get: jest.fn(() => ({
    forEach: jest.fn((callback) =>
      callback({ data: () => ({ id: "mockAlertId", estacaoId: "123" }) })
    ),
  })),
};

// Mock do Firestore
jest.mock('../src/config', () => ({
  db: require('./__mocks__/firebase').db, // Mock do Firestore
}));

// Mock dos middlewares
export const mockTimestampFormatado = jest.fn(() => "2024-11-26T00:00:00Z");
jest.mock("../src/middleware/timestampFormatado", () => mockTimestampFormatado);

export const mockBuscarValorParametro = jest.fn((parametroId: string) =>
  parametroId === "validParamId" ? 10 : null
);
jest.mock("../src/middleware/buscarValorParametro", () => ({
  buscarValorParametro: mockBuscarValorParametro,
}));

export const mockVerificarCondicao = jest.fn(
  (parametroAtual, valor, condicao) =>
    condicao === ">" ? parametroAtual > valor : parametroAtual < valor
);
jest.mock("../src/middleware/verificadorCondicaoAlerta", () => ({
  verificarCondicao: mockVerificarCondicao,
}));

// Mock do controlador de notificações
export const mockNotificacaoController = {
  cadastrarNotificacao: jest.fn(),
};
jest.mock("../src/controllers/notificacaoController", () => mockNotificacaoController);

// Mock do controlador de alertas
export const mockAlertaController = {
  cadastrarAlerta: jest.fn(async (req: Request, res: Response) => {
    res.status(201).json({ id: "mockAlertId" });
  }),
  obterAlertas: jest.fn(async (req: Request, res: Response) => {
    res.status(200).json([{ id: "mockAlertId", estacaoId: "123" }]);
  }),
  obterAlertaPorEstacao: jest.fn(async (req: Request, res: Response) => {
    res.status(200).json([{ id: "mockAlertId", estacaoId: req.params.id }]);
  }),
};

// Mapeando o mock do controlador para as rotas no Jest
jest.mock("../src/controllers/alertaController", () => ({
  cadastrarAlerta: mockAlertaController.cadastrarAlerta,
  obterAlertas: mockAlertaController.obterAlertas,
  obterAlertaPorEstacao: mockAlertaController.obterAlertaPorEstacao,
}));
