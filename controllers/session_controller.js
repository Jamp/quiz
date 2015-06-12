exports.loginRequired = function (req, res, next) {
    if (res.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// GET /login
exports.new = function (req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('session/new', {errors: errors});
}

// POST /login
exports.create = function (req, res) {
    var login = req.body.login;
    var password = req.body.password;

    var UserController = require('./user_controller');
    UserController.autenticar(login, password, function (error, user) {
        if (error) {
            req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");
            return;
        }
        var now = Math.floor(new Date().getTime()/1000);
        req.session.last = now;
        req.session.user = {id: user.id, username: user.username};
        res.redirect(req.session.redir.toString());
    });
};

// DELETE /logout
exports.destroy = function (req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString());
};