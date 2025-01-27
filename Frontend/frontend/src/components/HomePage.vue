<template>
  <div class="home-container">
    <h1>Bine ai venit!</h1>

    <div class="menu">
      <router-link to="/patients" class="card">👨‍⚕️ Lista Pacienți</router-link>
      <router-link to="/meals" class="card">🍽 Lista Meniuri</router-link>
      <router-link to="/saloane" class="card">🏥 Saloane</router-link>
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
  margin: 50px;
}
.menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
.card {
  background: #42b983;
  padding: 20px;
  border-radius: 10px;
  color: white;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  width: 200px;
  text-align: center;
}
.logout {
  background: red;
  padding: 15px;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  border: none;
  cursor: pointer;
}
</style>
