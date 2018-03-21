const Discord = require('discord.js');
const helper = require('../helpers.js');



module.exports = {
    args: true,
    name: 'readsheet',
    description: 'Returns a google spreadsheet\'s values',
    execute(message, args) {
       
         let privatekey = require("../privatekey.json");


var googleapis = require('googleapis');
var googleAuth = require('google-auth-library');
var fs = require('fs');
var cards = [];
var desc = [];

(function(){
"use strict";

// Load client secrets from a local file.
fs.readFile('privatekey.json', function processClientSecrets(err, content) {
if (err) {
console.log('Error loading client secret file: ' + err);
return;
}

// Authorize a client with the loaded credentials, then call the
// Drive API.
authorize(JSON.parse(content));
});

var authorize = function(credentials) {
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2();
var jwt = new googleapis.auth.JWT(
credentials.client_email,
null,
credentials.private_key,
['https://www.googleapis.com/auth/spreadsheets']);
jwt.authorize(function(err, result) {
	
  console.log(result.access_token)
  console.log(oauth2Client.credentials.access_token)
  oauth2Client.credentials.access_token = result.access_token;
  console.log(oauth2Client.credentials.access_token);

var service = googleapis.sheets('v4');
service.spreadsheets.values.get({
   auth: oauth2Client,
   spreadsheetId: args[0],
   range: 'A1:Z'
}, function (err, response) {
   if (err) {
       console.log('The API returned an error: ' + err);
   } else {
       console.log(response.values);
       desc = response.values[0];
       response.values.shift();
       helper.data.queryToJSON(desc, response.values, "cards");  
       console.log("Desc: "+ desc[3])
       for (let row of response.values) {
       	   console.log('%s, %s', row[0], row[1]);
       	   for (let i = 0; i < row.length;i++)
           {
           		if (row[i].toLowerCase().startsWith(args[1].toLowerCase()))
           		  cards.push(row);
           		

           }
          

       }
   }
    
    if (cards.length)
    {
  	let str = "";
  	let cardnumber = args[args.length-1];
  	if (args[args.length-1] === undefined || args[args.length-1] > cards.length-1 || args[args.length-1] < 0 || isNaN(args[args.length-1]))
  		cardnumber = 0;
    for (let i=0; i < desc.length;i++)
    {
	 	const embed = new Discord.RichEmbed()
	 	let desctemp = desc[i]
	 	let cardtemp = cards[cardnumber][i]

	 	if (desctemp === undefined)
	 		desctemp = "";
	 	if (cardtemp === undefined)
	 		cardtemp = "";
	 	if (cardtemp != "" && desctemp !="")
	 		{
	 			str += "**"+desctemp+":** " + cardtemp+ "\n";
	 		}
	 			  	
    }
	const embed = new Discord.RichEmbed()
	.setDescription(str);
    message.channel.send(embed);
	}
    else
    {
    	message.channel.send("No results found for this request!");
    }
});


});

};
})();
    },
};