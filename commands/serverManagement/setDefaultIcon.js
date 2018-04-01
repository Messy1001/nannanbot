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
    name: 'setdefaulticon',
    adminOnly: true,
    permissions: 'ADMINISTRATOR',
    description: 'Adds a default icon to a server!',
    execute(message, args) {
        try {
            let icon = ""
            icon = args[0]
            console.log("args:"+args)
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
                  { default_icon: icon },
                  { where: { server_id: message.guild.id } }
                )
            })
            message.reply(`Added: ${icon} for Server ${message.guild.name}.\n`);
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