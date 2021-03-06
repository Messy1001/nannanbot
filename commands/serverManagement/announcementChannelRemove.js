const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Servers = sequelize.import('../..//models/Servers');
const RenameChannels = sequelize.import('../../models/RenameChannels');
module.exports = {
    name: 'announcementchannelremove',
    description: 'Removes a channel where announcements are posted!',
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
            console.log("cid:"+channelid)
            let server = Servers.findOrCreate({
                where: {
                    server_id: message.guild.id
                },
                defaults: {
                    server_id: message.guild.id,
                }
            }).then(function(result) {
                let created = result[1]

                if(!created)
                    console.log("Server is already in the DB")

           }).then(function() {
                Servers.update(
                  { announcement_channel: null},
                  { where: { server_id: message.guild.id } }
                )
            })
            message.reply(`Server ${message.guild.name} .\n Channel ${message.guild.channels.get(channelid)} removed as announcementchannel`);
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