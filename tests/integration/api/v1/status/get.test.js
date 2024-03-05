test("GET to /api/v1/status should return 200 ", async () => {
  const res = await fetch("http://localhost:3000/api/v1/status");
  expect(res.status).toBe(200);
  const json = await res.json();
  const parsedDate = new Date(json.update_at).toISOString();
  expect(json.update_at).toEqual(parsedDate);

  const database = await fetch("http://localhost:3000/api/v1/status/database");
  expect(json.depedencies.database.version).toEqual("16.0");
  expect(json.depedencies.database.max_connections).toEqual(100);
  expect(json.depedencies.database.opened_connections).toEqual(1);
  console.log(json);
});
