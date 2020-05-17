const path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const socket = require('socket.io')
const http = require('http')
const uuid = require('uuid');


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
require('./routes')(app, io);


server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}` );
});
module.exports = app;