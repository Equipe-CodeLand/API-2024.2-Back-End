import request from "supertest";
import { app } from "../app/app";  // Importa a aplicação para testar as rotas
import { db } from "../config"; // Importa o Firebase Firestore diretamente

describe("Testes de integração - AlertaController (Firebase)", () => {
    let estacaoTesteId: string;
    let parametroTesteId: string;

    // Criar uma estação antes de todos os testes
    beforeAll(async () => {
        // Define os dados de uma nova estação para criar
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

        // Envia uma requisição POST para criar a estação
        const response = await request(app)
            .post("/estacao/cadastro")
            .send(novaEstacao);

        estacaoTesteId = response.body.id; // Salva o ID da estação criada
        expect(response.status).toBe(201); // Espera que o status seja 201 (Criado)
    });

    // Limpar a estação após todos os testes
    afterAll(async () => {
        // Deleta a estação criada após os testes
        await request(app).delete(`/estacao/deletar/${estacaoTesteId}`);
    });

    // Teste para buscar a estação por ID
    test("Deve buscar a estação por ID", async () => {
        const response = await request(app).get(`/estacao/${estacaoTesteId}`);
    
        expect(response.status).toBe(200); // Espera o status 200 (OK)
        expect(response.body.id).toBe(estacaoTesteId); // Espera que o ID da estação seja o mesmo
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

        // Envia uma requisição POST para cadastrar o novo parâmetro
        const response = await request(app)
            .post("/parametro/cadastro")
            .send(novoParametro);

        expect(response.status).toBe(201); // Espera que o parâmetro seja cadastrado com sucesso
        expect(response.body.novoParametro).toHaveProperty("id"); // Espera que o parâmetro tenha um ID

        // Armazenar o ID do parâmetro para uso nos próximos testes
        parametroTesteId = response.body.novoParametro.id;
    });

    let alerta: any;

    beforeAll(async () => {
        // Dados para criar uma nova estação
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

        // Envia uma requisição POST para criar a estação
        const response = await request(app)
            .post("/estacao/cadastro")
            .send(novaEstacao);

        estacaoTesteId = response.body.id; // Salva o ID da estação criada
        expect(response.status).toBe(201); // Espera que a estação seja criada com sucesso

        // Dados para criar um alerta
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
            await db.collection("alertas").doc(alertaId).delete(); // Deleta o alerta do Firestore
        }
    });

    // Teste para cadastrar um alerta
    it("Deve cadastrar um alerta com sucesso", async () => {
        // Envia a requisição para cadastrar o alerta
        const response = await request(app)
            .post("/alerta/cadastro")
            .send(alerta);

        alertaId = response.body.id; // Captura o ID do alerta para testes futuros

        // Verifica se o alerta foi armazenado no Firestore
        if (alertaId) {
            const doc = await db.collection("alertas").doc(alertaId).get();
            expect(doc.exists).toBe(true); // Espera que o documento exista no Firestore
            expect(doc.data()).toMatchObject(alerta); // Espera que os dados do alerta sejam iguais ao que foi enviado
        }
    });

    // Teste para buscar todos os alertas
    it("Deve buscar todos os alertas", async () => {
        // Envia requisição GET para buscar todos os alertas
        const response = await request(app).get("/alertas");

        expect(Array.isArray(response.body)).toBe(true); // Espera que a resposta seja um array

        // Verifica se o alerta cadastrado está na lista de alertas
        if (alertaId) {
            const alertaEncontrado = response.body.find((alerta: any) => alerta.id === alertaId);
            expect(alertaEncontrado).toBeDefined(); // Espera que o alerta esteja na lista
        }
    });
});
