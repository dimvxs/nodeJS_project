var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var connection = require('./js/config');
var queries = require('./js/queries');
var authorization = require('./js/authorization');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(connection);

var jsonParser = bodyParser.json();
app.use(jsonParser);

var port = 8080;




app.use(cookieParser());
app.use(session({
    saveUninitialized: true,
    secret: 'supersecret',
    store: sessionStore,
    cookie: {
        secure: false, // используйте true, если у вас HTTPS
        maxAge: 86400000 // продолжительность жизни cookie
    }
}));


// создание сессии 
app.use('/editForm', queries);
// app.use('/authorization', authorization);

// app.set('views', path.join(__dirname, 'pages'));
// app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'html/authorization.html'));
});













app.listen(port, function () {
    console.log('app running on port ' + port);
})
