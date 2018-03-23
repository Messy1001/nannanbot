const helper = require('../helpers.js');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

module.exports = {
    name: 'tdbanner',
    description: 'Shows information about a TD Gacha banner.',
    usage: "<id>",
    execute(message, args) {
    	

        helper.data.readSpreadsheet("146vKsT5WoNeE4fO68kGNpng1KnqnBYjENe_rZpHSVvc", "cards", "CardList!A:Z");

        var cards = []

        const fs = require('fs');
        
        let rawdata = fs.readFileSync('./cards.json');  
        let obj = JSON.parse(rawdata);  

        var query = message.content;
        query = query.toLowerCase()
        query = query.replace(prefix+this.name+" ", "");       


        var arr = []
        arr = obj;
        var filarr = []
        
        
        
        
        
        
        
        for (let id in obj['objects'])
        {
            if (obj['objects'][id]['Start Date'] != 'undefined')
               filarr.push(obj['objects'][id])
        }

        filarr.sort(function(a, b) {
        var dateA = new Date(a['Release Date']), dateB = new Date(b['Release Date']);
        return dateA - dateB;
        });

        var digit = filarr.length;
        if (args.length)
          digit = args[0]
        if (digit > filarr.length)
        {
          return message.reply(`Please enter a valid ID (1 - ${filarr.length})`)
        }
        
       
        
        var bannercardslim = []
        for (let id in obj['objects'])
        {                    
          if (obj['objects'][id]['Release Date'] === filarr[digit-1]['Start Date'] &&  obj['objects'][id]['Availability'] == "Limited")
            bannercardslim.push(obj['objects'][id])
        }
        
        var bannercardsperm = []
        for (let id in obj['objects'])
        {
          if (obj['objects'][id]['Release Date'] === filarr[digit-1]['Start Date']  && obj['objects'][id]['Availability'] == "Permanent")
            bannercardsperm.push(obj['objects'][id])
        }
        
        var bannercardsfes = []
        for (let id in obj['objects'])
        {
          if (obj['objects'][id]['Release Date'] === filarr[digit-1]['Start Date']  && obj['objects'][id]['Availability'] == "Millifes")
            bannercardsfes.push(obj['objects'][id])
        }
        
        var str = ""
        if(bannercardslim.length)
        {
          str += "\n**Limited: **\n"
          for(let i=0;i<bannercardslim.length;i++)
          {
              str+= `▪️ [${bannercardslim[i]['Rarity']}] "${bannercardslim[i]['Title']}" **${bannercardslim[i]['Name']}**\n`
          }  
        }
        if(bannercardsperm.length)
        {
          str += "\n**Permanent: **\n"
          for(let i=0;i<bannercardsperm.length;i++)
          {
              str+= `▪️ [${bannercardsperm[i]['Rarity']}] "${bannercardsperm[i]['Title']}" **${bannercardsperm[i]['Name']}**\n`
          }  
        }
        if(bannercardsfes.length)
        {
          str += "\n**Millifes: **\n"
          for(let i=0;i<bannercardsfes.length;i++)
          {
              str+= `▪️ [${bannercardsfes[i]['Rarity']}] "${bannercardsfes[i]['Title']}" **${bannercardsfes[i]['Name']}**\n`
          }  
        }
        var remaining
        if (digit == filarr.length)
        {
        var event = new Date()
       
        event = event.toLocaleString('zh-cn', { timeZone: 'Asia/Tokyo' });
        event = event.replace(/-/g, "/", 1);
        console.log("Time: "+event);        
        event = new Date(event)
        
        var testdate = new Date(filarr[digit-1]['End Date'] + " 15:00:00")      
        remaining = " - "+ Math.abs(Math.trunc((event.getTime() - testdate.getTime()) / 1000/60/60)) + "Hours left";
                console.log("time difference" + ((event.getTime() - testdate.getTime())  / 1000/60/60))

        }
        else
        {
        remaining = ""
        }
                
        const embed = new Discord.RichEmbed()

            .setColor("#b5b1e1")
            .setFooter("Based on the same function by Donuts (Z-ON#6884)")
            .setImage("http://imas.gamedbs.jp/mlth/image/card/info/"+filarr[digit-1]['Banner Filename']+".png")
            .addField(filarr[digit-1]['Banner'] + remaining, `${filarr[digit-1]['Start Date']} 15:00:00 JST - ${filarr[digit-1]['End Date']} 14:59:59 JST \n ${str}`)
            
            message.channel.send(embed);
        
        
       
    },
};