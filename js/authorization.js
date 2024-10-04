var express = require('express');
var router = express.Router();
var connection = require('./config');
var path = require('path');



// Middleware для получения соединения из пула
router.use(function(req, res, next) {
    connection.getConnection(function(err, connection) {
        if (err) {
            console.error('Ошибка при получении соединения из пула: ', err);
            return res.status(500).send('Ошибка сервера');
        }
        req.dbConnection = connection; // Сохраняем соединение в объекте запроса
        next(); // Передаем управление следующему обработчику
    });
});


router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../html/authorization.html'));
});





router.post('/login', function(req, res){
    var login = req.body.login;
    var password = req.body.password;
    var query = 'SELECT * FROM users WHERE login = ? AND password = ?';

    req.dbConnection.execute(query, [login, password], (err, results) => {
        if (err) {
        console.log("Login failed: ", req.body.login);
        req.dbConnection.release(); 
        return res.redirect('/failedLogin');
        }
    
        if (results.length > 0) {
            // req.session.login = login; 
            // console.log("Login succeeded: ", req.session.login);
                        console.log("Login succeeded");
                        req.dbConnection.release(); 
                        return res.redirect('/editForm');

                              
            // return res.send('Login successful: ' + 'sessionID: ' + req.session.id + '; user: ' + req.session.login);
        }
    

        else{
            return res.redirect('/failedLogin');
        }
    
       
});

});

module.exports = router;