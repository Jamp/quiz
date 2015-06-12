var models = require('../models/models');

exports.new = function (req, res) {
    res.render('comment/new', {quizid: req.params.quizId, errors: {}});
};

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
