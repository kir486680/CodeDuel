const firebase = require('firebase')
//const db = require('./database/config')
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




module.exports = function(app,io){
    app.get("/join/", (req, res) =>{
        res.render('join')
    })
    app.post("/join/", (req, res)=>{
      const reqRoomName = req.body.pin;
      db.collection('games').where("gameId", "==", req.body.pin)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            res.redirect('/game/'+req.body.pin)
              
          });
      })
      .catch(function(error) {
        res.render('errorGame')
      });

      
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
            password: req.body.password,
            gameId: req.body.custId
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            console.log()
            res.redirect('/game/' + req.body.custId);
        })
        .catch(function(error) {
            console.error("Error adding document: ");
        })
    
        
    })
    //acess the game by id
    app.get("/game/:gameId", (req, res) =>{
       db.collection('games').where("gameId", "==", req.params.gameId)
       .get()
       .then(function(querySnapshot) {
           querySnapshot.forEach(function(doc) {
               console.log("Found such document")
               res.render('gameView')
           });
       })
       .catch(function(error) {
        res.render('errorGame')
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
    
    
    
    
io.on('connection', (socket) => {
    console.log("user connected")
    socket.on('player-join', data => {
    console.log("new playeer joined")
    console.log(data.name)
    socket.join(data.lobbyId)
    socket.to(data).emit('message', {
        type: 'connect'
    });
    })
});

    
}