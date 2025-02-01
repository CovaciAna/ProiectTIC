<template>
  <div class="patients-container">
    <h1 class="title">Lista Pacienți</h1>

    <div v-if="isAuthenticated">
      <button @click="toggleAddPatientForm" class="toggle-button">
        {{ showAddPatientForm ? "🔽 Ascunde Formularul" : "➕ Adaugă Pacient" }}
      </button>
    </div>

    <div v-if="isAuthenticated && showAddPatientForm" class="add-patient-form">
      <h3>Adaugă pacient nou</h3>
      <input v-model="newPatient.name" @blur="validateName" placeholder="Nume" class="input-field" />
      <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      
      <input v-model="newPatient.address.city" placeholder="Oraș" class="input-field" />
      <input v-model="newPatient.address.country" placeholder="Țară" class="input-field" />
      <input v-model="newPatient.address.street" placeholder="Stradă" class="input-field" />
      
      <input v-model="newPatient.admissionDate" type="date" class="input-field" />
      
      <input v-model="newPatient.age" type="number" @blur="validateAge" placeholder="Vârstă" class="input-field" />
      <span v-if="errors.age" class="error-message">{{ errors.age }}</span>
      
      <input v-model="newPatient.allergies" placeholder="Alergii (separate prin virgulă)" class="input-field" />
      
      <input v-model="newPatient.contact.email" @blur="validateEmail" placeholder="Email" class="input-field" />
      <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      
      <input v-model="newPatient.contact.phone" @blur="validatePhone" placeholder="Telefon" class="input-field" />
      <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
      
      <input v-model="newPatient.diagnosis" @blur="validateDiagnosis" placeholder="Diagnostic" class="input-field" />
      <span v-if="errors.diagnosis" class="error-message">{{ errors.diagnosis }}</span>
      
      <button @click="addPatient" class="form-button">➕ Adaugă Pacient</button>
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
        <tr v-for="patient in paginatedPatients" :key="patient.id">
          <td>{{ patient.id }}</td>
          <td>{{ patient.name }}</td>
          <td>
            {{ patient.address.city }}, {{ patient.address.country }}, {{ patient.address.street }}
          </td>
          <td>{{ formatDate(patient.admissionDate) }}</td>
          <td>{{ patient.age }}</td>
          <td>
            <input
              v-if="patient.editing"
              v-model="patient.allergies"
              placeholder="Alergii (virgulă)"
              class="input-field-inline"
            />
            <span v-else>
              {{ Array.isArray(patient.allergies) ? patient.allergies.join(', ') : patient.allergies || 'N/A' }}
            </span>
          </td>
          <td>
            <div>Email: {{ patient.contact.email }}</div>
            <div>Telefon: {{ patient.contact.phone }}</div>
          </td>
          <td>
            <input
              v-if="patient.editing"
              v-model="patient.diagnosis"
              class="input-field-inline"
            />
            <span v-else>{{ patient.diagnosis }}</span>
          </td>
          <td v-if="isAuthenticated">
            <button @click="editPatient(patient)" class="action-button">
              {{ patient.editing ? 'Salvează' : 'Editează' }}
            </button>
           <button @click="confirmDelete(patient.id)"  class="action-button delete-button">Șterge</button>
                <MessageBox 
      v-if="showMessageBox" 
      :message="'Sigur vrei să ștergi acest pacient?'" 
      type="question" 
      @confirmed="deletePatient"
      @canceled="showMessageBox = false"
    />
          </td>
        </tr>
        <tr v-if="paginatedPatients.length === 0">
          <td colspan="9" class="text-center" style="padding: 20px; color: #555;">
            Nu există pacienți.
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        &lt;
      </button>
      <span class="pagination-text">
        Pagina {{ currentPage }} din {{ totalPages }}
      </span>
      <button
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { nextTick } from 'vue';
import MessageBox from './MessageBox.vue';


