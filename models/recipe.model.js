const driver = require("../config/db.config");

const addRecipe = async (email, title, ingredients, instructions, calories, protein, allergens) => {
  const session = driver.session();
  try {
    const query = `
      MATCH (u:User {email: $email})
      CREATE (r:Recipe {
        id: randomUUID(),
        title: $title,
        ingredients: $ingredients,
        instructions: $instructions,
        calories: $calories,
        protein: $protein,
        allergens: $allergens,
        createdAt: datetime()
      })
      MERGE (u)-[:CREATED]->(r)
      RETURN r
    `;
    const result = await session.run(query, { email, title, ingredients, instructions, calories, protein, allergens });
    return result.records[0].get("r").properties;
  } finally {
    await session.close();
  }
};

const getAllRecipes = async () => {
  const session = driver.session();
  try {
    const query = `
      MATCH (r:Recipe)<-[:CREATED]-(u:User)
      RETURN r, u.email AS creator
      ORDER BY r.createdAt DESC
    `;
    const result = await session.run(query);
    return result.records.map(record => {
      const recipe = record.get("r").properties;
      recipe.creator = record.get("creator");
      return recipe;
    });
  } finally {
    await session.close();
  }
};

const updateRecipe = async (email, id, title, ingredients, instructions, calories, protein, allergens) => {
  const session = driver.session();
  try {
    const query = `
      MATCH (u:User {email: $email})-[:CREATED]->(r:Recipe {id: $id})
      SET r.title = $title,
          r.ingredients = $ingredients,
          r.instructions = $instructions,
          r.calories = $calories,
          r.protein = $protein,
          r.allergens = $allergens
      RETURN r
    `;
    const params = { email, id, title, ingredients, instructions, calories, protein, allergens };
    const result = await session.run(query, params);
    return result.records[0]?.get('r').properties || null;
  } finally {
    await session.close();
  }
};

const deleteRecipe = async (email, id) => {
  const session = driver.session();
  try {
    const query = `
      MATCH (u:User {email: $email})-[:CREATED]->(r:Recipe {id: $id})
      DETACH DELETE r
      RETURN COUNT(r) AS deletedCount
    `;
    const params = { email, id };
    const result = await session.run(query, params);
    return result.records[0].get("deletedCount").toNumber() > 0;
  } finally {
    await session.close();
  }
};

module.exports = {
  addRecipe,
  getAllRecipes,
  updateRecipe,
  deleteRecipe
};
