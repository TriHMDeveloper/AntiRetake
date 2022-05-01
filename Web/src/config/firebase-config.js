import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBatBNUZyd7dxw-r21j7KiUwDojdJeKjC8',
  authDomain: 'anti-retake-user-mcs.firebaseapp.com',
  projectId: 'anti-retake-user-mcs',
  storageBucket: 'anti-retake-user-mcs.appspot.com',
  messagingSenderId: '3853350658',
  appId: '1:3853350658:web:04703f23c9b2a033c9341b',
  measurementId: 'G-NSWGNZWT6G',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const storage = getStorage(app);
