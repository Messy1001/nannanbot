module.exports = {
    name: 'credits',
    description: 'List all contributors to this project. Without their help this could never have happened.!',
    execute(message, args) {
    	
        message.channel.send(```Special thanks to everyone contributing to this project!\n Direct contributions to the bot project:\n - Wasser \n - Lybra \n - Z-ON (Donuts)\n - El\n - Rush \n\n Help updating the seiyuu spreadsheet: \n - Hinsvar\n - Huild\n - Negligience \n - Kido\n - Nashi\n - frdruru \n - mitsuba_to```);
       
    },
};