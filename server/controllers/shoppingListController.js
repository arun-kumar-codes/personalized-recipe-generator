const ShoppingList = require('../models/ShoppingList');
const Recipe = require('../models/Recipe');

exports.generateShoppingList = async (req, res) => {
    const { recipeIds } = req.body;

    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
        return res.status(400).json({ error: 'Invalid recipe IDs provided.' });
    }

    try {
        const recipes = await Recipe.find({ _id: { $in: recipeIds } });

        if (recipes.length === 0) {
            return res.status(404).json({ error: 'No recipes found for the provided IDs.' });
        }

        const shoppingList = {};

        recipes.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                const { name, quantity, unit } = ingredient;
                const key = `${name}-${unit}`;

                if (shoppingList[key]) {
                    shoppingList[key].quantity += quantity;
                } else {
                    shoppingList[key] = { name, quantity, unit };
                }
            });
        });

        const newShoppingList = new ShoppingList({
            items: Object.values(shoppingList),
            createdAt: new Date(),
        });

        await newShoppingList.save();

        return res.status(201).json(newShoppingList);
    } catch (error) {
        console.error('Error generating shopping list:', error);
        return res.status(500).json({ error: 'An error occurred while generating the shopping list.' });
    }
};