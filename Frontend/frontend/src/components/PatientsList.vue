<template>
  <div>
    <h1>Lista Pacienți</h1>
    <button @click="isAuthenticated && toggleAddPatientForm" class="toggle-button">
      {{ showAddPatientForm ? "🔽 Ascunde Formularul" : "➕ Adaugă Pacient" }}
    </button>
    <div v-if="isAuthenticated && showAddPatientForm" class="add-patient-form">
      <h3>Adaugă pacient nou</h3>
      <input v-model="newPatient.name" placeholder="Nume" class="input-field" />
      <input v-model="newPatient.address.city" placeholder="Oraș" class="input-field" />
      <input v-model="newPatient.address.country" placeholder="Țară" class="input-field" />
      <input v-model="newPatient.address.street" placeholder="Stradă" class="input-field" />
      <input v-model="newPatient.admissionDate" type="date" class="input-field" />
      <input v-model="newPatient.age" type="number" placeholder="Vârstă" class="input-field" />
      <input v-model="newPatient.allergies" placeholder="Alergii (separate prin virgulă)" class="input-field" />
      <input v-model="newPatient.contact.email" placeholder="Email" class="input-field" />
      <input v-model="newPatient.contact.phone" placeholder="Telefon" class="input-field" />
      <input v-model="newPatient.diagnosis" placeholder="Diagnostic" class="input-field" />

      <button @click="addPatient">➕ Adaugă Pacient</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nume</th>
          <th>Adresă</th>
          <th>Data admiterii</th>
          <th>Vârstă</th>
          <th>Alergii</th>
          <th>Contact</th>
          <th>Diagnostic</th>
          <th v-if="isAuthenticated">Acțiuni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in patients" :key="patient.id">
          <td>{{ patient.id }}</td>
          <td>{{ patient.name }}</td>
          <td>{{ patient.address.city }}, {{ patient.address.country }}, {{ patient.address.street }}</td>
          <td>{{ formatDate(patient.admissionDate) }}</td>
          <td>{{ patient.age }}</td>

          <!-- Alergii (editabil) -->
          <td>
            <input v-if="patient.editing" v-model="patient.allergies" placeholder="Alergii (virgulă)" />
            <span v-else>{{ Array.isArray(patient.allergies) ? patient.allergies.join(', ') : patient.allergies || 'N/A' }}</span>
          </td>

          <!-- Contact -->
          <td>
            <div>Email: {{ patient.contact.email }}</div>
            <div>Telefon: {{ patient.contact.phone }}</div>
          </td>

          <!-- Diagnostic (editabil) -->
          <td>
            <input v-if="patient.editing" v-model="patient.diagnosis" />
            <span v-else>{{ patient.diagnosis }}</span>
          </td>

          <!-- Butoane Acțiuni -->
          <td v-if="isAuthenticated">
            <button @click="editPatient(patient)">
              {{ patient.editing ? 'Salvează' : 'Editează' }}
            </button>
            <button @click="deletePatient(patient.id)"> Șterge</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { nextTick } from 'vue';

export default {
  name: 'PatientsTable',
  data() {
    return {
      showAddPatientForm: false,
      newPatient: {
        name: '',
        address: { city: '', country: '', street: '' },
        admissionDate: '',
        age: '',
        allergies: '',
        contact: { email: '', phone: '' },
        diagnosis: ''
      }
    };
  },
  computed: {
    ...mapState(['isAuthenticated', 'patients'])
  },
  methods: {
     ...mapActions(['fetchPatients', 'updatePatientAPI', 'deletePatientAPI', 'addPatientAPI']),

   toggleAddPatientForm() {
      this.showAddPatientForm = !this.showAddPatientForm; 
    },
    async addPatient() {
      if (!this.newPatient.name.trim() || !this.newPatient.contact.email.trim()) {
        alert("Numele si email-ul sunt obligatorii!");
        return;
      }

      let formattedPatient = {
        ...this.newPatient,
        allergies: this.newPatient.allergies ? this.newPatient.allergies.split(',').map(a => a.trim()) : []
      };

      try {
        await this.addPatientAPI(formattedPatient);
        this.newPatient = { name: '', address: { city: '', country: '', street: '' }, admissionDate: '', age: '', allergies: '', contact: { email: '', phone: '' }, diagnosis: '' };
        this.fetchPatients(); 
      } catch (error) {
        console.error("Eroare la adaugare:", error);
      }
    },

    async deletePatient(patientId) {
      try {
        await this.$store.dispatch("deletePatientAPI", patientId);
      } catch (error) {
        console.error("Eroare la stergere:", error);
      }
    },

    editPatient(patient) {
      if (!('editing' in patient)) {
        patient.editing = false;
      }

      if (patient.editing) {
        const patientCopy = {
          id: patient.id,
          allergies: patient.allergies,
          diagnosis: patient.diagnosis
        };
        this.updatePatientAPI(patientCopy);
      }

      patient.editing = !patient.editing;
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  },
  mounted() {
    this.fetchPatients();
    nextTick(() => {
      console.log("DOM-ul este gata.");
      console.log("Autentificat:", this.isAuthenticated);
    });
  }
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
button {
  display: inline-block !important;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}
.input-field {
  display: block;
  width: 80%;
  margin: 5px auto;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.add-patient-form {
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}
.toggle-button {
  display: block;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 14px;
}
.toggle-button:hover {
  background-color: #0056b3;
}
</style>
