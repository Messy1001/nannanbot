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
    name: 'renamechanneladd',
    description: 'Adds a channel to be renamed for birthdays!',
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

             let renamechannel = RenameChannels.findOrCreate({
                where: {
                    renamechannel_id: channelid
                },
                defaults: {
                    server_id: message.guild.id,
                    renamechannel_id:channelid
                }
            }).then(function(result) {
                let created = result[1]

                if(!created)
                    console.log("Channel is already in the DB")
                  Servers.update(
                  { rename_channel: 1 },
                  { where: { server_id: message.guild.id } }
                )
                
            });
            })

            message.reply(`Server ${message.guild.name} added.\n Channel ${message.guild.channels.get(channelid)} added`);
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