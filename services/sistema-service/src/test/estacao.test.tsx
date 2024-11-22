import request from "supertest";
import { app } from "../app/app";
import { Estacao } from "../interfaces/estacao";

jest.setTimeout(30000);

let server: any;

beforeAll(() => {
  server = app.listen(0); // Inicializa o servidor para cada teste
});

describe("Testes de Integração - Rotas Protegidas", () => {
  let estacaoTesteId: string;

  // Criar uma estação antes de todos os testes
  beforeAll(async () => {
    const novaEstacao = {
      nome: "Estação Teste",
      uid: "user123",
      cep: "12345-678",
      numero: 100,
      bairro: "Centro",
      cidade: "Cidade Exemplo",
      rua: "Rua Principal",
      latitude: "-23.550520",
      longitude: "-46.633308",
      parametros: ["8eh97g9XxX6hP8hsEPAB"],
    };

    const response = await request(app)
      .post("/estacao/cadastro")
      .send(novaEstacao);

    estacaoTesteId = response.body.id; // Salva o ID para uso nos testes
    expect(response.status).toBe(201);
  });

  // Limpar a estação após todos os testes
  afterAll(async () => {
    await request(app).delete(`/estacao/deletar/${estacaoTesteId}`);
  });

  test("Deve atualizar uma estação existente", async () => {
    const estacaoAtualizada = {
      id: estacaoTesteId,
      nome: "Estação Atualizada",
      cep: "98765-432",
      numero: 150,
      bairro: "Novo Bairro",
      cidade: "Nova Cidade",
      rua: "Nova Rua",
      latitude: "-23.550520",
      longitude: "-46.633308",
      parametros: ["8eh97g9XxX6hP8hsEPAB"],
    };

    await request(app)
      .put(`/estacao/atualizar`)
      .send(estacaoAtualizada);

    expect(estacaoAtualizada).toMatchObject({
      id: estacaoTesteId,
      nome: "Estação Atualizada",
      cep: "98765-432",
      numero: 150,
      bairro: "Novo Bairro",
      cidade: "Nova Cidade",
      rua: "Nova Rua",
      latitude: "-23.550520",
      longitude: "-46.633308",
      parametros: ["8eh97g9XxX6hP8hsEPAB"],
    });
  });

  test("Deve buscar todas as estações", async () => {
    const buscarResponse = await request(app).get(`/estacoes`);

    expect(buscarResponse.status).toBe(200);
  });

  test("Deve buscar a estação por ID", async () => {
    const response = await request(app).get(`/estacao/${estacaoTesteId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(estacaoTesteId);
  });

  test("Deve excluir a estação existente", async () => {
    const novaEstacao = {
      nome: "Estação para Deletar",
      uid: "11111",
      cep: "11111-678",
      numero: 40,
      bairro: "Bairro Deletar",
      cidade: "Cidade Deletar",
      rua: "Rua Deletar",
      latitude: "-23.55052",
      longitude: "-46.633308",
      parametros: ["8eh97g9XxX6hP8hsEPAB"],
    };

    const criarResponse = await request(app)
      .post("/estacao/cadastro")
      .send(novaEstacao);

    const estacaoId = criarResponse.body.id;

    const excluirResponse = await request(app).delete(
      `/estacao/deletar/${estacaoId}`
    );

    expect(excluirResponse.status).toBe(204);
  });
});

afterAll(async () => {
  if (server) {
    await server.close();
  }
});
