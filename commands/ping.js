const helper = require('../helpers.js');

module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
    	console.log(helper)
    	helper.data.saveIcon(args[0])
    	message.guild.setIcon("./images/icon.png")
       //message.channel.send('Pong.');
       
    },
};