const { addRecipe, getAllRecipes, updateRecipe, deleteRecipe } = require("../models/recipe.model");

const createRecipe = async (req, res) => {
  if (!req.user?.email) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }

  let { title, ingredients, instructions, calories, protein, allergens } = req.body;

  ingredients = typeof ingredients === 'string' ? ingredients.split(',').map(i => i.trim()) : ingredients;
  allergens = typeof allergens === 'string' ? allergens.split(',').map(a => a.trim()) : allergens;

  try {
    const newRecipe = await addRecipe(
      req.user.email.trim().toLowerCase(),
      title?.trim(),
      ingredients,
      instructions?.trim(),
      Number(calories) || null,
      Number(protein) || null,
      allergens
    );
    res.status(201).json({ message: "Recipe added", recipe: newRecipe });
  } catch (err) {
    res.status(500).json({ message: "Failed to add recipe", error: err.message });
  }
};

const getRecipes = async (_req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipes", error: err.message });
  }
};

const updateRecipeById = async (req, res) => {
  const { id } = req.params;
  let { title, ingredients, instructions, calories, protein, allergens } = req.body;

  if (!req.user?.email) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }

  ingredients = typeof ingredients === 'string' ? ingredients.split(',').map(i => i.trim()) : ingredients;
  allergens = typeof allergens === 'string' ? allergens.split(',').map(a => a.trim()) : allergens;

  try {
    const updated = await updateRecipe(
      req.user.email.trim().toLowerCase(),
      id,
      title?.trim(),
      ingredients,
      instructions?.trim(),
      Number(calories) || null,
      Number(protein) || null,
      allergens
    );
    if (!updated) {
      return res.status(404).json({ message: "Recipe not found or not owned by user" });
    }
    res.json({ message: "Recipe updated", recipe: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update recipe", error: err.message });
  }
};

const deleteRecipeById = async (req, res) => {
  const { id } = req.params;
  if (!req.user?.email) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }

  try {
    const deleted = await deleteRecipe(req.user.email.trim().toLowerCase(), id);
    if (!deleted) {
      return res.status(404).json({ message: "Recipe not found or not owned by user" });
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete recipe", error: err.message });
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  updateRecipeById,
  deleteRecipeById,
};
