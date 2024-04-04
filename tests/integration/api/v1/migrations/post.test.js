import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/migrations should return 200", async () => {
  const responseGet = await fetch("http://localhost:3000/api/v1/migrations");
  expect(responseGet.status).toBe(200);
  const responseGetBody = await responseGet.json();

  const responsePost = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(responsePost.status).toBe(201);
  const responsePostBody = await responsePost.json();
  expect(Array.isArray(responsePostBody)).toBe(true);
  expect(responsePostBody.length).toBeGreaterThan(0);

  expect(responsePostBody).toEqual(responseGetBody);

  const migrationsTable = await database.query("select * from pgmigrations");

  for (let i = 0; i < responsePostBody.length; i++) {
    expect(responsePostBody[i].name).toEqual(migrationsTable.rows[i].name);
  }
});
