const helper = require('../helpers.js');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

module.exports = {
    name: 'seiyuuinfo',
    description: 'Retrieves basic information aboaut an imas Seiyuu',
    aliases: ['seiyuu', 'si', 'va', 'cv'],
    usage: "<name><optional: id>",
    cooldown: 10,
    execute(message, args) {
        console.log(helper)

        helper.data.readSpreadsheet("1mFTCIxa-FlRAWT70M7lC82bx-HRvDm_lovUJLL4FlN8", "seiyuu", "SeiyuuInfo!A:Z");

        var seiyuu = []
        var digit = 0
        var birthday = ""
        var query = message.content;
      
        query = query.toLowerCase()
        query = query.replace(prefix, "");
        query = query.substring(query.indexOf(" ") + 1);
        query = query.trim()
        console.log(query)
      
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
        
        var event = new Date()
        event = event.toLocaleString('zh-cn', { timeZone: 'Asia/Tokyo' });
        event = event.replace(/-/g, "/", 1);
              
        event = new Date(event)
        let date = event.getDate() +" "+month[event.getMonth()]
        
        var re = /( )?\d(.)?( )?\b/
        digit = parseInt(query.match(re));
        
        if (digit == null || isNaN(digit))
        {
            digit = 0;
        }
        else
        {
            query = query.replace(re, "");
        }
        

        const fs = require('fs');

        let rawdata = fs.readFileSync('./seiyuu.json');  
        let obj = JSON.parse(rawdata);  

        
        for (var ID in obj['objects'])
        {
        var splitQuery = obj['objects'][ID]['Seiyuu Name'].split(" ");
            
            if (splitQuery[1] == undefined || splitQuery[1] == null)
                splitQuery[1] = splitQuery[0];
                        
            if (query.split(" ").length == 1)
            {
                
                if (splitQuery[0].toLowerCase().indexOf(query) !== -1 || splitQuery[1].toLowerCase().indexOf(query) !== -1 )
                {
                  seiyuu.push(obj['objects'][ID]);
                }
                
                splitQuery = obj['objects'][ID]['Character'].split(" ");
                if (splitQuery[1] == undefined || splitQuery[1] == null)
                  splitQuery[1] = splitQuery[0];
                
                
                if (splitQuery[0].toLowerCase().indexOf(query) !== -1 || splitQuery[1].toLowerCase().indexOf(query) !== -1 )
                {
                  seiyuu.push(obj['objects'][ID]);
                }
            }
            else 
            {
                              
              if (query.split(" ")[0] === splitQuery[0].toLowerCase()  || query.split(" ")[0] === splitQuery[1].toLowerCase() && query.split(" ")[1] === splitQuery[0].toLowerCase()  || query.split(" ")[1] === splitQuery[1].toLowerCase()  ) 
                {
                    if (query.split(" ")[0]+" "+query.split(" ")[1] === obj['objects'][ID]['Seiyuu Name'].toLowerCase() || query.split(" ")[1]+" "+query.split(" ")[0] === obj['objects'][ID]['Seiyuu Name'].toLowerCase())
                    seiyuu.push(obj['objects'][ID]);
                }
              
                splitQuery = obj['objects'][ID]['Character'].split(" ");
                if (splitQuery[1] == undefined || splitQuery[1] == null)
                  splitQuery[1] = splitQuery[0];
                                
                if (query.split(" ")[0] === splitQuery[0].toLowerCase()  || query.split(" ")[0] === splitQuery[1].toLowerCase() && query.split(" ")[1] === splitQuery[0].toLowerCase()  || query.split(" ")[1] === splitQuery[1].toLowerCase()  ) 
                {
                    if (query.split(" ")[0]+" "+query.split(" ")[1] === obj['objects'][ID]['Character'].toLowerCase() || query.split(" ")[1]+" "+query.split(" ")[0] === obj['objects'][ID]['Character'].toLowerCase())
                    seiyuu.push(obj['objects'][ID]);
                }              
                
            }
            splitQuery = obj['objects'][ID]['Nickname'].replace(" ", "").replace(/( )?\*/, "").split("/")
            
            if(query.split(" ").length ==1 && !seiyuu.length)
            {
              for (var i=0; i < splitQuery.length;i++)
              {
                if(splitQuery[i].toLowerCase().trim() == query.trim())
                  seiyuu.push(obj['objects'][ID]);
              }
            }
            
          }
            if (digit > seiyuu.length-1)
              digit = 0;
  
        
        var color = seiyuu[digit]['Image Color'] 
        if (color === "TBA")
            color = "#b5b1e1"
        var image
        if (seiyuu[digit]['MAL Image'] != "-")
          image = "https://myanimelist.cdn-dena.com/images/voiceactors/"+seiyuu[digit]['MAL Image']+".jpg"
        else 
          image = "https://abload.de/img/000000-0.0s3ssy.png"
        if (seiyuu[digit]['Other Image'] != "-")
          image = seiyuu[digit]['Other Image'] 
      
        var twitter = seiyuu[digit]['Twitter Account'].split("/")
        if ( twitter != "-")
          twitter = "@"+twitter[twitter.length-1]
        else
          twitter = "n/a"
        var blog = seiyuu[digit]['Blog']
        if( blog == "-")
          blog = "n/a"
      
        if(date == seiyuu[digit]['Birthday'])
          birthday  = " **🎉Today is their birthday**🎉"
      
        var mal 
         if (seiyuu[digit]['MAL Page'] != "-")
           mal = "[MAL](https://myanimelist.net/people/"+seiyuu[digit]['MAL Page']+")"
         else
           mal = "n/a"
        console.log("Agency: "+seiyuu[digit]['Agency'])
        var agency
        if (seiyuu[digit]['Agency'].match(/( )?-( )?/) == null && seiyuu[digit]['Agency'].toLowerCase().match(/( )?\bf\b( )?/) == null)
        {
          agency = seiyuu[digit]['Agency']
        }
        else if(seiyuu[digit]['Agency'].toLowerCase().match(/( )?\bf\b( )?/) != null)
          agency = "-"
        else
          agency = "n/a"
        
        const embed = new Discord.RichEmbed()

        .setColor(color)
        .setTitle(`${seiyuu[digit]['Seiyuu Name']} - ${seiyuu[digit]['Character']}`)
        .setImage(image)
        
        .addField("Nickname: ",`${seiyuu[digit]['Nickname'].replace(/( )?\*/,"")}`, true)
        .addField("Birthday: ",`${seiyuu[digit]['Birthday']}${birthday}`, true)
        .addField("Hometown:", `${seiyuu[digit]['Birthplace']}`)
        .addBlankField()
        .addField("Twitter :", "["+twitter+"]("+seiyuu[digit]['Twitter Account']+")",true)
        .addField("Blog :", "["+blog+"]("+seiyuu[digit]['Blog URL']+")",true)
        .addField("MAL :", mal,true)
        .addField("Agency :", "["+agency+"]("+seiyuu[digit]['Agency URL']+")",true)
        .setThumbnail("https://abload.de/img/tsumuoxu1s.png")
        
        .addBlankField()
        
        .setTimestamp()
        .setFooter("Special thanks to the people helping with this project: https://goo.gl/1UqDHd")
        

        message.channel.send(embed);
        
        if (seiyuu.length > 1)
        {
            var str = "";
            var count = 0;
            for (let id in seiyuu)
            {
                if (id != digit)
                {
                   str+= `**${seiyuu[id]["Seiyuu Name"]}** -  ${seiyuu[id]["Character"]} **${count}**\n`
                }
                count++
            }
                        
            const embed2 = new Discord.RichEmbed()

            .setColor("#b5b1e1")
            .addField("Other seiyuu who match this query: ", str)
            message.channel.send(embed2);

        }
                
        
       
    },
};