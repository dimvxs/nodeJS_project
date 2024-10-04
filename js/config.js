// var session = require('express-session');
// var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql2');


        var config = {
            host: 'localhost',      // хост
            user: 'dima',           // пользователь базы данных
            password: '11111111111', // пароль пользователя
            database: 'vk',     // имя базы данных
            port: 3306,             // порт MySQL
            waitForConnections: true,  // Ожидать соединения
            connectionLimit: 20,       // Максимальное количество соединений в пуле
            queueLimit: 0              // Неограниченное количество запросов в очереди
        };



var connection = mysql.createPool(config);
// var sessionStore = new MySQLStore(config);


// module.exports = {
//     connection: connection,
//     sessionStore: sessionStore
// }


module.exports = connection;





// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var MySQLStore = require('express-mysql-session')(session);
// var mysql = require('mysql2');

// // Настройки подключения к базе данных
// var config = {
//     host: 'localhost',      // хост
//     port: 3306,             // порт MySQL
//     user: 'dima',           // пользователь базы данных
//     password: '11111111111', // пароль пользователя
//     database: 'testdb',     // имя базы данных
// };

// // Создание пула соединений
// var connection = mysql.createPool(config);

// // Функция для создания хранилища сессий
// function createStore() {
//     return new MySQLStore(config);
// }

// // Экспортируем соединение и функцию для создания хранилища
// module.exports = {
//     createStore: createStore,
//     connection: connection
// };
