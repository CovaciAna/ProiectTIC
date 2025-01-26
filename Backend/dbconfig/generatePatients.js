//script generare pacienti fake
const { faker } = require('@faker-js/faker');
const db = require('./dbInit'); // Configurare Firestore

async function generatePatients(count = 50) {
  try {
    for (let i = 0; i < count; i++) {
        const patient = {
            name: faker.person.fullName() || 'N/A',
            age: faker.number.int({ min: 1, max: 100 }) || 0,
            diagnosis: faker.lorem.words(3) || 'Unknown',
            allergies: Array.from(
                { length: faker.number.int({ min: 0, max: 3 }) },
                () => faker.commerce.product()
            ) || [],
            admissionDate: faker.date.past().toISOString() || new Date().toISOString(),
            contact: {
                phone: faker.phone.number('+40 ### ### ###') || 'N/A',
                email: faker.internet.email() || 'N/A',
            },
            address: {
                street: faker.location.streetAddress() || 'N/A',
                city: faker.location.city() || 'N/A',
                country: faker.location.country() || 'N/A',
            },
        };
        
      await db.collection('patients').add(patient);
      console.log(`Pacient generat: ${patient.name}`);
    }
    console.log(`${count} pacienți au fost generați cu succes.`);
  } catch (error) {
    console.error('Eroare la generarea pacienților:', error);
  }
}

// Rulează funcția
generatePatients(50);
