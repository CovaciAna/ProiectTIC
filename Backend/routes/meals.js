const express = require('express');
const router = express.Router();
const db = require('../dbconfig//dbInit');
const authenticate = require('../middleware/auth'); 

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
router.post('/', authenticate, async (req, res) => {
    try {
        const newMeal = req.body;
        const mealRef = await db.collection('meals').add(newMeal);
        res.status(201).json({ id: mealRef.id, ...newMeal });
    } catch (error) {
        res.status(500).json({ message: "Eroare la adaugarea mesei", error });
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

// sterge o masa
router.delete('/:id', authenticate, async (req, res) => {
    try {
        await db.collection('meals').doc(req.params.id).delete();
        res.status(200).json({ message: "Masa stearsa cu succes" });
    } catch (error) {
        res.status(500).json({ message: "Eroare la stergere", error });
    }
});

module.exports = router;
