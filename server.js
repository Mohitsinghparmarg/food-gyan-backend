const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const driver = require("./config/db.config");

dotenv.config(); 

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const session = driver.session({ database: "neo4j" });
session
  .run("RETURN 1")
  .then(() => {
    console.log("✅ Successfully connected to Neo4j");
    return session.close();
  })
  .catch((err) => {
    console.error("❌ Failed to connect to Neo4j:", err);
    process.exit(1);
  });

require("./routes/auth.routes")(app);
require("./routes/recipe.routes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
