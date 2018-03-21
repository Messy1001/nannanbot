const helper = require('../helpers.js');

module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
    	console.log(helper)

       //message.channel.send('Pong.');
        //var obj = require("../thing.json");
        
        console.log("\n *START* \n");
        const fs = require('fs');

		let rawdata = fs.readFileSync('./test.json');  
		let obj = JSON.parse(rawdata);  
        console.log(obj['objects'][1]['Seiyuu Name']);
        //helper.data.readSpreadsheet("1C-DamOHRSZQvhhAow458luQ43ohnHs6kETyP7dMTBbA", "test");
    },
};