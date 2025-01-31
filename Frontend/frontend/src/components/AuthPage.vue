<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const email = ref('');
const password = ref('');
const errorMessage = ref('');  
const router = useRouter();
const auth = getAuth();
const store = useStore();

//login
const login = async () => {
  errorMessage.value = '';  
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
    console.error(" Eroare la autentificare: ", error);
    errorMessage.value = error.message;
  }
};

// register
const register = async () => {
  errorMessage.value = '';  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    const token = await user.getIdToken(); 
    
    console.log("Token primit după inregistrare:", token);

    if (!token) 
      throw new Error("Eroare la inregistrare: token lipsă.");

    localStorage.setItem('token', token);
    store.commit('SET_USER', { token });
    store.commit('SET_AUTH', true);

    router.push('/home'); 
  } catch (error) {
    if (error.code === 'auth/weak-password') {
      errorMessage.value = 'Parola trebuie sa aiba cel putin 6 caractere!';
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
  <div class="container">
    <h2 class="title">Hospital Meal Planner</h2>
    
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

.error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>
