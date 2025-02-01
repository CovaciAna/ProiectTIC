const express = require('express');
const router = express.Router();
const db = require('../dbconfig//dbInit');
const authenticate = require('../middleware/auth'); 

// Validare date masa
const validateMeal = (meal) => {
    if (!meal.name || typeof meal.name !== 'string' || meal.name.trim() === '') {
        return "Denumirea meniului este obligatorie.";
    }
    if (!meal.calories || typeof meal.calories !== 'number' || meal.calories <= 800) {
        return "Numarul de calorii este obligatoriul si trebuie sa fie > 800.";
    }
    return null;
};

// Obtine toate mesele
router.get('/', async (req, res) => {
    try {
        const mealsSnapshot = await db.collection('meals').get();
        let meals = [];
        mealsSnapshot.forEach(doc => {
            meals.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(meals);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obtinerea meselor", error });
    }
});

// Obtine o masa dupa ID
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('meals').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: "Masa nu exista" });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: "Eroare la obtinerea mesei", error });
    }
});

// Adauga o masa
router.post('/', async (req, res) => {
    try {
        const validationError = validateMeal(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const newMeal = req.body;
        const mealRef = await db.collection('meals').add(newMeal);
        res.status(201).json({ id: mealRef.id, ...newMeal });
    } catch (error) {
        res.status(500).json({ message: "Eroare la adăugarea mesei", error });
    }
});


// Actualizeaza o masa 
router.put('/:id', authenticate, async (req, res) => {
    try {
        const updatedData = req.body;
        await db.collection('meals').doc(req.params.id).update(updatedData);
        res.status(200).json({ message: "Masa actualizata cu succes" });
    } catch (error) {
        res.status(500).json({ message: "Eroare la actualizare", error });
    }
});


module.exports = router;
