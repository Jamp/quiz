// GET /quizes/question
exports.question = function(req, res) {
    res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

// GET /quizes/answer
exports.answer = function(req, res) {
    if (req.query.respuesta === 'Roma') {
        var respuesta = {respuesta: 'Correcto'};
    } else{
        var respuesta = {respuesta: 'Incorrecto'};
    };

    res.render('quizes/answer', respuesta);
};