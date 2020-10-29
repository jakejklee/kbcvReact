import firebase from 'firebase';

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyC1DzRUdHuMzBc340G5yUCKb_dE4wzGQ_A",
    authDomain: "kbcv-77a69.firebaseapp.com",
    databaseURL: "https://kbcv-77a69.firebaseio.com",
    projectId: "kbcv-77a69",
    storageBucket: "kbcv-77a69.appspot.com",
    messagingSenderId: "370344483933",
    appId: "1:370344483933:web:624f0cae3f82d56819c1b4",
    measurementId: "G-PL6ZPWWBD5"
};
firebase.initializeApp(firebaseConfig);

export default firebase;