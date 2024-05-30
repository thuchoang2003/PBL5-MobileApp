// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getDatabase} from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBKSzJlvw-hc4TMK0IVKNYb8szlL9ytewo',
  authDomain: 'pbl5-dut-firebase.firebaseapp.com',
  projectId: 'pbl5-dut-firebase',
  storageBucket: 'pbl5-dut-firebase.appspot.com',
  messagingSenderId: '46031896146',
  appId: '1:46031896146:web:1b70d1b39c5842decfa98b',
  measurementId: 'G-FTXS2K097C',
  databaseURL:
    'https://pbl5-dut-firebase-default-rtdb.asia-southeast1.firebasedatabase.app',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// const analytics = getAnalytics(firebaseApp);
