const express = require("express");
const authenticateToken = require("../middleware/auth.middleware");
const {
  createRecipe,
  getRecipes,
  updateRecipeById,
  deleteRecipeById
} = require("../controllers/recipe.controller");

module.exports = (app) => {
  const router = express.Router();

 
  router.get("/", getRecipes);


  router.post("/add", authenticateToken, createRecipe);
  router.put("/:id", authenticateToken, updateRecipeById);
  router.delete("/:id", authenticateToken, deleteRecipeById);

  app.use("/api/recipes", router);
};
