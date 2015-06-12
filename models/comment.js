module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        'Comment',
        {
            texto: {
                type: DataTypes.STRING,
                validate: {notEmpty: {msg: 'No puede estar vacío el comentario'}}
            },
            publicado: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }
    );
}