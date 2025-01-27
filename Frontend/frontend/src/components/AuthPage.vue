<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');  
const router = useRouter();
const auth = getAuth();

//login
const login = async () => {
  errorMessage.value = '';  
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/home');
  } catch (error) {
    errorMessage.value = error.message;
  }
};

//register
const register = async () => {
  errorMessage.value = '';  
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push('/home');
  } catch (error) {
    if (error.code === 'auth/weak-password') {
      errorMessage.value = 'Parola trebuie sa aiba cel puțin 6 caractere!';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'Acest email este deja folosit!';
    } else {
      errorMessage.value = 'A aparut o eroare. Incearca din nou!';
    }
  }
};
</script>

<template>
  <div class="container">
    <h2>Hospital Meal Planner</h2>
    
    <input type="email" v-model="email" placeholder="Email" class="input-field" />
    <input type="password" v-model="password" placeholder="Parola" class="input-field" />
    
    <div class="button-container">
      <button class="button login" @click="login">🔐 Login</button>
      <button class="button register" @click="register">📝 Înregistrare</button>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.input-field {
  display: block;
  width: 80%;
  margin: 10px auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.button-container {
  margin-top: 20px;
}

.button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  opacity: 0.8;
}

.login {
  background-color: green;
}

.register {
  background-color: blue;
}

.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>