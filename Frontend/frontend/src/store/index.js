import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null, 
    isAuthenticated: false, 
    patients: [],
    meals: []
  },
  mutations: {
    SET_USER(state, user) {
      if (user && user.token) {
          state.user = user;
          state.isAuthenticated = true;
          localStorage.setItem('token', user.token); // salvare token in localstorage
      } else {
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem('token'); // del token la logout
      }
  },
    SET_AUTH(state, status) {
      console.log("Actualizare isAuthenticated:", status); 
      state.isAuthenticated = status;
    },
    SET_PATIENTS(state, patients) {
      state.patients = patients;
    },
    SET_MEALS(state, meals) {
      state.meals = meals;
    },
    REMOVE_PATIENT(state, patientId) {
      state.patients = state.patients.filter(patient => patient.id !== patientId);
  },
  UPDATE_PATIENT(state, updatedPatient) {
    const index = state.patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      const cleanPatient = { ...updatedPatient };
      delete cleanPatient.editing;
      state.patients[index] = { ...state.patients[index], ...cleanPatient };
    }
  },
  ADD_PATIENT(state, newPatient) {
    state.patients.push({ ...newPatient, editing: false });
  },
  ADD_MEAL(state, newMeal) {
    state.meals.push(newMeal);
},
UPDATE_MEAL(state, updatedMeal) {
  const index = state.meals.findIndex(meal => meal.id === updatedMeal.id);
  if (index !== -1) {
      state.meals[index] = updatedMeal; 
  }
},
},
  actions: {
    async fetchPatients({ commit }) {
      try {
        const response = await fetch('http://localhost:3000/patients');
        const data = await response.json();
        const patientsWithEditing = data.map(patient => ({
          ...patient,
          editing: false
        }));
        commit('SET_PATIENTS', patientsWithEditing);
      } catch (error) {
        console.error('Eroare la preluarea pacienților:', error);
      }
    },

    async addPatientAPI({ commit, state }, newPatient) {
      if (!state.user || !state.user.token) {
          console.error("Token lipsa! Utilizatorul nu este autentificat.");
          return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/patients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.user.token}`
          },
          body: JSON.stringify(newPatient)
        });

        if (!response.ok) {
          throw new Error("Eroare la adaugarea pacientului.");
        }

        const addedPatient = await response.json();
        commit('ADD_PATIENT', addedPatient);
      } catch (error) {
        console.error("Eroare la adaugarea pacientului:", error);
      }
    }
    ,
    async deletePatientAPI({ commit, state }, patientId) {
      if (!state.user || !state.user.token) {
          console.error("Token lipsa! Utilizatorul nu este autentificat.");
          return;
      }
  
      console.log("Token trimis:", state.user.token);
  
      try {
          const response = await fetch(`http://localhost:3000/api/patients/${patientId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${state.user.token}`
              }
          });
  
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || "Eroare la stergere");
          }
  
          commit('REMOVE_PATIENT', patientId);
      } catch (error) {
          console.error("Eroare în Vuex la stergere:", error);
      }
  },
  async updatePatientAPI({ commit, state }, updatedPatient) {
    if (!state.user || !state.user.token) {
      console.error("Token lipsa! Utilizatorul nu este autentificat.");
      return;
    }
  
    //sterg editing inainte de upd
    const patientToSend = { ...updatedPatient };
    delete patientToSend.editing;
  
    try {
      const response = await fetch(`http://localhost:3000/api/patients/${updatedPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.user.token}`
        },
        body: JSON.stringify(patientToSend)
      });
  
      if (!response.ok) {
        throw new Error("Eroare la actualizare pacient.");
      }
  
      commit('UPDATE_PATIENT', updatedPatient);
    } catch (error) {
      console.error("Eroare la actualizare:", error);
    }
  }
,
async addMealAPI({ commit, state }, newMeal) {
  if (!state.user || !state.user.token) {
      console.error("Token lipsa! Utilizatorul nu este autentificat.");
      return;
  }

  try {
      const response = await fetch('http://localhost:3000/meals', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.user.token}`
          },
          body: JSON.stringify(newMeal)
      });

      if (!response.ok) {
          throw new Error(`Eroare la adăugare: ${response.status}`);
      }

      const addedMeal = await response.json();

      commit('ADD_MEAL', addedMeal);
  } catch (error) {
      console.error("Eroare la adaugare:", error);
  }
}
,
async fetchMealsAPI({ commit }) {
  try {
    const response = await fetch("http://localhost:3000/meals"); 
    if (!response.ok) {
      throw new Error(`Eroare HTTP: ${response.status}`); 
    }
    const data = await response.json();
    commit("SET_MEALS", Array.isArray(data) ? data : []);
    return data;  
  } catch (error) {
    console.error("Eroare la preluarea meniurilor:", error);
    commit("SET_MEALS", []); 
    return [];  
  }
}
,
async fetchMeals({ commit }) {
  try {
    const response = await fetch("http://localhost:3000/meals"); 

    if (!response.ok) {
      throw new Error(`Eroare HTTP: ${response.status}`); 
    }

    const data = await response.json();
    commit("SET_MEALS", Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Eroare la preluarea meniurilor:", error);
    commit("SET_MEALS", []); 
  }
},
async updateMealAPI({ commit, state }, updatedMeal) {
  if (!updatedMeal.id) {
      console.error("Eroare: ID-ul meniului lipseste!"); 
      return;
  }

  if (!state.user || !state.user.token) {
      console.error("Token lipsa! Utilizatorul nu este autentificat.");
      return;
  }

  try {
      const response = await fetch(`http://localhost:3000/meals/${updatedMeal.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${state.user.token}`
          },
          body: JSON.stringify(updatedMeal)
      });

      if (!response.ok) {
          throw new Error("Eroare la actualizarea meniului.");
      }

      const updatedMealFromServer = await response.json();
      console.log("Meniu actualizat cu succes:", updatedMealFromServer);
      commit("UPDATE_MEAL", updatedMealFromServer);
  } catch (error) {
      console.error("Eroare la actualizare:", error);
  }
}
,

    logout({ commit }) {
      commit('SET_USER', null);
      commit('SET_AUTH', false);
    }
  }
}
);

export default store;
