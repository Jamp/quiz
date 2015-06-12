var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller.js');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

// Quizes
router.param('quizId', quizController.load);


router.get('/quizes', quizController.index);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);

router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);

// Comment
router.get('/quizes/:quizId(\\d+)/comment/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comment', commentController.create);


// Objetivo 2 de la tarea
router.get('/author', function (req, res) {
    res.render('author', {errors: []});
});

module.exports = router;
