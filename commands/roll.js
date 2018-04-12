const { prefix, token } = require('../config.json');
const currencyHelper = require('../currencyHelpers.js');
const helper = require('../helpers.js');


module.exports = {
    name: 'roll',
    description: 'Rolls a six sided die',
    cooldown: 5,
    execute(message, args) {
       
    	message.reply(`You rolled a ${helper.data.getRandomInt(0, 6)}`);

    },
};