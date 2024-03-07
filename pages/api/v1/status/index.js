import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  var dbVersion = await database.query("SHOW server_version;");
  dbVersion = dbVersion.rows[0].server_version;

  var maxConnections = await database.query(
    "SELECT setting FROM pg_settings WHERE name='max_connections';",
  );
  maxConnections = Number(maxConnections.rows[0].setting);

  const databaseName = process.env.POSTGRES_DB;
  var connections = await database.query({
    text: "SELECT COUNT(*) FROM pg_stat_activity WHERE datname=$1;",
    values: [databaseName],
  });
  connections = Number(connections.rows[0].count);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion,
        max_connections: maxConnections,
        connections: connections,
      },
    },
  });
}

export default status;
