// Cargar Modelo ORM
var Sequelize = require('sequelize');
var models = require('../models/models');

// Autoload de Quizes
exports.load = function (req, res, next, quizId){
    models.Quiz.find({
        where: { id: Number(quizId) },
        include: [{ model: models.Comment }]
    }).then(
        function (quiz) {
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                next(new Error('No existe un Quiz de Id = '+quizId));
            }
        }
    ).catch(function (error) {
        next(error);
    });
};

// GET /quizes
exports.index = function (req, res, next) {

    // Tarea del Módulo 7
    // La busqueda la parametriza vacía
    var query = undefined;

    // si existe una busqueda se arma el query con el ORM
    // http://docs.sequelizejs.com/en/latest/docs/querying/#operators
    if (req.query.search) {

        // Segundo Apartado reemplazar espacios por %
        var search = req.query.search.replace(/ /g,'%');

        query = {
            where: {
                pregunta: {
                    $iLike: '%'+search+'%'
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
        respuesta: 'Respuesta',
        tema: 'Otro'
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
            quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function (){
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
    req.quiz.tema = req.body.quiz.tema;

    req.quiz.validate().then(function (err) {
        if (err) {
            res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
        } else {
            req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function (){
                res.redirect('/quizes');
            });
        }
    });
};

// DELETE /quizes/:id
exports.destroy = function(req, res, next) {
    req.quiz.destroy().then(function () {
        res.redirect('/quizes');
    }).catch(function (error) {next(error); });
};


// Asignación Adicional
// GET /quizes/statistics
exports.statistics = function (req, res, next) {
    var cantidadPreguntas = 0;
    var cantidadComentarios = 0;
    var promedioComentarios = 0;
    var ceroComentarios = 0;
    var unoOMasComentarios = 0;

    var contadorCallback = 0;
    var totalCallback = 3;

    var renderCallback = function () {
        if (contadorCallback == totalCallback) {
            // Promedio de comentarios por pregunta
            promedioComentarios = (cantidadComentarios/cantidadPreguntas).toFixed(1);

            // Número de preguntas sin comentarios
            ceroComentarios = cantidadPreguntas - unoOMasComentarios;

            res.render('quizes/statistics', {
                cantidadPreguntas: cantidadPreguntas,
                cantidadComentarios: cantidadComentarios,
                promedioComentarios: promedioComentarios,
                ceroComentarios: ceroComentarios,
                unoOMasComentarios: unoOMasComentarios,
                errors: []
            });
        }
    };

    // Número de preguntas
    models.Quiz.count().then(function(numero){
        contadorCallback++;
        cantidadPreguntas = numero
        renderCallback();
    });

    // Número de comentarios totales
    models.Comment.count().then(function(numero){
        contadorCallback++;
        cantidadComentarios = numero
        renderCallback();
    });

    // Número de preguntas con comentarios
    models.Comment.count({
        group: ['QuizId']
    }).then(function(numero){
        contadorCallback++;
        unoOMasComentarios = numero.length;
        renderCallback();
    });
}