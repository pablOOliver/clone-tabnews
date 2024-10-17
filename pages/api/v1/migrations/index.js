import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
export default async function migrations(request, response) {
  const alawedMethods = ["GET", "POST"];
  if (!alawedMethods.includes(request.method)) {
    return response.status(405).json({
      error: "Method not allowed. Only GET and POST methods are allowed",
    });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationsOptionsDefault = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    if (request.method === "GET") {
      const penddingMigrations = await migrationRunner(
        migrationsOptionsDefault,
      );
      response.status(200).json(penddingMigrations);
    }
    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...migrationsOptionsDefault,
        dryRun: false,
      });
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
