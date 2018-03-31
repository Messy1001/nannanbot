module.exports = (sequelize, DataTypes) => {
    return sequelize.define('servers', {
        server_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        announcement_channel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        announcement_type: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rename_channel: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
    }, {
        timestamps: false,
    });
};

