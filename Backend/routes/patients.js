const express = require('express');
const router = express.Router();
const db = require('../dbconfig/dbInit');

const authenticate = require('../middleware/auth');

// Validare date pacient
const validatePatient = (patient) => {
    if (!patient.name || typeof patient.name !== 'string' || patient.name.trim() === '') {
        return "Numele este obligatoriu.";
    }
    if (!patient.age || typeof patient.age !== 'number' || patient.age <= 0) {
        return "Varsta este obligatorie si trebuie sa fie un numar pozitiv.";
    }
    if (!patient.diagnosis || typeof patient.diagnosis !== 'string' || patient.diagnosis.trim() === '') {
        return "Diagnosticul este obligatoriu.";
    }
    return null;
};

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
        const validationError = validatePatient(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
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
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const patientId = req.params.id;
        const patientRef = db.collection('patients').doc(patientId);
        const patientDoc = await patientRef.get();

        if (!patientDoc.exists) {
            return res.status(404).json({ message: "Pacientul nu a fost gasit" });
        }

        await patientRef.delete();
        res.status(200).json({ message: "Pacient sters cu succes" });
    } catch (error) {
        res.status(500).json({ message: "Eroare la stergere", error: error.message });
    }
});


module.exports = router;
