import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);
      const json = await response.json();
      const parsedDate = new Date(json.update_at).toISOString();
      expect(json.update_at).toEqual(parsedDate);

      // eslint-disable-next-line no-unused-vars
      // const database = await fetch("http://localhost:3000/api/v1/status/database");
      expect(json.depedencies.database.version).toEqual("16.0");
      expect(json.depedencies.database.max_connections).toEqual(100);
      expect(json.depedencies.database.opened_connections).toEqual(1);
    });
  });
});
