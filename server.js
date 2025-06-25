const driver = require("./config/db.config");

const session = driver.session({ database: "neo4j" });

session
  .run("RETURN 1")
  .then(() => {
    console.log("✅ Successfully connected to Neo4j");
    return session.close();
  })
  .catch((err) => {
    console.error("❌ Failed to connect to Neo4j:", err);
  });
