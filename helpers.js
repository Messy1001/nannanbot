	var methods = {

		

		saveImage: function saveIcon(url, filename){

			function download(uri, filename, callback){
			const request = require('request')
			const fs = require('fs')
			request.head(uri, function(err, res, body){
		    console.log('content-type:', res.headers['content-type']);
		    console.log('content-length:', res.headers['content-length']);

		    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		  	});
			};

			download(url, './images/'+filename+'icon.png', function(){
			console.log('done');
			});
		},
	    	

			

		secondsToString: function secondsToString(seconds)

		{

			var numdays = Math.floor(seconds / 86400);

			var numhours = Math.floor((seconds % 86400) / 3600);

			var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);

			var day
			var hour
			var min

			if(numdays == 1)
				day = "day"
			else
				day = "days"
			if(numhours == 1)
				hour = "hour"
			else
				hour = "hours"
			if(numminutes == 1)
				min = "minute"
			else
				min = "minutes"

			return numdays + " "+day+" "+numhours+ " "+hour+" "+numminutes+" "+min;

		},

		getRandomInt: function getRandomInt(min, max) {
    		return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		queryToJSON: function queryToJSON(descriptions, rows, filename) {
						var str = "{\n\"objects\":[\n";
						for (let i = 0; i < rows.length; i++)		
						{
							str += "{\"ID\" : " + i + ","; 
							for (let j=0; j < descriptions.length; j++)
							{
								str += "\""+descriptions[j]+"\"" + ":" + "\""+rows[i][j]+"\""
								if (j != descriptions.length -1)
									str += ","
							}
							if (i != rows.length -1)
								str += "},\n"
							else
								str += "}\n"
						}

						str += "]}"

						var fs = require('fs');
						fs.writeFile(filename+".json", str);
		},

	readSpreadsheet : function readSpreadsheet(spreadsheet, filename, range) {
		let privatekey = require("./privatekey.json");
		var googleapis = require('googleapis');
		var googleAuth = require('google-auth-library');
		var fs = require('fs');
		var cards = [];
		var desc = [];

			const helper = require('./helpers.js');


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
			
		  oauth2Client.credentials.access_token = result.access_token;

		var service = googleapis.sheets('v4');
		service.spreadsheets.values.get({
		   auth: oauth2Client,
		   spreadsheetId: spreadsheet,
		   range: range
		}, function (err, response) {
		   if (err) {
		       console.log('The API returned an error: ' + err);
		   } else {
		       desc = response.values[0];
		       response.values.shift();
		       helper.data.queryToJSON(desc, response.values, filename);  
		   }
		    
		   
		});

		});
    
		};

		
		})();

	}
};

exports.data = methods;

