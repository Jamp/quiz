var models = require('../models/models');

exports.load = function (req, res, next, commentId) {
    models.Comment.findById(commentId).then(function (comment){
        if (comment) {
            req.comment = comment;
            next();
        } else {
            next(new Error('No existe el comentario de Id = '+commentId));
        }
    }).catch(function (error){
        next(error);
    });
};

// GET /quizes/comments
exports.new = function (req, res) {
    res.render('comment/new', {quizid: req.params.quizId, errors: {}});
};

// POST /quizes/comments
exports.create = function (req, res, next) {
    var comment = models.Comment.build(
        {
            texto: req.body.comment.texto,
            QuizId: req.params.quizId
        });

    comment.validate().then(
            function (err) {
                if (err) {
                    res.render('comment/new.ejs', {comment: comment, quizid: req.params.quizId, errors: err.errors});
                } else {
                    comment.save().then(function () {
                        res.redirect('/quizes/'+req.params.quizId);
                    });
                }
            }
        ).catch(function (error) {
            next(error);
        });
};

// GET /quizes/comments/:commentId/publish
exports.publish = function (req, res, next) {
    req.comment.publicado = true;

    req.comment.save({fields: ['publicado']}).then(function () {
        res.redirect('/quizes/'+req.params.quizId);
    }).catch(function (error){
        next(error);
    });
};