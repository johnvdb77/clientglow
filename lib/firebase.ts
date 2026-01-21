import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_C3yyMumNopaAYA63ZcuAJPNUFdHbMu0",
  authDomain: "clientglow-f13e6.firebaseapp.com",
  projectId: "clientglow-f13e6",
  storageBucket: "clientglow-f13e6.firebasestorage.app",
  messagingSenderId: "80800200313",
  appId: "1:80800200313:web:e8d377536c22e45c7906a8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
