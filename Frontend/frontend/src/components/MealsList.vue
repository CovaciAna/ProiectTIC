<template>
  <div class="meals-container">
    <h1 class="title">Lista Meniuri</h1>
    
    <div v-if="isAuthenticated">
    <button @click="toggleForm" class="add-button">
      {{ showForm ? 'Anulează' : 'Adaugă Meniu' }}
    </button>
    </div>
    
    <div v-if="showForm" class="meal-form">
      <h2>{{ isEditing ? 'Editează Meniu' : 'Adaugă Meniu' }}</h2>
      
      <div class="form-group">
        <label>Nume:</label>
        <input v-model="newMeal.name" @blur="validateName" placeholder="Nume" />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>
      <div class="form-group">
        <label>Descriere:</label>
        <textarea v-model="newMeal.description" @blur="validateDescription" placeholder="Descriere"></textarea>
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      </div>
      <div class="form-group">
        <label>Calorii:</label>
        <input :value="totalCalories()" disabled />
        <span v-if="errors.calories" class="error-message">{{ errors.calories }}</span>
      </div>

      <div class="form-group">
        <label>Pacienți:</label>
        <select v-model="newMeal.patients" multiple>
          <option v-for="patient in patients" :key="patient.id" :value="patient.id">
            {{ patient.name }}
          </option>
        </select>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Tip dietă:</label>
          <input v-model="newMeal.diet_type" placeholder="Tip dietă" />
        </div>
        <div class="form-group">
          <label>Alergeni excluși:</label>
          <input v-model="newMeal.allergen_free" placeholder="Alergeni (separați prin virgulă)" />
        </div>
        <div class="form-group">
          <label>Afecțiuni medicale:</label>
          <input v-model="newMeal.medical_conditions" placeholder="Afecțiuni medicale (separate prin virgulă)" />
        </div>
      </div>

      <div class="meal-sections">
        <h3>Mese Zilnice</h3>
        <div v-for="(mealSection, key) in newMeal.daily_meals" :key="key" class="meal-section">
          <h4>{{ mealLabels[key] }}</h4>
          <div v-for="(item, index) in mealSection.items" :key="index" class="meal-item">
            <input v-model="item.name" placeholder="Nume aliment" />
            <input v-model.number="item.calories" placeholder="Calorii" type="number" />
          </div>
          <button class="add-item-button" @click="addMealItem(key)">Adaugă aliment</button>
        </div>
      </div>

      <button class="save-button" @click="addOrUpdateMeal">Salvează</button>
    </div>

    <div class="meal-list">
      <h2>Meniuri existente</h2>
      <div v-if="meals && meals.length">
        <div v-for="meal in meals" :key="meal.id" class="meal-item-list">
          <h3>{{ meal.name }}</h3>
          <p><strong>Descriere:</strong> {{ meal.description }}</p>
          <p><strong>Calorii:</strong> {{ meal.calories }}</p>
          <p><strong>Tip dietă:</strong> {{ meal.diet_type }}</p>

          <p v-if="meal.patients && meal.patients.length">
            <strong>Pacienți:</strong>
            <span v-for="(id, index) in meal.patients" :key="id">
              {{ getPatientName(id) }}<span v-if="index < meal.patients.length - 1">, </span>
            </span>
          </p>

          <div class="meal-actions" v-if="isAuthenticated">
            <button class="edit-button" @click="editMeal(meal)">Editează</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Nu există meniuri disponibile.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState,mapActions } from 'vuex';

