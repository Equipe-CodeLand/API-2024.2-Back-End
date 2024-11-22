import request from "supertest";
import { app } from "../app/app";
import { db } from "../config"; // Importa o Firebase Firestore diretamente

describe("Testes de integração - AlertaController (Firebase)", () => {
    const alertaMock = {
        estacaoId: "QGLxfYMQlah4kuC5Yto8",
        parametroId: "tihgjagzkyoBhSMn0GZE",
        mensagemAlerta: "A umidade está abaixo do limite estabelecido",
        tipoAlerta: "Atenção",
        condicao: "<",
        valor: 60.0,
    };

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
            .send(alertaMock);

        alertaId = response.body.id; // Captura o ID para testes futuros

        // Verifica no Firestore
        if (alertaId) {
            const doc = await db.collection("alertas").doc(alertaId).get();
            expect(doc.exists).toBe(true);
            expect(doc.data()).toMatchObject(alertaMock);
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

    it("Deve atualizar um alerta com sucesso", async () => {
        const alertaAtualizado = {
            ...alertaMock,
            mensagemAlerta: "Temperatura extremamente alta!",
        };

        if (alertaId) {
            const response = await request(app)
                .put(`/alerta/atualizar/${alertaId}`)
                .send(alertaAtualizado);


            // Verifica no Firestore
            const doc = await db.collection("alertas").doc(alertaId).get();
            expect(doc.exists).toBe(true);
            expect(doc.data()?.mensagemAlerta).toBe("Temperatura extremamente alta!");
        }
    });

    it("Deve deletar um alerta com sucesso", async () => {
        if (alertaId) {
            const response = await request(app).delete(`/alerta/deletar/${alertaId}`);

            // Verifica no Firestore
            const doc = await db.collection("alertas").doc(alertaId).get();
            expect(doc.exists).toBe(false);
        }
    });
});
