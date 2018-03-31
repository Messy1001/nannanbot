const helper = require('../helpers.js');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');


module.exports = {
    name: 'seiyuufact',
    description: 'Returns random trivia about an Idolm@ster Seiyuu!',
    usage: "<optional: name> <optional: franchise>",
    aliases: ['sf', 'fact', 'funfact', 'cvfact', 'vafact'],
    
    execute(message, args) {
      const fs = require('fs');
      let rawdata
      let obj
      var aliases = this.aliases
      var name = this.name
      var count = 0
      
        
      
    	helper.data.readSpreadsheet("1mFTCIxa-FlRAWT70M7lC82bx-HRvDm_lovUJLL4FlN8", "seiyuu", "SeiyuuInfo!A:Z")
        rawdata = fs.readFileSync('./seiyuu.json');
        obj = JSON.parse(rawdata) 
      

    	

        

        let facts = []
        let arr = []
        var nickarray = []

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
        	if (obj['objects'][ID]['Fun Facts'] !== "-" && obj['objects'][ID]['Fun Facts'] !== 'undefined' )	
        		arr.push(obj['objects'][ID])
        }
      
        if (!arr.length)
        	return console.log("Error")
      
        let randomquery = true
        var re = /( )?\b\d(\d)?\b( )?/
        let factdigit 
        
        if (query.match(re) == null)
        {
            factdigit = helper.data.getRandomInt(0, facts.length-1)
            
        }
        else
        {                        
            factdigit = parseInt(query.match(re)[0].trim())            
            query = query.replace(re, "");
            randomquery = false
        }
        
        let seiyuudigit;
        var arrtemp = arr;
        console.log("Q: " +query)
        query = query.trim()
        if (!args.length)
        {
        }
        else
        {
        	arr = []
        	for (var id in arrtemp)
        	{
        		var splitQuery = arrtemp[id]['Seiyuu Name'].split(" ");
              console.log("SQ: " +splitQuery)
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
	            splitQuery = arrtemp[id]['Nick Query'].replace(" ", "").replace(/( )?\*/, "").split("/")
	            
	            if(query.split(" ").length ==1)
	            {
	              for (var i=0; i < splitQuery.length;i++)
	              {
	                console.log("SQ" + splitQuery[i])
                  if(splitQuery[i].toLowerCase().trim() == query.trim())                  
	                  nickarray.push(arrtemp[id]);
	              }
	            }
	        	}
        }
       
        if (nickarray.length)
        {
          arr = []
          arr = nickarray
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
      console.log(arr)
      seiyuudigit = helper.data.getRandomInt(0, arrfiltered.length-1)
        
      console.log("FD"+factdigit)
      sendInfo(seiyuudigit)
     
    function sendInfo(digit) {
     	

    	if(!arrfiltered.length)
        	return message.reply("There are no facts available yet which match your query! Please check for typos, try again at a later time or submit facts to <@155038103281729536>!")
      
        if (arrfiltered[digit]['Fun Facts'] != undefined)
        	facts = arrfiltered[digit]['Fun Facts'].split("|")
        
        var poss = ""
        if (randomquery || factdigit > facts.length-1)
            factdigit = helper.data.getRandomInt(0, facts.length-1)
        
        if (facts[factdigit].search(/( )?\§/) != -1)
        {
        	poss = "'s"
        	facts[factdigit] = facts[factdigit].replace(/( )?\§/, "")
        }
      
        let displayedname
        if (arrfiltered[digit]['Artist Name'] == "-")
          displayedname = arrfiltered[digit]['Seiyuu Name']
        else
          displayedname = arrfiltered[digit]['Artist Name']
      	message.reply("Did you know that **" +displayedname+poss+"** ("+arrfiltered[digit]['Character']+") " +facts[factdigit].trim()+"?")
        if (arrfiltered.length > 1 && (query != this.name || !this.aliases.includes(query)))
        {
            var str = "";
            count = 1
            for (let id in arrfiltered)
            {
                if (id != digit)
                {
                   str+= `**${arrfiltered[id]["Seiyuu Name"]}** (${arrfiltered[id]["Character"]}) [${arrfiltered[id]["Franchise"]}] **${count}** \n`
                   count ++
                }
                
            }
            if (query != name && !aliases.includes(query) && query !== "")
            {
            const embed2 = new Discord.RichEmbed()

            embed2.setColor("#b5b1e1")
            embed2.addField("Other seiyuu who match this query: ", str)
            message.channel.send(embed2);
            }

        }
     }
        console.log("Q:"+query)
        if (query !== this.name && this.aliases.includes(query) == false)
        {
        const filter = m =>m.author.id === message.author.id
        var collector
        if (collector == null)
            collector = message.channel.createMessageCollector(filter, { time: 30000 });

        collector.on('collect', m => {
            console.log("Message: "+m)
            if (m.content.match(/^(\d)+/) != null && m < arrfiltered.length && m>0)
            {
                arrfiltered = helper.data.sortArray(arrfiltered, seiyuudigit)
                seiyuudigit = m-1     
                sendInfo(seiyuudigit)
            }
            else if (m.content.match(/^(\d)+/) != null && (m >= arrfiltered.length || m < 1))
                message.reply("Please enter a valid number for this request! (0 - "+(count-1)+")")
            else
                collector.stop()
        })

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        })        
        }
       
    },
};