export default {
  name: 'PatientsList',
  components: { MessageBox },
  data() {
    return {
      errors: {
        name: "",
        age: "",
        diagnosis: "",
        email: "",
        phone: ""
      },
      showMessageBox: false,
      patientToDelete: null,
      showAddPatientForm: false,
      newPatient: {
        name: '',
        address: { city: '', country: '', street: '' },
        admissionDate: '',
        age: '',
        allergies: '',
        contact: { email: '', phone: '' },
        diagnosis: ''
      },
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    ...mapState(['isAuthenticated', 'patients']),
    paginatedPatients() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.patients.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.patients.length / this.pageSize) || 1;
    }
  },
  methods: {
    ...mapActions(['fetchPatients', 'updatePatientAPI', 'deletePatientAPI', 'addPatientAPI']),

confirmDelete(patientId) {
      this.patientToDelete = patientId;
      this.showMessageBox = true;
    },

    async deletePatient() {
      if (this.patientToDelete) {
        await this.deletePatientAPI(this.patientToDelete);
        this.showMessageBox = false;
        this.patientToDelete = null;
      }
    },
    toggleAddPatientForm() {
      this.showAddPatientForm = !this.showAddPatientForm;
    },

    async addPatient() {
  if (!this.validateForm()) {
    console.error("Validarea a esuat. Pacientul nu va fi trimis.");
    return;
  }

  const formattedPatient = {
    ...this.newPatient,
    allergies: this.newPatient.allergies
      ? this.newPatient.allergies.split(',').map(a => a.trim())
      : []
  };

  try {
    await this.addPatientAPI(formattedPatient);
    this.newPatient = {
      name: '',
      address: { city: '', country: '', street: '' },
      admissionDate: '',
      age: '',
      allergies: '',
      contact: { email: '', phone: '' },
      diagnosis: ''
    };
    this.fetchPatients();
  } catch (error) {
    console.error("Eroare la adaugare:", error);
  }
}
,

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
      return date.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    handlePageChange(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
validateName() {
  this.errors.name = this.newPatient.name.trim().length >= 3 ? '' : 'Numele trebuie sa aiba cel putin 3 caractere.';
},

validateAge() {
  this.errors.age = (this.newPatient.age >= 0 && this.newPatient.age <= 120) ? '' : 'Varsta trebuie sa fie intre 0 si 120 de ani.';
},

validateDiagnosis() {
  this.errors.diagnosis = this.newPatient.diagnosis.trim().length >= 5 ? '' : 'Diagnosticul trebuie să aibă cel puțin 5 caractere.';
},

validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  this.errors.email = emailRegex.test(this.newPatient.contact.email) ? '' : 'Introduceti un email valid.';
},

validatePhone() {
  const phoneRegex = /^[0-9]{10}$/;
  this.errors.phone = phoneRegex.test(this.newPatient.contact.phone) ? '' : 'Introduceti un numar de telefon valid (doar cifre, 10 caractere).';
},

    validateForm() {
      this.validateName();
      this.validateAge();
      this.validateDiagnosis();
      this.validateEmail();
      this.validatePhone();

      return !this.errors.name && !this.errors.age && !this.errors.diagnosis &&
            !this.errors.email && !this.errors.phone;
}
  },
  mounted() {
    this.fetchPatients();
    nextTick(() => {
      console.log("Autentificat:", this.isAuthenticated);
    });
  }
};
</script>

<style scoped>
.patients-container {
  max-width: 1600px;
  width: 90%;
  margin: 40px auto;
  padding: 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.toggle-button {
  background: linear-gradient(45deg, #42b983, #2c3e50);
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: block;
  margin: 0 auto 20px;
}
.toggle-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-patient-form {
  background: #f9f9f9;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
}
.add-patient-form h3 {
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.input-field {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border 0.3s, box-shadow 0.3s;
}
.input-field:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.15);
}

.input-field-inline {
  padding: 6px;
  font-size: 0.9rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

.form-button {
  background: linear-gradient(45deg, #42b983, #2c3e50);
  color: #fff;
  border: none;
  padding: 12px 24px;
  margin: 20px auto 0;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: block;
}
.form-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px auto 40px;
}
th, td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}
th {
  background: #f1f1f1;
  font-weight: 600;
}

.action-button {
  background: linear-gradient(45deg, #42b983, #2c3e50);
  border: none;
  color: #fff;
  padding: 8px 16px;
  margin-right: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-size: 0.9rem;
}
.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.delete-button {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
}
.pagination-button {
  background: linear-gradient(45deg, #42b983, #2c3e50);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.pagination-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination-text {
  font-size: 0.875rem;
  color: #555;
}
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-bottom: 10px;
  display: block;
}
</style>
