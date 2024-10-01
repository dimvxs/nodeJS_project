var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql2');


        var config = {
            host: 'localhost',      // хост
            port: 3306,             // порт MySQL
            user: 'dima',           // пользователь базы данных
            password: '11111111111', // пароль пользователя
            database: 'alkomarket',     // имя базы данных
            waitForConnections: true,  // Ожидать соединения
            connectionLimit: 10,       // Максимальное количество соединений в пуле
            queueLimit: 0              // Неограниченное количество запросов в очереди
        };



var connection = mysql.createPool(config);
// var sessionStore = new MySQLStore(config);


// module.exports = {
//     connection: connection,
//     sessionStore: sessionStore
// }

module.exports = connection; 
// module.exports = sessionStore; 