var express = require('express');
var router = express.Router();
var connection  = require('./config');
var path = require('path');




// Middleware для получения соединения из пула
router.use(function(req, res, next) {
    connection.getConnection(function(err, connection) {
        if (err) {
            console.error('Ошибка при получении соединения из пула: ', err);
            const errorMessage = 'Ошибка при получении соединения из пула';
            res.sendFile(path.join(__dirname, 'error.html') + '?message=' + encodeURIComponent(errorMessage));
            return res.redirect('/error');
        }
        req.dbConnection = connection; // Сохраняем соединение в объекте запроса
        next(); // Передаем управление следующему обработчику
    });
});

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../html/editForm.html'));
});



router.get('/error', function(req, res){
    res.sendFile(path.join(__dirname, '../html/error.html'));
});



router.get('/success', function(req, res){
    res.sendFile(path.join(__dirname, '../html/success.html'));
});

router.use(express.static(path.join(__dirname, 'views')));

router.get('/results', function(req, res){
    res.sendFile(path.join(__dirname, 'views/index.ejs'));
});







 
    router.post('/add', function(req, res){
    
    var checkID = 'SELECT * FROM posts WHERE postID = ?';
    
    
    var postID = parseInt(req.body.postID); //id
    var location = req.body.location; //локация
    var descript = req.body.descript; // подпись
    var image = req.body.image; //фото
    
    
    req.dbConnection.beginTransaction(function(err) {
        if (err) {
            console.error('Ошибка начала транзакции: ', err);
            req.dbConnection.release();
            const errorMessage = 'Ошибка сервера';
            return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
        }
    
    
        req.dbConnection.execute(checkID, [postID], (err, results) => {
        
        if (err) {
            console.error(err);
            // req.dbConnection.release();
            return req.dbConnection.rollback(() => {
                req.dbConnection.release(); 
                const errorMessage = 'ошибка при проверке id публикации';
                return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
            });
        
        }
    
        if (results.length > 0) {
            // req.dbConnection.release();
            return req.dbConnection.rollback(() => {
                req.dbConnection.release(); 
            const errorMessage = 'публикация уже существует';
            return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
            });
        }
    
    
    

    
    
        var insert = 'INSERT INTO posts (location, descript, image, postID) VALUES (?, ?, ?, ?)';
    

        req.dbConnection.execute(insert, [location, descript, image, postID], (err) => {
            if (err) {
                console.error(err);
                return req.dbConnection.rollback(() => {
                    req.dbConnection.release();
                    const errorMessage = 'Ошибка при добавлении ID публикации';
                    return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
                });
            }




    
                    req.dbConnection.commit(function(err) {
                    if (err) {
                        console.error(err);
                        return req.dbConnection.rollback(function() {
                            req.dbConnection.release();
                            const errorMessage = 'Ошибка при завершении транзакции';
                            return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
                        });
                    }


                    
                
                const successMessage = 'публикация успешно добавлена в базу данных.';
                console.log('транзакция успешно завершена.');
                req.dbConnection.release(); // Возвращаем соединение в пул
                return res.redirect('/success?message=' + encodeURIComponent(successMessage));
            });
        });
    });
    });
    });

    



    router.post('/delete', function(req, res){

        const query = "DELETE FROM posts WHERE postID = ?";
        var postID = parseInt(req.body.postID);


        req.dbConnection.beginTransaction(function(err) {
            if (err) {
                console.error('Ошибка начала транзакции: ', err);
                req.dbConnection.release();
                const errorMessage = 'Ошибка сервера';
                return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
                
            }



            req.dbConnection.execute(query, [postID], (err) => {

            if (err) {
                console.error('Ошибка при удалении публикации:', err);
                return req.dbConnection.rollback(function() {
                    res.status(500).send('Ошибка при удалении публикации');
                    req.dbConnection.release();
                    const errorMessage = 'Ошибка при завершении транзакции';
                        return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
                });
            }

       

            req.dbConnection.execute(query, [postID], (err) => {
                if (err) {
                    console.error('Ошибка при удалении публикации:', err);
                    return req.dbConnection.rollback(() => {
                        req.dbConnection.release();
                        const errorMessage = 'Ошибка при удалении публикации';
                        return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
                    });
                }


            req.dbConnection.commit(function(err) {
                if (err) {
                    console.error(err);
                    return req.dbConnection.rollback(function() {
                        req.dbConnection.release();
                        const errorMessage = 'Ошибка при завершении транзакции';
                        return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
                    });
                }
          
            console.log('публикация удалена');
            const successMessage = 'публикация успешно удалена';
            req.dbConnection.release();
            return res.redirect('/success?message=' + encodeURIComponent(successMessage));
        });
        });
    });
});
});

    




router.post('/edit', function(req, res){

    const query = "UPDATE posts SET location = ?, descript = ?, image = ? WHERE postID = ?";
    var postID = parseInt(req.body.postID);
    var location = req.body.location;
    var descript = req.body.descript;
    var image = req.body.image;

          
        req.dbConnection.beginTransaction(function(err) {
        if (err) {
            console.error('Ошибка начала транзакции: ', err);
            req.dbConnection.release();
            const errorMessage = 'Ошибка сервера';
            return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
            
        }

        req.dbConnection.execute(query, [location, descript, image, postID], (err) => {

        if (err) {
            req.dbConnection.release();
            return req.dbConnection.rollback(() => {
                req.dbConnection.release();
                const errorMessage = 'Ошибка при редактировании публикации';
                return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
            });
        }

      


        req.dbConnection.commit(function(err) {
            if (err) {
                console.error(err);
                return req.dbConnection.rollback(function() {
                    req.dbConnection.release();
                    res.status(500).send('ошибка  при завершении транзакции');
                    const errorMessage = 'ошибка  при завершении транзакции';
                    return res.redirect('/error?message=' + encodeURIComponent(errorMessage));
                });
            }

        console.log('публикация отредактирована');
       var successMessage = 'публикация успешно отредактирована';
       req.dbConnection.release();
        return res.redirect('/success?message=' + encodeURIComponent(successMessage));
    });
})
});
});
    

module.exports = router;
