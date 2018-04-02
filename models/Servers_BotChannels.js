module.exports = (sequelize, DataTypes) => {
    return sequelize.define('servers_botchannels', {
        server_id: DataTypes.STRING,
        botchannel_id: DataTypes.STRING,
       
    }, {
        timestamps: false,
    });
};