export default {
  data() {
    return {
      showForm: false,
      isEditing: false,
      errors: {},
      newMeal: {
        id: null,
        name: '',
        description: '',
        calories: 0,
        diet_type: '',
        allergen_free: [],
        medical_conditions: [],
        meal_times: [],
        patients: [],
        daily_meals: {
          breakfast: { items: [] },
          lunch: { items: [] },
          dinner: { items: [] },
          snacks: { items: [] }
        }
      },
      mealLabels: {
        breakfast: "Mic dejun",
        lunch: "Prânz",
        dinner: "Cină",
        snacks: "Gustare"
      }
    };
  },
  computed: {
    ...mapState(['isAuthenticated']),
    meals() {
      return this.$store.state.meals;
    },
    patients() {
      return this.$store.state.patients;
    }
  },
  created() {
    this.$store.dispatch('fetchPatients'); 
    this.$store.dispatch('fetchMeals');
  },
  methods: {
    ...mapActions([
      'addMealAPI',      
      'fetchMealsAPI',   
      'updateMealAPI'    
    ]),
    generateRandomId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  },
  totalCalories() {
    return Object.values(this.newMeal.daily_meals).reduce((total, mealSection) => {
      return total + mealSection.items.reduce((subTotal, item) => subTotal + (item.calories || 0), 0);
    }, 0);
  },
    async fetchMeals() {
      try {
        const data = await this.fetchMealsAPI();
        if (data && Array.isArray(data.menus)) {
          this.meals = data.menus;
        } else if (Array.isArray(data)) {
          this.meals = data;
        } else {
          this.meals = [];
        }
      } catch (error) {
        console.error("Eroare la preluarea meniurilor:", error);
        this.meals = [];
      }
    },
    async addOrUpdateMeal() {
      const isValid = this.validateForm(); 
      if (!isValid) {
        console.error("Validarea a eșuat. Meniul nu va fi trimis.");
        return; 
      }

      this.newMeal.calories = this.totalCalories();
      if (!this.isEditing) {
        this.newMeal.id = this.generateRandomId();
      }

      try {
        if (this.isEditing) {
          await this.updateMealAPI(this.newMeal);
        } else {
          await this.addMealAPI(this.newMeal);
        }
        this.resetForm();
        this.fetchMeals();
      } catch (error) {
        console.error("Eroare la salvarea meniului:", error);
      }
},
    editMeal(meal) {
      if (!meal) {
        console.error("Eroare: Meniul selectat pentru editare nu există.");
        return;
      }
      this.newMeal = JSON.parse(JSON.stringify(meal));
      this.isEditing = true;
      this.showForm = true;
    },
    toggleForm() {
      if (this.showForm && this.isEditing) {
        this.resetForm();
      } else {
        this.showForm = !this.showForm;
      }
    },
    resetForm() {
      this.newMeal = { 
        id: null,
        name: '', 
        description: '', 
        calories: 0, 
        diet_type: '', 
        allergen_free: [], 
        medical_conditions: [], 
        meal_times: [],
        patients: [],
        daily_meals: {
          breakfast: { items: [] },
          lunch: { items: [] },
          dinner: { items: [] },
          snacks: { items: [] }
        }
      };
      this.isEditing = false;
      this.showForm = false;
    },
    addMealItem(mealType) {
      this.newMeal.daily_meals[mealType].items.push({ name: '', calories: 0 });
    },
    getPatientName(id) {
      const patient = this.patients.find(p => p.id === id);
      return patient ? patient.name : 'Necunoscut';
    },
   validateName() {
  this.errors.name = this.newMeal.name.trim().length >= 3 ? '' : 'Numele trebuie să aibă cel puțin 3 caractere.';
},

validateDescription() {
  this.errors.description = this.newMeal.description.trim().length >= 10 ? '' : 'Descrierea trebuie să aibă cel puțin 10 caractere.';
},

validateForm() {
  this.validateName();
  this.validateDescription();

  return !this.errors.name && !this.errors.description;
}

  }
};
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 2px;
}

.meals-container {
  max-width: 1000px;
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

.add-button,
.save-button,
.add-item-button {
  background: linear-gradient(45deg, #42b983, #2c3e50);
  border: none;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  display: block;
  margin: 0 auto 30px;
}
.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.save-button {
  padding: 14px;
  width: 100%;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 20px;
}
.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.add-item-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 10px;
}
.add-item-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.meal-form h2 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 20px;
  color: #444;
  text-align: center;
}
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
label {
  font-size: 0.9rem;
  margin-bottom: 8px;
  color: #555;
}
input,
textarea,
select {
  padding: 12px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border 0.3s, box-shadow 0.3s;
   font-family: 'Roboto', sans-serif;
}
input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.15);
}
textarea {
  min-height: 100px;
  resize: vertical;
  font-family: 'Roboto', sans-serif;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}
.form-group.full-width {
  grid-column: 1 / -1;
}

.meal-sections {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
}
.meal-sections h3 {
  margin-bottom: 15px;
  color: #333;
}
.meal-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ececec;
}
.meal-section h4 {
  margin-bottom: 10px;
  color: #555;
  font-size: 1.1rem;
}
.meal-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.meal-item input {
  flex: 1;
}

.meal-list {
  margin-top: 30px;
}
.meal-item-list {
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}
.meal-item-list h3 {
  margin-bottom: 10px;
  color: #333;
}

.meal-actions {
  margin-top: 10px;
}
.edit-button{
  background: linear-gradient(45deg, #3498db, #2c3e50);
  border: none;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-right: 10px;
}
.edit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-bottom: 10px;
  display: block;
}

</style>
