const helper = require('../helpers.js');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');


module.exports = {
    name: 'seiyuufact',
    description: 'Returns random trivia about an Idolm@ster Seiyuu!',
    usage: "<name> <franchise>",
    aliases: ['sf', 'fact', 'funfact', 'cvfact', 'vafact'],
    cooldown: 5,
    execute(message, args) {
      const fs = require('fs');
      let rawdata
      let obj
      
        
      
    	helper.data.readSpreadsheet("1mFTCIxa-FlRAWT70M7lC82bx-HRvDm_lovUJLL4FlN8", "seiyuu", "SeiyuuInfo!A:Z")
        rawdata = fs.readFileSync('./seiyuu.json');
        obj = JSON.parse(rawdata) 
      

    	

        

        let facts = []
        let arr = []

        var franchise
        var query = message.content;
        query = query.toLowerCase()
        query = query.replace(prefix, "");
        query = query.substring(query.indexOf(" ") + 1);
        query = query.trim()


         var re = /( )?\ba(l(l)?(l)?)?( )?s(tars)?\b( )?/
        var as = query.search(re);
        if (as != -1)
        {
            franchise = "Allstars"
            query = query.replace(re, "");
        }

        var re = /( )?\bm(il(l)?(l)?ion)?( )?l(ive)?\b( )?/
        var ml = query.search(re);
        if (ml != -1)
        {
            franchise = "Million Live"
            query = query.replace(re, "");
        }

        var re = /( )?\bc(indere(l)?la)?( )?g(irls)?\b( )?/
        var cg = query.search(re);
        if (cg != -1)
        {
            franchise = "Cinderella Girls"
            query = query.replace(re, "");
        }

        var re = /( )?\bs(hiny)?( )?c(olo(u)?rs)?( )?\b/
        var sc = query.search(re);
        if (sc != -1)
        {
            franchise = "Shiny Colors"
            query = query.replace(re, "");
        }

        var re = /( )?s(ide)?( )?m( )?/
        var sm = query.search(re);
        if (sm != -1)
        {
            franchise = "SideM"
            query = query.replace(re, "");
        }

        for (var ID in obj['objects'])
        {	
        	if (obj['objects'][ID]['Fun Facts'].search("-") == -1 && obj['objects'][ID]['Fun Facts'] !== 'undefined' )	
        		arr.push(obj['objects'][ID])
        }
      
        if (!arr.length)
        	return console.log("Error")
        console.log(arr.length)
        let seiyuudigit;
        var arrtemp = arr;
        console.log("Q: " +query)
        if (!args.length)
        {
        }
        else
        {
        	arr = []
        	for (var id in arrtemp)
        	{
        		var splitQuery = arrtemp[id]['Seiyuu Name'].split(" ");
            
	            if (splitQuery[1] == undefined || splitQuery[1] == null)
	                splitQuery[1] = splitQuery[0];
	                        
	            if (query.split(" ").length == 1)
	            {
	                
	                if (splitQuery[0].toLowerCase().indexOf(query) !== -1 || splitQuery[1].toLowerCase().indexOf(query) !== -1 )
	                {
	                  arr.push(arrtemp[id]);
	                }
	                
	                splitQuery = arrtemp[id]['Character'].split(" ");
	                if (splitQuery[1] == undefined || splitQuery[1] == null)
	                  splitQuery[1] = splitQuery[0];
	                
	                
	                if (splitQuery[0].toLowerCase().indexOf(query) !== -1 || splitQuery[1].toLowerCase().indexOf(query) !== -1 )
	                {
	                  arr.push(arrtemp[id]);
	                }
	            }
	            else 
	            {
	                              
	              if (query.split(" ")[0] === splitQuery[0].toLowerCase()  || query.split(" ")[0] === splitQuery[1].toLowerCase() && query.split(" ")[1] === splitQuery[0].toLowerCase()  || query.split(" ")[1] === splitQuery[1].toLowerCase()  ) 
	                {
	                    if (query.split(" ")[0]+" "+query.split(" ")[1] === arrtemp[id]['Seiyuu Name'].toLowerCase() || query.split(" ")[1]+" "+query.split(" ")[0] === arrtemp[id]['Seiyuu Name'].toLowerCase())
	                    arr.push(arrtemp[id]);
	                }
	              
	                splitQuery = arrtemp[id]['Character'].split(" ");
	                if (splitQuery[1] == undefined || splitQuery[1] == null)
	                  splitQuery[1] = splitQuery[0];
	                                
	                if (query.split(" ")[0] === splitQuery[0].toLowerCase()  || query.split(" ")[0] === splitQuery[1].toLowerCase() && query.split(" ")[1] === splitQuery[0].toLowerCase()  || query.split(" ")[1] === splitQuery[1].toLowerCase()  ) 
	                {
	                    if (query.split(" ")[0]+" "+query.split(" ")[1] === arrtemp[id]['Character'].toLowerCase() || query.split(" ")[1]+" "+query.split(" ")[0] === arrtemp[id]['Character'].toLowerCase())
	                    arr.push(arrtemp[id]);
	                }              
	                
	            }
	            splitQuery = arrtemp[id]['Nickname'].replace(" ", "").replace(/( )?\*/, "").split("/")
	            
	            if(query.split(" ").length ==1 && !arr.length)
	            {
	              for (var i=0; i < splitQuery.length;i++)
	              {
	                if(splitQuery[i].toLowerCase().trim() == query.trim())
	                  arr.push(arrtemp[id]);
	              }
	            }
	        	}
        }

        var arrfiltered = []

        if (franchise != null)
        {
            for (var id in arr)
            {
                if (arr[id]['Franchise'] == franchise)
                    arrfiltered.push(arr[id])
            }
        }
        else
            arrfiltered = arr

    	seiyuudigit = helper.data.getRandomInt(0, arrfiltered.length-1)

    	console.log(arrfiltered)

        if (arrfiltered[seiyuudigit]['Fun Facts'] != undefined)
        	facts = arrfiltered[seiyuudigit]['Fun Facts'].split("|")

        var factdigit = helper.data.getRandomInt(0, facts.length-1)
        var poss = ""
        if (facts[factdigit].search(/( )?\§/) != -1)
        {
        	poss = "'s"
        	facts[factdigit] = facts[factdigit].replace(/( )?\§/, "")
        }


        if(facts[factdigit] === 'undefined')
        	return message.reply("There are no facts available yet which match your query! Please check for typos, try again at a later time or submit facts to <@155038103281729536>!")
      	return message.reply("Did you know that **" +arrfiltered[seiyuudigit]['Seiyuu Name']+poss+"** ("+arrfiltered[seiyuudigit]['Character']+") " +facts[helper.data.getRandomInt(0, facts.length-1)].trim()+"?")
       
    },
};