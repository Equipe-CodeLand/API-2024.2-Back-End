import request from "supertest";
import { app } from "../app/app";
import { db } from "../config"; // Importa o Firebase Firestore diretamente

describe("Testes de integração - AlertaController (Firebase)", () => {
    let estacaoTesteId: string;
    let parametroTesteId: string;

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

    test("Deve buscar a estação por ID", async () => {
        const response = await request(app).get(`/estacao/${estacaoTesteId}`);
    
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(estacaoTesteId);
    });

    // Teste para cadastrar um novo parâmetro
    it("Deve cadastrar um parâmetro com sucesso", async () => {
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
        parametroTesteId = response.body.novoParametro.id;
    });

    let alerta: any;

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

        alerta = {
            estacaoId: estacaoTesteId,
            parametroId: parametroTesteId,
            mensagemAlerta: "A umidade está abaixo do limite estabelecido",
            tipoAlerta: "Atenção",
            condicao: "<",
            valor: 60.0,
        };
    });

    let alertaId: string | undefined;

    afterAll(async () => {
        // Limpeza do alerta criado durante o teste
        if (alertaId) {
            await db.collection("alertas").doc(alertaId).delete();
        }
    });

    it("Deve cadastrar um alerta com sucesso", async () => {
        const response = await request(app)
            .post("/alerta/cadastro")
            .send(alerta);

        alertaId = response.body.id; // Captura o ID para testes futuros

        // Verifica no Firestore
        if (alertaId) {
            const doc = await db.collection("alertas").doc(alertaId).get();
            expect(doc.exists).toBe(true);
            expect(doc.data()).toMatchObject(alerta);
        }
    });

    it("Deve buscar todos os alertas", async () => {
        const response = await request(app).get("/alertas");

        expect(Array.isArray(response.body)).toBe(true); // Verifica se a resposta é um array

        // Verifica se o alerta cadastrado está na lista
        if (alertaId) {
            const alertaEncontrado = response.body.find((alerta: any) => alerta.id === alertaId);
            expect(alertaEncontrado).toBeDefined();
        }
    });
});