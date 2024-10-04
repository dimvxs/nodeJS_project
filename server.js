var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var queries = require('./js/queries');
var authorization = require('./js/authorization');
var results = require('./js/results');





var jsonParser = bodyParser.json();
app.use(jsonParser);

var port = 8080;




app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'public')));


// var sessionStore = sessionConfig.createStore();

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'html/authorization.html'));
});

app.get('/failedLogin', function (req, res) {
    res.sendFile(path.join(__dirname, 'html/failedLogin.html'));
});

app.get('/error', function (req, res) {
    res.sendFile(path.join(__dirname, 'html/error.html'));
});

app.get('/success', function (req, res) {
    res.sendFile(path.join(__dirname, 'html/success.html'));
});

app.get('/editForm', function (req, res) {
    res.sendFile(path.join(__dirname, 'html/editForm.html'));
});




app.use(cookieParser());
// app.use(session({
//     saveUninitialized: true,
//     secret: 'supersecret',
//     store: sessionStore,
//     cookie: {
//         secure: false, // используйте true, если у вас HTTPS
//         maxAge: 86400000 // продолжительность жизни cookie
//     }
// }));



app.use('/editForm', queries);
app.use('/authorization', authorization);
app.use('/post', results);




app.listen(port, function () {
    console.log('app running on port ' + port);
})
