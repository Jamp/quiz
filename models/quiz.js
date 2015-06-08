
// Definicióm del modelo quiz
module.exports = function (sequelize, Datatypes) {
    return sequelize.define('Quiz', {
        pregunta:  {
            type: Datatypes.STRING,
            validate: { notEmpty: {msg: 'No puede guardar una pregunta vacía'} }
        },
        respuesta: {
            type: Datatypes.STRING,
            validate: { notEmpty: {msg: 'No puede guardar una respuesta vacía'} }
        }
    });
};