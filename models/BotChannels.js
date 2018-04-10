module.exports = (sequelize, DataTypes) => {
    return sequelize.define('botchannels', {
        botchannel_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        server_id: {
            type: DataTypes.STRING,
        },
        running_quiz: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: false,
    });
};