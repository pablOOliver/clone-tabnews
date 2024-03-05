import database from "infra/database.js";
async function status(req, res) {
  const updateAt = new Date().toISOString();
  const databaseVersionResult = await database.query("SHOW server_version");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConectionsResult = await database.query(
    "SHOW max_connections"
  );
  const databaseMaxConectionsValue =
    databaseMaxConectionsResult.rows[0].max_connections;
  const dataname = process.env.POSTGRES_DB;
  const databaseOpenedConectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [dataname],
  });
  const databaseOpenedConectionsValue =
    databaseOpenedConectionsResult.rows[0].count;

  res.status(200).json({
    update_at: updateAt,
    depedencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConectionsValue),
        opened_connections: databaseOpenedConectionsValue,
      },
    },
  });
}
export default status;
