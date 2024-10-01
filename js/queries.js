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
    res.sendFile(path.join(__dirname, '../html/editForm.html'));
});




 
    router.post('/add', function(req, res){
    
    var checkName = 'SELECT * FROM items WHERE name = ?';
    var checkDrinkID = 'SELECT * FROM items WHERE id = ?';
    
    
    var id = parseInt(req.body.id);
    var name = req.body.name;
    var price = req.body.price;
    var categoryID = req.body.categoryID;
    var image = req.body.image;
    
    
    req.dbConnection.beginTransaction(function(err) {
        if (err) {
            console.error('Ошибка начала транзакции: ', err);
            req.dbConnection.release();
            return res.status(500).send('Ошибка сервера');
        }
    
    
        req.dbConnection.execute(checkName, [name], (err, results) => {
        
        if (err) {
            console.error(err);
            req.dbConnection.release();
            return res.status(500).send('ошибка при проверке названия напитка');
        }
    
        if (results.length > 0) {
            // название группы уже существует
            dbConnection.release();
            return res.status(500).send('напиток уже существует');
        }
    
    
    
        req.dbConnection.execute(checkDrinkID, [id], (err, results) => {
        if (err) {
            console.error(err);
            return req.dbConnection.rollback(function() {
                req.req.dbConnection.release();
                res.status(500).send('ошибка при проверке ID напитка');
            });
    
        
        }
    
        if (results.length > 0) {
            // id группы уже существует
            return req.dbConnection.rollback(function() {
                req.dbConnection.release();
                res.status(500).send('напиток уже существует');
            });
        }
    
        var insert = 'INSERT INTO items (id, name, price, categoryID, image) VALUES (?, ?)';
    
        req.dbConnection.commit(function(err) {

                
                if (err) {
                    console.error(err);
                    return req.dbConnection.rollback(function() {
                        req.dbConnection.release();
                        res.status(500).send('ошибка  при завершении транзакции');
                    });
                }

                req.dbConnection.execute(insert, [id, name, price, categoryID, image], (err) => {
    
                    if (err) {
                        console.error(err);
                        return req.dbConnection.rollback(function() {
                            req.dbConnection.release();
                            res.status(500).send('ошибка при добавлении ID напитка');
                        });
                
                    
                    }
        
                console.log('транзакция успешно завершена.');
                res.send('напиток успешно добавлен в базу данных.');
                req.dbConnection.release(); // Возвращаем соединение в пул
            });
        });
    });
    });
    });
    });
    



    router.post('/delete', function(req, res){

        const query = "DELETE FROM items WHERE id = ?";
        var id = parseInt(req.body.id);


        req.dbConnection.beginTransaction(function(err) {
            if (err) {
                console.error('Ошибка начала транзакции: ', err);
                req.dbConnection.release();
                return res.status(500).send('Ошибка сервера');
            }



            req.dbConnection.execute(query, [id], (err) => {

            if (err) {
                console.error('Ошибка при удалении напитка:', err);
                return req.dbConnection.rollback(function() {
                    conn.release();
                    res.status(500).send('Ошибка при удалении напитка');
                    req.dbConnection.release();
                });
            }

            req.dbConnection.commit(function(err) {
                if (err) {
                    console.error(err);
                    return req.dbConnection.rollback(function() {
                        req.dbConnection.release();
                        res.status(500).send('ошибка  при завершении транзакции');
                    });
                }
          
            console.log('напиток удален');
            res.send('напиток успешно удален');
            req.dbConnection.release();
        });
        });
    });
});




router.post('/edit', function(req, res){

    const query = "UPDATE items SET name = ?, price = ?, categoryID = ?, image = ? WHERE Id = ?";
    var id = parseInt(req.body.id);
    var name = req.body.name;
    var price = req.body.price;
    var categoryID = req.body.categoryID;
    var image = req.body.image;

          
        req.dbConnection.beginTransaction(function(err) {
        if (err) {
            console.error('Ошибка начала транзакции: ', err);
            req.dbConnection.release();
            return res.status(500).send('Ошибка сервера');
        }

        req.dbConnection.execute(query, [name, price, categoryID, image, id], (err) => {

        if (err) {
            console.error('Ошибка при обновлении напитка:', err);
            return res.status(500).send('Ошибка при обновлении напитка');
        }


        req.dbConnection.commit(function(err) {
            if (err) {
                console.error(err);
                return req.dbConnection.rollback(function() {
                    req.dbConnection.release();
                    res.status(500).send('ошибка  при завершении транзакции');
                });
            }

        console.log('напиток обновлен');
        res.send('напиток успешно обновлен');
    });
})
});
});
    

module.exports = router;
