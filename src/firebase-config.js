import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgkmLDP29TS0DsMStq3Kr9O8Sa49z2Zng",
  authDomain: "fir-authwithreact.firebaseapp.com",
  projectId: "fir-authwithreact",
  storageBucket: "fir-authwithreact.appspot.com",
  messagingSenderId: "544990825650",
  appId: "1:544990825650:web:78b45f7b2caacf23f8cdab",
  measurementId: "G-H601NL1FCG"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);