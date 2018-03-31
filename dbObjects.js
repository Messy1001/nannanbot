const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.database.sqlite',
});

const Servers = sequelize.import('models/Servers');
const BotChannels = sequelize.import('models/BotChannels');
const Servers_BotChannels = sequelize.import('models/Servers_BotChannels');


Servers.prototype.addBotChannel = async function(botchannel) {
    const servers_botchannels = await Servers_BotChannels.findOne({
        where: { server_id: this.server_id, botchannel_id: botchannel },
    });

    if (servers_botchannels) {
        return servers_botchannels.save();
    }

    return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
};

Servers.prototype.getBotChannels = function() {
    return Servers_BotChannels.findAll({
        where: { server_id: this.server_id },
        include: ['botchannel'],
    });
};

module.exports = { Servers, BotChannels, Servers_BotChannels };