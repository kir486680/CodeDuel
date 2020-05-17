const firebase = require('firebase')
const firebaseConfig = {
  apiKey: "AIzaSyA5FnjGU22HkKx9uvFgDhzpPfD4xi9kV9A",
  authDomain: "coding-duel.firebaseapp.com",
  databaseURL: "https://coding-duel.firebaseio.com",
  projectId: "coding-duel",
  storageBucket: "coding-duel.appspot.com",
  messagingSenderId: "211481481998",
  appId: "1:211481481998:web:9117adc5d3723a3f5f3d5f"
};
firebase.initializeApp(firebaseConfig)
var db = firebase.firestore();

module.exports.db = db