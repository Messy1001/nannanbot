module.exports = (sequelize, DataTypes) => {
    return sequelize.define('renamechannels', {
        renamechannel_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        server_id: {
            type: DataTypes.STRING,
        },
        default_name: {
            type: DataTypes.STRING,
        },
    }, {
        timestamps: false,
    });
};