import { run } from "jest";
import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const migrationsOptionsDefault = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  if (request.method === "GET") {
    const penddingMigrations = await migrationRunner(migrationsOptionsDefault);
    await dbClient.end();
    response.status(200).json(penddingMigrations);
  }
  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationsOptionsDefault,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    response.status(200).json(migratedMigrations);
  }
  return response.status(405).end();
}
