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
    name: 'defaultchannelname',
    description: 'Adds a channel to be renamed for birthdays!',
    adminOnly: true,
    permissions: 'ADMINISTRATOR',
    execute(message, args) {
        try {

            let channelid;
            let defName
            if (args.length == 1)
            {
                channelid = message.channel.id
                defName = args[0].trim()
            }
            else if (args.length == 2)
            {
                channelid = args[0].trim()
                defName = args[1].trim()
            }
            console.log("args:"+args)
           
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
                
                
                RenameChannels.update(
                  { default_name: defName },
                  { where: { renamechannel_id: channelid } }
                )
                
            });
            })

            message.reply(`Channel ${message.guild.channels.get(channelid)} default name: ${defName} added`);
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