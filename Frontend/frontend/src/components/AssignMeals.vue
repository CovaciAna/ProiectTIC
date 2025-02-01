<template>
  <div class="min-h-screen bg-gray-50 dashboard-container">
    <header class="header bg-white shadow">
      <div class="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 class="header-title">
          Dashboard Pacienți &amp; Meniuri
        </h1>
        <div class="ml-auto">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Caută pacient..."
            class="input-base w-72"
          />
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <div class="filter-section modern-filter mb-6">
        <div class="flex flex-col">
          <label for="meal-select" class="label-base">Filtrează după meniu:</label>
          <select id="meal-select" v-model="selectedMeal" class="input-base modern-input">
            <option value="">Toate</option>
            <option v-for="meal in meals" :key="meal.id" :value="meal.id">
              {{ meal.name }}
            </option>
          </select>
        </div>
        <div class="flex flex-col">
          <label for="meal-time-select" class="label-base">Filtrează după masă:</label>
          <select id="meal-time-select" v-model="selectedMealTime" class="input-base modern-input">
            <option value="">Toate</option>
            <option value="breakfast">Mic dejun</option>
            <option value="lunch">Prânz</option>
            <option value="dinner">Cină</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="resetFilters" class="red-gradient-button modern-reset">
            <i class="fas fa-sync-alt mr-1"></i> Resetează
          </button>
        </div>
      </div>

      <div class="summary-cards grid grid-flow-col auto-cols-fr gap-2 mb-6 overflow-x-auto">
        <div class="card-summary">
          <h2 class="card-title">Total Pacienți</h2>
          <p class="card-number">{{ patients.length }}</p>
        </div>
        <div class="card-summary">
          <h2 class="card-title">Pacienți Filtrați</h2>
          <p class="card-number">{{ filteredPatients.length }}</p>
        </div>
        <div class="card-summary">
          <h2 class="card-title">Media de Vârstă</h2>
          <p class="card-number">{{ averageAge }}</p>
        </div>
      </div>

      <div class="table-container bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th @click="sortBy('name')" class="cursor-pointer th-base">
                Nume Pacient
                <span v-if="sortColumn === 'name'">
                  <i v-if="sortOrder === 'asc'" class="fas fa-arrow-up ml-1"></i>
                  <i v-else class="fas fa-arrow-down ml-1"></i>
                </span>
              </th>
              <th class="th-base">Tip Meniu</th>
              <th class="th-base">Masă</th>
              <th @click="sortBy('age')" class="cursor-pointer th-base">
                Vârstă
                <span v-if="sortColumn === 'age'">
                  <i v-if="sortOrder === 'asc'" class="fas fa-arrow-up ml-1"></i>
                  <i v-else class="fas fa-arrow-down ml-1"></i>
                </span>
              </th>
              <th class="th-base">Diagnosticul</th>
              <th class="th-base">Alergii</th>
              <th class="th-base">Acțiuni</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="patient in paginatedPatients"
              :key="patient.id"
              class="hover-row"
            >
              <td class="td-base">
                {{ patient.name }}
              </td>
              <td class="td-base">
                {{ getMealName(patient.id) }}
              </td>
              <td class="td-base">
                {{ getMealTime(patient.id) }}
              </td>
              <td class="td-base">
                {{ patient.age || 'N/A' }}
              </td>
              <td class="td-base">
                {{ patient.diagnosis || 'N/A' }}
              </td>
              <td class="td-base">
                {{ formatAllergies(patient.allergies) }}
              </td>
              <td class="td-base">
                <button @click="openPatientModal(patient)" class="gradient-button">
                  Vezi detalii
                </button>
              </td>
            </tr>
            <tr v-if="paginatedPatients.length === 0">
              <td colspan="7" class="td-base text-center text-gray-500">
                Nu există pacienți care să corespundă filtrelor selectate.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
    </main>

    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="modal bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="modal-title">Detalii pacient</h3>
        <p><strong>Nume:</strong> {{ currentPatient.name }}</p>
        <p>
          <strong>Vârstă:</strong>
          {{ currentPatient.age || 'N/A' }}
        </p>
        <p>
          <strong>Diagnosticul:</strong>
          {{ currentPatient.diagnosis || 'N/A' }}
        </p>
        <p>
          <strong>Alergii:</strong>
          {{ formatAllergies(currentPatient.allergies) }}
        </p>
        <p>
          <strong>Meniu:</strong> {{ getMealName(currentPatient.id) }}
        </p>
        <p>
          <strong>Masa:</strong> {{ getMealTime(currentPatient.id) }}
        </p>
        <div v-if="getPatientMeal(currentPatient.id)" class="menu-details mt-4">
          <h4 class="menu-details-title">Detalii Meniu</h4>
          <p>
            <strong>Descriere:</strong>
            {{ getPatientMeal(currentPatient.id).description || 'N/A' }}
          </p>
          <p>
            <strong>Calorii:</strong>
            {{ getPatientMeal(currentPatient.id).calories || 'N/A' }}
          </p>
          <p>
            <strong>Tip dietă:</strong>
            {{ getPatientMeal(currentPatient.id).diet_type || 'N/A' }}
          </p>
          <p>
            <strong>Alergeni excluși:</strong>
            {{
              Array.isArray(getPatientMeal(currentPatient.id).allergen_free)
                ? getPatientMeal(currentPatient.id).allergen_free.join(', ')
                : getPatientMeal(currentPatient.id).allergen_free || 'N/A'
            }}
          </p>
        </div>
        <button @click="closeModal" class="gradient-button modal-close-button">
          Închide
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AssignMealsDashboard',
  data() {
    return {
      selectedMeal: '',
      selectedMealTime: '',
      searchQuery: '',
      sortColumn: '',
      sortOrder: 'asc',
      currentPage: 1,
      pageSize: 5,
      showModal: false,
      currentPatient: null,
    };
  },
  computed: {
    ...mapState(['patients', 'meals']),
    filteredPatients() {
      return this.patients.filter((patient) => {
        const matchesSearch = this.searchQuery
          ? patient.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true;
        const assignedMeal = this.getPatientMeal(patient.id);
        const matchesMeal = this.selectedMeal
          ? assignedMeal?.id === this.selectedMeal
          : true;
        const matchesMealTime = this.selectedMealTime
          ? this.mealContainsMealTime(assignedMeal, this.selectedMealTime)
          : true;
        return matchesSearch && matchesMeal && matchesMealTime;
      });
    },
    sortedPatients() {
      const patientsCopy = [...this.filteredPatients];
      if (this.sortColumn) {
        patientsCopy.sort((a, b) => {
          let aVal, bVal;
          if (this.sortColumn === 'name') {
            aVal = a.name || '';
            bVal = b.name || '';
          } else if (this.sortColumn === 'age') {
            aVal = a.age || 0;
            bVal = b.age || 0;
          }
          if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }
          if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
          if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }
      return patientsCopy;
    },
    paginatedPatients() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.sortedPatients.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.sortedPatients.length / this.pageSize) || 1;
    },
    averageAge() {
      if (this.filteredPatients.length === 0) return 'N/A';
      const totalAge = this.filteredPatients.reduce(
        (sum, patient) => sum + (patient.age || 0),
        0
      );
      return (totalAge / this.filteredPatients.length).toFixed(1);
    },
  },
  methods: {
    ...mapActions(['fetchPatients', 'fetchMeals']),
    getPatientMeal(patientId) {
      return (
        this.meals.find(
          (meal) =>
            Array.isArray(meal.patients) &&
            meal.patients.includes(patientId)
        ) || null
      );
    },
    getMealName(patientId) {
      const meal = this.getPatientMeal(patientId);
      return meal ? meal.name : 'N/A';
    },
    getMealTime(patientId) {
      const meal = this.getPatientMeal(patientId);
      if (!meal || !meal.daily_meals) return 'N/A';
      if (this.selectedMealTime) {
        const items = meal.daily_meals[this.selectedMealTime]?.items;
        return items ? items.map(item => item.name).join(', ') : 'N/A';
      } else {
        const mealTimes = Object.keys(meal.daily_meals);
        if (mealTimes.length === 0) return 'N/A';
        return mealTimes
          .map(key => {
            const items = meal.daily_meals[key]?.items;
            const itemsStr = items ? items.map(item => item.name).join(', ') : 'N/A';
            let label = key;
            if (key === 'breakfast') label = 'Mic dejun';
            else if (key === 'lunch') label = 'Prânz';
            else if (key === 'dinner') label = 'Cină';
            return `${label}: ${itemsStr}`;
          })
          .join(' ; ');
      }
    },
    mealContainsMealTime(meal, mealTime) {
      return meal?.daily_meals?.[mealTime]?.items?.length > 0;
    },
    formatAllergies(allergies) {
      return Array.isArray(allergies)
        ? allergies.join(', ')
        : allergies || 'N/A';
    },
    resetFilters() {
      this.selectedMeal = '';
      this.selectedMealTime = '';
      this.searchQuery = '';
      this.sortColumn = '';
      this.sortOrder = 'asc';
      this.currentPage = 1;
    },
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortOrder = 'asc';
      }
    },
    handlePageChange(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    openPatientModal(patient) {
      this.currentPatient = patient;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.currentPatient = null;
    },
  },
  mounted() {
    this.fetchPatients();
    this.fetchMeals();
  },
};
</script>

<style scoped>
.dashboard-container,
.header,
.filter-section,
.card-summary,
.table-container,
.pagination,
.modal {
  font-family: 'Roboto', sans-serif;
}

.header-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #42b983, #2c3e50);
  -webkit-background-clip: text;
  color: transparent;
}

.input-base {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  transition: border 0.3s, box-shadow 0.3s;
}
.input-base:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.15);
}

.label-base {
  color: #555;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.modern-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.modern-input {
  transition: all 0.3s ease;
}
.modern-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.15);
}

.modern-reset {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.summary-cards {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.card-summary {
  background: #fff;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
}
.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.25rem;
}
.card-number {
  font-size: 1.5rem;
  font-weight: bold;
}

.th-base {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
}
.td-base {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: #555;
}
.hover-row:hover {
  background-color: #f9f9f9;
}

.gradient-button,
.pagination-button,
.modal-close-button {
  background: linear-gradient(45deg, #42b983, #2c3e50);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.gradient-button:hover,
.pagination-button:hover,
.modal-close-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.red-gradient-button {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.red-gradient-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

.container {
  max-width: 1200px;
}
</style>
