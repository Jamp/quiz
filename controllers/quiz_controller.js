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

    // Tarea del Módulo 7
    // La busqueda la parametriza vacía
    var query = undefined;

    // si existe una busqueda se arma el query con el ORM
    // http://docs.sequelizejs.com/en/latest/docs/querying/#operators
    if (req.query.search) {

        // Segundo Apartado reemplazar espacios por %
        var search = req.query.search.replace(' ','%');

        query = {
            where: {
                pregunta: {
                    $like: '%'+search+'%'
                }
            }
        }
    }

    // se envia el query al findAll, si esta undefined muestro todos, si hay una busqueda filtra
    models.Quiz.findAll(query).then(
        function (quizes) {
            res.render('quizes/index', {quizes: quizes, errors: []});
        }
    ).catch(function (error) {next(error);});
};

// GET /quizes/new
exports.new = function (req, res) {
    var quiz = models.Quiz.build({
        pregunta: 'Pregunta',
        respuesta: 'Respuesta'
    });

    res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function (req, res) {
    var quiz = models.Quiz.build(req.body.quiz);

    quiz.validate().then(function (err) {
        if (err) {
            res.render('quizes/new', {quiz: quiz, errors: err.errors});
        } else {
            quiz.save({fields: ["pregunta", "respuesta"]}).then(function (){
                res.redirect('/quizes');
            });
        }
    });
};


// GET /quizes/question
exports.show = function(req, res) {
    res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/answer
exports.answer = function(req, res) {
    var respuesta = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        respuesta = 'Correcto';
    }

    res.render('quizes/answer', {quiz: req.quiz, respuesta: respuesta, errors: []});
};

// GET /quizes/edit
exports.edit = function (req, res) {
    var quiz = req.quiz;

    res.render('quizes/edit', {quiz: req.quiz, errors: []});
};

// PUT /quizes/update
exports.update = function (req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;

    req.quiz.validate().then(function (err) {
        if (err) {
            res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
        } else {
            req.quiz.save({fields: ["pregunta", "respuesta"]}).then(function (){
                res.redirect('/quizes');
            });
        }
    });
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function (error) { next(error); });
};
