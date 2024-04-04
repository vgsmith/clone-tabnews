import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  switch (request.method) {
    case "GET":
      const customMigrationOptionsGet = Object.assign(defaultMigrationOptions, {
        dryRun: true,
      });
      const pendingMigrations = await migrationRunner(
        customMigrationOptionsGet,
      );
      await dbClient.end();
      return response.status(200).json(pendingMigrations);
      break;

    case "POST":
      const customMigrationOptionsPost = Object.assign(
        defaultMigrationOptions,
        {
          dryRun: false,
        },
      );
      const migratedMigrations = await migrationRunner(
        customMigrationOptionsPost,
      );
      await dbClient.end();
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      } else {
        return response.status(200).json(migratedMigrations);
      }
      break;

    default:
      await dbClient.end();
  }
  return response.status(405).end();
}
