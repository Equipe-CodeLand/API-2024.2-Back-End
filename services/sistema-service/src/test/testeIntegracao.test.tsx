import request from "supertest"; // Para simular requisições HTTP
import {appMock} from "../app/appMock"; 

describe("AlertaController com mocks", () => {
  it("Deve cadastrar um alerta", async () => {
    const res = await request(appMock).post("/alertas").send({
      estacaoId: "123",
      parametroId: "validParamId",
      mensagemAlerta: "Teste",
      tipoAlerta: "Teste",
      condicao: ">",
      valor: 5,
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe("mockAlertId");
  });

  it("Deve retornar todos os alertas", async () => {
    const res = await request(appMock).get("/alertas");

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].id).toBe("mockAlertId");
  });
});
