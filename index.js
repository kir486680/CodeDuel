const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const firebase = require('firebase')
const socket = require('socket.io')
const http = require('http')
const uuid = require('uuid');

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
const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;


const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var server = http.createServer(app)
var io = socket(server)


app.get("/", (req, res) =>{
    res.render('index')
})




//add game
app.get("/game/create", (req, res)=>{
    res.render('index')
})
//post create game
app.post('/game/create', (req, res) =>{
    console.log(req.body)
    
    db.collection("games").add({
        questionType: req.body.questionType,
        choosingField: req.body.choosingField,
        password: req.body.password
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        res.redirect('/game/${docRef.id}');
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    res.send('ok');
})
//acess the game by id
app.get("/game/:gameId", (req, res) =>{
  
  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on("joinRoom", room  => {
      console.log('Inside of the lobby');
      socket.join(room)
      
      
    })
    

  });
  
    const usersRef = db.collection('games').doc(req.params.gameId)
    usersRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          usersRef.onSnapshot((doc) => {
            res.render('gameView')
          });
        } else {
          res.render('errorGame')
        }
    });
})
app.get("/lobby/:gameId", (req, res) =>{
    const usersRef = db.collection('games').doc(req.params.gameId)
    usersRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          usersRef.onSnapshot((doc) => {
            res.render('')
          });
        } else {
          res.render('errorGame')
        }
    });
})
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}` );
});
module.exports = app;