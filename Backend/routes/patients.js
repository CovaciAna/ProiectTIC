const express = require('express');
const router = express.Router();
const db = require('../dbconfig/dbInit');

const authenticate = require('../middleware/auth');

// Obtine toti pacientii
router.get('/', async (req, res) => {
    try {
        const patientsSnapshot = await db.collection('patients').get();
        let patients = [];
        patientsSnapshot.forEach(doc => {
            patients.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obtinerea pacientilor", error });
    }
});

// Obtine un pacient dupa ID
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('patients').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: "Pacientul nu exista" });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: "Eroare la obtinerea pacientului", error });
    }
});

// Adauga un nou pacient
router.post('/', authenticate,  async (req, res) => {
    try {
        const newPatient = req.body;
        const patientRef = await db.collection('patients').add(newPatient);
        res.status(201).json({ id: patientRef.id, ...newPatient });
    } catch (error) {
        res.status(500).json({ message: "Eroare la adaugarea pacientului", error });
    }
});

// Actualizeaza un pacient
router.put('/:id', authenticate, async (req, res) => {
    try {
        const updatedData = req.body;
        await db.collection('patients').doc(req.params.id).update(updatedData);
        res.status(200).json({ message: "Pacient actualizat cu succes" });
    } catch (error) {
        res.status(500).json({ message: "Eroare la actualizare", error });
    }
});

// Sterge un pacient
router.delete('/:id',authenticate, async (req, res) => {
    try {
        await db.collection('patients').doc(req.params.id).delete();
        res.status(200).json({ message: "Pacient sters cu succes" });
    } catch (error) {
        res.status(500).json({ message: "Eroare la stergere", error });
    }
});

module.exports = router;
