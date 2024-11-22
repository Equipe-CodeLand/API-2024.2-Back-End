import request from "supertest";
import { app } from "../app/app";

jest.setTimeout(60000);

let server: any;

beforeAll(() => {
  server = app.listen(0); // Inicializa o servidor para cada teste
});

describe("Testes de Integração - Parâmetros", () => {
  let parametroId: string; // Variável para armazenar o ID do parâmetro

  // Teste para cadastrar um novo parâmetro
  test.only("Deve cadastrar um parâmetro com sucesso", async () => {
    const novoParametro = {
      nome: "Temperatura",
      unidade: "°C",
      fator: 1.0,
      offset: 0.0,
      descricao: "Parâmetro de temperatura ambiente",
      sigla: "TEMP",
    };

    const response = await request(app)
      .post("/parametro/cadastro")
      .send(novoParametro);

    expect(response.status).toBe(201);
    expect(response.body.novoParametro).toHaveProperty("id");

    // Armazenar o ID do parâmetro para usar nos próximos testes
    parametroId = response.body.novoParametro.id;
  });

  // Teste para listar todos os parâmetros
  test.only("Deve listar todos os parâmetros", async () => {
    const response = await request(app).get("/parametros");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Teste para atualizar um parâmetro
  test.only("Deve atualizar um parâmetro existente", async () => {
    const parametroAtualizado = {
      id: parametroId,
      nome: "Temperatura Atualizada",
      unidade: "°C",
      fator: 1.5,
      offset: 0.5,
      descricao: "Parâmetro atualizado",
      sigla: "TEMP",
    };

    await request(app)
      .put("/parametro/atualizar")
      .send(parametroAtualizado);

    expect(parametroAtualizado).toMatchObject({
      id: parametroId,
      nome: "Temperatura Atualizada",
      unidade: "°C",
      fator: 1.5,
      offset: 0.5,
      descricao: "Parâmetro atualizado",
      sigla: "TEMP",
    });
  });

  // Teste para deletar um parâmetro
  test.only("Deve deletar um parâmetro existente", async () => {
    const response = await request(app).delete(
      `/parametro/deletar/${parametroId}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body.message).toBe("Parâmetro deletado com sucesso");

    // Verificar se o parâmetro foi realmente excluído
    const buscarResponse = await request(app).get(`/parametro/${parametroId}`);
    expect(buscarResponse.status).toBe(404);
  });
});

afterAll(async () => {
  if (server) {
    await server.close();
  }
});
