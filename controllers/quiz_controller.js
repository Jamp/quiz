var models = require('../models/models');

// Autoload de Quizes
exports.load = function (req, res, next, quizId){
    models.Quiz.findById(quizId).then(
        function (quiz) {
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                next(new Error('No existe un Quiz de Id = '+quizId));
            }
        }
    ).catch(function (error) {next(error);});
};

// GET /quizes
exports.index = function (req, res) {
    models.Quiz.findAll().then(
        function (quizes) {
            res.render('quizes/index', {quizes: quizes});
        }
    ).catch(function (error) {next(error);});
};

// GET /quizes/question
exports.show = function(req, res) {
    res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/answer
exports.answer = function(req, res) {
    var respuesta = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        respuesta = 'Correcto';
    }

    res.render('quizes/answer', {quiz: req.quiz, respuesta: respuesta});
};