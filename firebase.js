const firebaseConfig = {
  apiKey: "AIzaSyBqNGWOodlE-DRmA6Pbdn-IvnrZo2dkYuc",
  authDomain: "kitsuneapp-2f5d8.firebaseapp.com",
  projectId: "kitsuneapp-2f5d8",
  storageBucket: "kitsuneapp-2f5d8.firebasestorage.app",
  messagingSenderId: "121007015869",
  appId: "1:121007015869:web:dea84666f98fcb4a45f4d4"
};

// Inicializar o Firebase Compatível com o Navegador
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Tornar as ferramentas globais para o app.js usar
window.auth = firebase.auth();
window.db = firebase.firestore();
window.CORE_ID = "kitsune-core-v1";