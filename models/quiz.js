
// Definicióm del modelo quiz
module.exports = function (sequelize, Datatypes) {
    return sequelize.define('Quiz', {
        pregunta:  {
            type: Datatypes.STRING,
            validate: { notEmpty: {msg: 'La pregunta no puede estar vacía'} }
        },
        respuesta: {
            type: Datatypes.STRING,
            validate: { notEmpty: {msg: 'La respuesta no puede estar vacía'} }
        }
    });
};