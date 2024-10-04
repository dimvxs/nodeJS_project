var express = require('express');
var router = express.Router();
var connection = require('./config');
var path = require('path');



router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static(path.join(__dirname, 'html')));

// Middleware для получения соединения из пула
router.use(function(req, res, next) {
    connection.getConnection(function(err, dbConnection) {
        if (err) {
            console.error('Ошибка при получении соединения из пула: ', err);
            const errorMessage = 'Ошибка при получении соединения из пула';
            return res.redirect(`/error?message=${encodeURIComponent(errorMessage)}`);
        }
        req.dbConnection = dbConnection; // Сохраняем соединение в объекте запроса
        next(); // Передаем управление следующему обработчику
    });
});


router.get('/', function (req, res) {
    console.log('main');
    // res.sendFile(path.join(__dirname, 'html/authorization.html'));
    res.redirect('/authorization.html');
});

router.get('/backToEditForm', function (req, res) {
    console.log('editForm');
    // res.sendFile(path(__dirname, 'editForm.html'));
    return res.redirect('/editForm.html');

});

// Получение всех публикаций
router.get('/results', function(req, res) {
    const query = 'SELECT * FROM posts'; // Запрос к БД для получения всех публикаций
    req.dbConnection.query(query, (err, results) => {
        // Освобождаем соединение после выполнения запроса
        req.dbConnection.release();

        if (err) {
            console.error(err);
            const errorMessage = 'Ошибка при получении публикаций';
            return res.redirect(`/error?message=${encodeURIComponent(errorMessage)}`);
        }
        // Рендеринг страницы с результатами
        res.render('index', { posts: results });
    });
});

// Экспортируем маршруты
module.exports = router;
