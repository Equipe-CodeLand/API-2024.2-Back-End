import { app } from "./src/app/app";

let server: any;
let PORT: number;

beforeAll(() => {
  PORT = 5000 + Math.floor(Math.random() * 1000); // Porta dinâmica
  process.env.PORT = String(PORT);
  server = app.listen(PORT);
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});
