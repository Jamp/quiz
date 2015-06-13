var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

app.use(function (req, res, next){
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    res.locals.session = req.session;
    next();
});

// Middleware para auto-logout de sesiones
// todo los cambios los determinamos en segundos
app.use(function (req, res, next) {

    // Verificamos que haya un sesión activa
    if (req.session.user) {
        // Determinamos los 120 segundo(2min) de la sesión
        var tiempo = 120;
        var now = Math.floor(new Date().getTime()/1000);
        var last = req.session.user.last;

        // Si el tiempo a transcurrido, se destruye la sesión y redirecciona a login su
        // respectivo de mensaje
        if ((now-last) >= tiempo) {
            delete req.session.user;
            res.render('session/new', {errors: [{message: "Sesión cerrada por inactividad"}]});
            return;
        } else {
            // Si todavía hay tiempo actualizamos la hora de última operación
            req.session.last = now;
        }
    }

    next();
});


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
