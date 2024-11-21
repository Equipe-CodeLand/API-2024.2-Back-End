import request from "supertest";
import { app } from "../app/app"; // Certifique-se de exportar apenas 'app' e não 'server'

jest.setTimeout(30000);

describe("Testes de Integração - Rotas Protegidas", () => {
  let token: string;
  let estacaoId: string;

  // Inicia o servidor apenas uma vez antes dos testes
  let server: any;

  beforeAll(async () => {
    server = app.listen(3000, () => {
      console.log("Server running on port 3000");
    });

    // Realiza o login uma vez e armazena o token
    const loginResponse = await request(app)
      .post("/login")
      .send({ email: "joao@example.com", senha: "minhasenha" });

    if (loginResponse.status !== 200) {
      throw new Error(`Login failed with status ${loginResponse.status}`);
    }

    token = loginResponse.body.token;
    expect(token).toBeDefined();

    // Cria uma estação apenas uma vez para reutilizar nos testes
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
      .set("Authorization", `Bearer ${token}`)
      .send(novaEstacao);

    estacaoId = response.body.id;
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  afterAll(async () => {
    console.log("Finalizando os testes...");
    await new Promise<void>((resolve, reject) => {
      server.close((err: any) => {
        if (err) {
          reject(err);  // Se houver erro ao fechar o servidor
        } else {
          resolve();  // Quando o servidor for fechado com sucesso
        }
      });
    });
    console.log("Servidor fechado.");
  });  
  
  it("Deve cadastrar uma estação com sucesso", async () => {
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
      .set("Authorization", `Bearer ${token}`)
      .send(novaEstacao);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toMatchObject(novaEstacao);
  });

  it("Deve atualizar uma estação existente", async () => {
    const estacaoAtualizada = {
      id: estacaoId,
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

    const atualizarResponse = await request(app)
      .put(`/estacao/atualizar`)
      .set("Authorization", `Bearer ${token}`)
      .send(estacaoAtualizada);

    expect(atualizarResponse.status).toBe(200);
    expect(estacaoAtualizada).toMatchObject({
      id: estacaoId,
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

  it("Deve buscar todas as estações", async () => {
    const response = await request(app)
      .get("/estacoes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("Deve buscar uma estação por ID", async () => {
    const criarResponse = await request(app)
      .post("/estacao/cadastro")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Estação para Buscar", uid: "54321" });

    const estacaoId = criarResponse.body.id;

    const buscarResponse = await request(app)
      .get(`/estacao/${estacaoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(buscarResponse.body.id).toBe(estacaoId);
  });

  it("Deve excluir uma estação existente", async () => {
    const excluirResponse = await request(app)
      .delete(`/estacao/deletar/${estacaoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(excluirResponse.status).toBe(204);
  });
});
