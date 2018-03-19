module.exports = {
    name: 'serverinfo',
    description: 'Serverinfo',
    execute(message, args) {
         message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    },
};