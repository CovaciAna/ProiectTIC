import { createStore } from 'vuex';

const store = createStore({
  state: {
    patients: [],
    meals: []
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_PATIENTS(state, patients) {
      state.patients = patients;
    },
    SET_MEALS(state, meals) {
      state.meals = meals;
    }
  },
  actions: {
    async fetchPatients({ commit }) {
      try {
        const response = await fetch('http://localhost:3000/patients');
        const data = await response.json();
        commit('SET_PATIENTS', data);
      } catch (error) {
        console.error('Eroare la preluarea pacienților:', error);
      }
    },
    async fetchMeals({ commit }) {
      try {
        const response = await fetch('http://localhost:3000/meals');
        const data = await response.json();
        commit('SET_MEALS', data);
      } catch (error) {
        console.error('Eroare la preluarea meselor:', error);
      }
    }
  }
});

export default store;
