
// Definicióm del modelo quiz
module.exports = function (sequelize, Datatypes) {
    return sequelize.define('Quiz', {
        pregunta:  Datatypes.STRING,
        respuesta: Datatypes.STRING
    });
};