<template> 
  <div class="home-container">
    <h2 class="title">Hospital Meal Planner</h2>

    <div class="menu">
      <router-link to="/patients" class="card">👨‍⚕️ Lista Pacienți</router-link>
      <router-link to="/meals" class="card">🍽 Lista Meniuri</router-link>
      <router-link to="/patients-meals" class="card">📋 Pacienți / Meniuri</router-link>
      <button @click="handleLogout" class="logout">🚪 Logout</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'HomePage',
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout(); 
      this.$router.push('/auth'); 
    }
  }
};
</script>

<style>
.home-container {
  text-align: center;
  margin: 20px;
}

/* 🔹 Titlu stilizat fără animații */
.title {
  font-size: 48px;
  font-weight: bold;
  text-transform: uppercase;
  background: linear-gradient(45deg, #42b983, #2c3e50);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(66, 185, 131, 0.5);
  margin-bottom: 30px;
}

.menu {
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 20px;
  height: 80vh;
  justify-content: center;
}

.card, .logout {
  width: 80%;
  max-width: 600px;
  padding: 30px;
  border-radius: 15px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

/* 🔹 Efect hover pentru carduri */
.card {
  background: #42b983;
}

.card:hover {
  background: #369d72;
  transform: scale(1.05);
}

.logout {
  background: red;
  border: none;
}

.logout:hover {
  background: darkred;
  transform: scale(1.05);
}
</style>
