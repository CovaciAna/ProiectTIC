<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const auth = getAuth();
const store = useStore();

const validateFields = () => {
  if (!email.value.trim() || !password.value.trim()) {
    errorMessage.value = "Toate campurile sunt obligatorii!";
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = "Adresa de email este invalida!";
    return false;
  }
  return true;
};

const login = async () => {
  errorMessage.value = '';
  if (!validateFields()) {
    return;
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    const token = await user.getIdToken();
    
    console.log("Token primit:", token);

    if (!token) 
      throw new Error("Autentificare esuata: token lipsa.");

    localStorage.setItem('token', token);
    store.commit('SET_USER', { token });
    store.commit('SET_AUTH', true);

    router.push('/home');
  } catch (error) {
    console.error("Eroare la autentificare:", error);
    errorMessage.value = error.message;
  }
};

const register = async () => {
  errorMessage.value = '';
  
  if (!validateFields()) {
    return;
  }
  
  if (password.value.length < 6) {
    errorMessage.value = "Parola trebuie sa aibă cel putin 6 caractere!";
    return;
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    const token = await user.getIdToken();
    
    console.log("Token primit dupa inregistrare:", token);

    if (!token)
      throw new Error("Eroare la inregistrare: token lipsa.");

    localStorage.setItem('token', token);
    store.commit('SET_USER', { token });
    store.commit('SET_AUTH', true);

    router.push('/home');
  } catch (error) {
    if (error.code === 'auth/weak-password') {
      errorMessage.value = 'Parola trebuie să aiba cel putin 6 caractere!';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'Acest email este deja folosit!';
    } else {
      errorMessage.value = 'A aparut o eroare. Incearca din nou!';
    }
    console.error("Eroare la inregistrare:", error);
  }
};
</script>

<template>
  <div class="login-container">
    <h2 class="title">Hospital Meal Planner</h2>
    
    <input type="email" v-model="email" placeholder="Email" class="input-field" />
    <input type="password" v-model="password" placeholder="Parolă" class="input-field" />
    
    <div class="button-container">
      <button class="button" @click="login">🔐 Login</button>
      <button class="button" @click="register">📝 Înregistrare</button>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
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

.button-container {
  margin-top: 20px;
}

.button {
  background: linear-gradient(45deg, #42b983, #2c3e50);
  border: none;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  margin: 0 5px;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.error {
  color: red;
  font-size: 0.875rem;
  margin-bottom: 10px;
  display: block;
}
</style>
