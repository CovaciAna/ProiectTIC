<template> 
  <div class="home-container">
    <h2 class="title">Hospital Meal Planner</h2>

    <div class="menu">
      <router-link to="/patients" class="card">👨‍⚕️ Lista Pacienți</router-link>
      <router-link to="/meals" class="card">🍽 Lista Meniuri</router-link>
      <router-link to="/assignmeals" class="card">📋 Pacienți / Meniuri</router-link>
      <button @click="showLogoutConfirmation" class="logout">🚪 Logout</button>
        </div>
    </div>
   <MessageBox 
      v-if="showMessageBox" 
      :message="'Sigur vrei să te deloghezi?'" 
      type="question" 
      @confirmed="handleLogout"
      @canceled="showMessageBox = false"
    />
</template>

<script>
import MessageBox from "./MessageBox.vue";
import { mapActions } from 'vuex';


export default {
  name: 'HomePage',
  components: { MessageBox },
  data() {
    return {
      showMessageBox: false
    };
  },
  methods: {
    ...mapActions(['logout']), 
     showLogoutConfirmation() {
      this.showMessageBox = true;
    },
    async handleLogout() {  
      await this.logout(); 
      this.showMessageBox = false;
      this.$router.push('/auth');  
    }
  }
};
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  text-align: center;
}

.title {
  font-size: 2.5rem;
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
  margin-top: 20px;
}

.card, .logout {
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card {
  background: linear-gradient(45deg, #42b983, #2c3e50);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.logout {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  border: none;
}

.logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>
