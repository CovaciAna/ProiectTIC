
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB0-zFK73Mzf-yypwioo9pv7gkhd4wsN94",
    authDomain: "tic-2024-99d4f.firebaseapp.com",
    projectId: "tic-2024-99d4f",
    storageBucket: "tic-2024-99d4f.firebasestorage.app",
    messagingSenderId: "261524831042",
    appId: "1:261524831042:web:865f8319225320a191a6db"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);

export { auth };
