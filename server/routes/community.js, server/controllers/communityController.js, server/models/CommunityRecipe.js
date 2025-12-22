// server/models/CommunityRecipe.js
const mongoose = require('mongoose');

const communityRecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    ratings: {
        type: [Number],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('CommunityRecipe', communityRecipeSchema);

// server/controllers/communityController.js
const CommunityRecipe = require('../models/CommunityRecipe');

exports.submitRecipe = async (req, res) => {
    const { title, ingredients, instructions, author } = req.body;
    try {
        const newRecipe = new CommunityRecipe({ title, ingredients, instructions, author });
        await newRecipe.save();
        res.status(201).json({ message: 'Recipe submitted successfully', recipe: newRecipe });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting recipe', error: error.message });
    }
};

exports.rateRecipe = async (req, res) => {
    const { recipeId, rating } = req.body;
    try {
        const recipe = await CommunityRecipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        recipe.ratings.push(rating);
        await recipe.save();
        res.status(200).json({ message: 'Recipe rated successfully', ratings: recipe.ratings });
    } catch (error) {
        res.status(500).json({ message: 'Error rating recipe', error: error.message });
    }
};

// server/routes/community.js
const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.post('/submit', communityController.submitRecipe);
router.post('/rate', communityController.rateRecipe);

module.exports = router;