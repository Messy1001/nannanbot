const helper = require('../helpers.js');

module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
    	console.log(helper)
      
      

       message.channel.send('Pong.');
       
    },
};