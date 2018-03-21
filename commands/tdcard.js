const helper = require('../helpers.js');

module.exports = {
    args: true,
    name: 'tdcard',
    description: 'Returns a Theater Days card.',
    execute(message, args) {
    	
        console.log("\n *START* \n");
        const fs = require('fs');

		let rawdata = fs.readFileSync('./cards.json');  
		let obj = JSON.parse(rawdata);  
        console.log(obj['objects'][1].Name);
    },
};