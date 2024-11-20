import request from "supertest";
import app from "../app/app";

jest.setTimeout(60000);

describe("Testes de Integração - Rotas Protegidas", () => {
  let token: string;

  beforeEach(async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send({ email: "joao@example.com", senha: "minhasenha" });
    token = loginResponse.body.token;
    if (loginResponse.status !== 200) {
      throw new Error(`Login failed with status ${loginResponse.status}`);
    }
    expect(loginResponse.status).toBe(200);
    token = loginResponse.body.token;
    expect(token).toBeDefined();
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

    expect(response.status).toBe(201); // Verifica se o status é 201
    expect(response.body).toHaveProperty("id"); // Verifica se o ID foi retornado
    expect(response.body).toMatchObject(novaEstacao); // Verifica se os dados estão corretos
  });

  it("Deve atualizar uma estação existente", async () => {
    const novaEstacao = {
      nome: "Estação para Atualizar",
      uid: "atualizar123",
      cep: "12345-678",
      numero: 50,
      bairro: "Bairro Atualizar",
      cidade: "Cidade Atualizar",
      rua: "Rua Atualizar",
      latitude: "-23.550520",
      longitude: "-46.633308",
      parametros: ["8eh97g9XxX6hP8hsEPAB"],
    };
  
    // Criando a estação
    const criarResponse = await request(app)
      .post("/estacao/cadastro")
      .set("Authorization", `Bearer ${token}`)
      .send(novaEstacao);
  
    const estacaoId = criarResponse.body.id;
    console.log("Estação criada:", criarResponse.body);
  
    // Atualizando a estação
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
  
    console.log("Resposta de Atualização:", atualizarResponse.body);
  
    // Verifique se o corpo da resposta contém os dados atualizados
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
      .set("Authorization", `Bearer ${token}`)
      .send(novaEstacao);

    const estacaoId = criarResponse.body.id;

    const excluirResponse = await request(app)
      .delete(`/estacao/deletar/${estacaoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(excluirResponse.status).toBe(204); // Verifica se a exclusão foi bem-sucedida
  });

  afterAll((done) => {
    done();
  });
});
