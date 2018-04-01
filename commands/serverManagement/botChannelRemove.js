const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Servers = sequelize.import('../..//models/Servers');
const BotChannels = sequelize.import('../../models/BotChannels');
module.exports = {
    name: 'botchannelremove',
    description: 'Removes a bot channel!',
    adminOnly: true,
    permissions: 'ADMINISTRATOR',
    execute(message, args) {
        try {

            let channelid;
            console.log("args:"+args)
            if (!args.length)
                channelid = message.channel.id
            else if (args.length === 1)
                channelid = args[0]

             BotChannels.destroy({
                where: {
                    botchannel_id: channelid
                }
            })
            message.reply(`Server ${message.guild.name}.\n Channel ${message.guild.channels.get(channelid)} unassigned as bot channel.`);
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That server is already added to the DB.');
            }
            console.log(e)
            return message.reply('Something went wrong with adding a tag.');
}

       },
};