const helper = require('../helpers.js');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

module.exports = {
    name: 'seiyuuinfo',
    description: 'Retrieves basic information about an idolm@ster seiyuu',
    aliases: ['seiyuu', 'si', 'va', 'cv'],
    usage: "<optional: name><optional: id>",
    cooldown: 10,
    execute(message, args) {
        console.log(helper)

        helper.data.readSpreadsheet("1mFTCIxa-FlRAWT70M7lC82bx-HRvDm_lovUJLL4FlN8", "seiyuu", "SeiyuuInfo!A:Z");

        let seiyuu = []
        let digit = 0
        let birthday = ""
        let query = message.content;
        let franchise
        let count = 0;
      
        query = query.toLowerCase()
        query = query.replace(prefix, "");
        query = query.substring(query.indexOf(" ") + 1);
        query = query.trim()
        
        if(!args.length)
          query = ""
          
       
      
        let month = new Array();
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
        
        let event = new Date()
        event = event.toLocaleString('zh-cn', { timeZone: 'Asia/Tokyo' });
        event = event.replace(/-/g, "/", 1);
              
        event = new Date(event)
        let date = event.getDate() +" "+month[event.getMonth()]
        
        let re = /\b[^\-]\d(\d)?(?!\-)\b/
        digit = parseInt(query.match(re));
        
        if (digit == null || isNaN(digit))
        {
            digit = 0;
        }
        else
        {
            query = query.replace(re, "");
        }
        console.log("digit"+digit)
        re = /( )?\ba(l(l)?(l)?)?( )?s(tars)?\b( )?/
        let as = query.search(re);
        if (as != -1)
        {
            franchise = "Allstars"
            query = query.replace(re, "");
        }

        re = /( )?\bm(il(l)?(l)?ion)?( )?l(ive)?\b( )?/
        let ml = query.search(re);
        if (ml != -1)
        {
            franchise = "Million Live"
            query = query.replace(re, "");
        }

        re = /( )?\bc(indere(l)?la)?( )?g(irls)?\b( )?/
        let cg = query.search(re);
        if (cg != -1)
        {
            franchise = "Cinderella Girls"
            query = query.replace(re, "");
        }

        re = /( )?\bs(hiny)?( )?c(olo(u)?rs)?( )?\b/
        let sc = query.search(re);
        if (sc != -1)
        {
            franchise = "Shiny Colors"
            query = query.replace(re, "");
        }

        re = /( )?s(ide)?( )?m( )?/
        let sm = query.search(re);
        if (sm != -1)
        {
            franchise = "SideM"
            query = query.replace(re, "");
        }
        
        console.log(query)
        const fs = require('fs');

        let rawdata = fs.readFileSync('./seiyuu.json');  
        let obj = JSON.parse(rawdata);  

        let digitarray = []

        query = query.trim()
        for (let ID in obj['objects'])
        {
        let splitQuery = obj['objects'][ID]['Seiyuu Name'].split(" ");
            
            if (splitQuery[1] == undefined || splitQuery[1] == null)
                splitQuery[1] = splitQuery[0];
                        
            if (query.split(" ").length == 1)
            {
                
                if (!digitarray.includes(ID) && (splitQuery[0].toLowerCase().indexOf(query) !== -1 || splitQuery[1].toLowerCase().indexOf(query) !== -1 ))
                {
                  seiyuu.push(obj['objects'][ID]);
                  digitarray.push(ID)
                }
                
                splitQuery = obj['objects'][ID]['Character'].split(" ");
                if (splitQuery[1] == undefined || splitQuery[1] == null)
                  splitQuery[1] = splitQuery[0];
                
                
                if (!digitarray.includes(ID) && (splitQuery[0].toLowerCase().indexOf(query) !== -1 || splitQuery[1].toLowerCase().indexOf(query) !== -1 ))
                {
                  seiyuu.push(obj['objects'][ID]);
                  digitarray.push(ID)
                }
            }
            else 
            {
                              
              if (query.split(" ")[0] === splitQuery[0].toLowerCase()  || query.split(" ")[0] === splitQuery[1].toLowerCase() && query.split(" ")[1] === splitQuery[0].toLowerCase()  || query.split(" ")[1] === splitQuery[1].toLowerCase()  ) 
                {
                    if (!digitarray.includes(ID) && (query.split(" ")[0]+" "+query.split(" ")[1] === obj['objects'][ID]['Seiyuu Name'].toLowerCase() || query.split(" ")[1]+" "+query.split(" ")[0] === obj['objects'][ID]['Seiyuu Name'].toLowerCase()))
                    seiyuu.push(obj['objects'][ID]);
                    digitarray.push(ID)
                }
              
                splitQuery = obj['objects'][ID]['Character'].split(" ");
                if (splitQuery[1] == undefined || splitQuery[1] == null)
                  splitQuery[1] = splitQuery[0];
                                
                if (query.split(" ")[0] === splitQuery[0].toLowerCase()  || query.split(" ")[0] === splitQuery[1].toLowerCase() && query.split(" ")[1] === splitQuery[0].toLowerCase()  || query.split(" ")[1] === splitQuery[1].toLowerCase()  ) 
                {
                    if (!digitarray.includes(ID) && (query.split(" ")[0]+" "+query.split(" ")[1] === obj['objects'][ID]['Character'].toLowerCase() || query.split(" ")[1]+" "+query.split(" ")[0] === obj['objects'][ID]['Character'].toLowerCase()))
                    seiyuu.push(obj['objects'][ID]);
                    digitarray.push(ID)
                }              
                
            }
            splitQuery = obj['objects'][ID]['Nick Query'].replace(" ", "").replace(/( )?\*/, "").split("/")
            
            if(query.split(" ").length ==1 && !seiyuu.length)
            {
              for (let i=0; i < splitQuery.length;i++)
              {
                if(splitQuery[i].toLowerCase().trim() == query.trim())
                  seiyuu.push(obj['objects'][ID]);
              }
            }
            
        }   
      
        let nicktemp = []
         for (let id in obj['objects'])
              {
                splitQuery = obj['objects'][id]['Nick Query'].replace(" ", "").replace(/( )?\*/, "").split("/")
                for (let i=0; i < splitQuery.length;i++)
                {
                  if(splitQuery[i].toLowerCase().trim() == query.trim())
                    nicktemp.push(obj['objects'][id]);
                }
              }
        if(nicktemp.length)
        {
          seiyuu = []
          seiyuu = nicktemp
        }
        if(!seiyuu.length)
            return message.reply("I could not find a Seiyuu matching that name. Please check for errors and try again!")

        let seiyuufiltered = []
        
       
       if (franchise != null)
        {
            for (let id in seiyuu)
            {
                if (seiyuu[id]['Franchise'] == franchise)
                    seiyuufiltered.push(seiyuu[id])
            }
        }
        else
            seiyuufiltered = seiyuu


        let seiytemp = []
        if(query.trim() == "")
        {          
          seiytemp.push(seiyuufiltered[helper.data.getRandomInt(0, seiyuufiltered.length-1)])
          seiyuufiltered = []
          seiyuufiltered = seiytemp
        }

        if (digit > seiyuufiltered.length-1)
        digit = 0;
  
        
      

       
      
       
        sendInfo(digit);
       
        
        function sendInfo(digit) { 
            const embed = new Discord.RichEmbed()            

            let color = seiyuufiltered[digit]['Image Color'] 
            if (color === "TBA")
                color = "#b5b1e1"
            let image
            if (seiyuufiltered[digit]['MAL Image'] != "-")
              image = "https://myanimelist.cdn-dena.com/images/voiceactors/"+seiyuufiltered[digit]['MAL Image']+".jpg"
            else 
              image = "https://abload.de/img/000000-0.0s3ssy.png"
            if (seiyuufiltered[digit]['Other Image'] != "-" && seiyuufiltered[digit]['Other Image'] !== "undefined")
            {
              image = seiyuufiltered[digit]['Other Image'].split("|")[0].trim()
            }


           let twittersplit = seiyuufiltered[digit]['Twitter Account'].split("|")
            let twitterstr = ""
            let twitter
            for(let id in twittersplit)
            {
                twitter = twittersplit[id].split("/")
                if ( twitter != "-")
                    twitterstr += "[@"+twitter[twitter.length-1].trim()+"]"+"("+twittersplit[id].trim()+")"
                else
                    twitterstr += "n/a"

                if (id != twittersplit.length-1)
                    twitterstr += ",\n"

            }
            
            let blog = seiyuufiltered[digit]['Blog']
            if( blog == "-")
              blog = "n/a"
          
            if(date == seiyuufiltered[digit]['Birthday'])
              birthday  = " **🎉Today is their birthday**🎉"
          
            let mal 
             if (seiyuufiltered[digit]['MAL Page'] != "-")
               mal = "[MAL](https://myanimelist.net/people/"+seiyuufiltered[digit]['MAL Page']+")"
             else
               mal = "n/a"
            console.log("Agency: "+seiyuufiltered[digit]['Agency'])
            let agency
            if (seiyuufiltered[digit]['Agency'].match(/( )?-( )?/) == null && seiyuufiltered[digit]['Agency'].toLowerCase().match(/( )?\bf\b( )?/) == null)
            {
              agency = seiyuufiltered[digit]['Agency']
            }
            else if(seiyuufiltered[digit]['Agency'].toLowerCase().match(/( )?\bf\b( )?/) != null)
              agency = "-"
            else
              agency = "n/a"
            
            let website = []
            let websiteurl = []
            if (seiyuufiltered[digit]['Website'] != "-" )
            {
                website = seiyuufiltered[digit]['Website'].split("/")
                websiteurl = seiyuufiltered[digit]['Website URL'].split("|")
            }                                             
            
            let webstr = ""
            if(!website.length)
              webstr="n/a"
            for(let id in website)
            {
                webstr += "["+website[id]+"]("+websiteurl[id]+")"
                if (id != website.length-1)
                  webstr += " / "
            }
            
            let media = []
            let mediaurl = []
            if (seiyuufiltered[digit]['Other Media'] != "-" )
            {
                media = seiyuufiltered[digit]['Other Media'].split("/")
                mediaurl = seiyuufiltered[digit]['Other Media URL'].split("|")
            }                                             
            
            let mediastr = ""
            if(!media.length)
              mediastr="n/a"
            for(let id in media)
            {
                mediastr += "["+media[id]+"]("+mediaurl[id]+")"
                if (id != media.length-1)
                  mediastr += " / "
            }

            let name
            if(seiyuufiltered[digit]['Artist Name']!= "-")
                name = seiyuufiltered[digit]['Seiyuu Name'].split(" ")[0] + " \""+seiyuufiltered[digit]['Artist Name']+"\" " + seiyuufiltered[digit]['Seiyuu Name'].split(" ")[1]
            else
                name = seiyuufiltered[digit]['Seiyuu Name']
            

            embed.setColor(color)
            embed.setTitle(`${name} - ${seiyuufiltered[digit]['Character']}`)
            embed.setImage(image)
            
            embed.addField("Nickname: ",`${seiyuufiltered[digit]['Nickname'].replace(/( )?\*/,"").replace(/( )?\/( )?/g, ", ")}`, true)
            embed.addField("Birthday: ",`${seiyuufiltered[digit]['Birthday']}${birthday}`, true)
            embed.addField("Birthplace:", `${seiyuufiltered[digit]['Birthplace']}`)
            
            
            if(seiyuufiltered[digit]['Skills'] != "-") 
            {
                embed.addField("Skills :", seiyuu[digit]['Skills'].replace(/( )?\|( )?/g, ", "))  
            }
            if(seiyuufiltered[digit]['Hobbies'] != "-") 
            {            
                embed.addField("Hobbies :", seiyuufiltered[digit]['Hobbies'].replace(/( )?\|( )?/g, ", "))
            }
            embed.addBlankField()
            embed.addField("Twitter :", twitterstr,true)
            embed.addField("Blog :", "["+blog+"]("+seiyuufiltered[digit]['Blog URL']+")",true)
            embed.addField("Other Media :", mediastr,true)
            embed.addField("Website :", webstr,true)
            embed.addField("MAL :", mal,true)
            embed.addField("Agency :", "["+agency+"]("+seiyuufiltered[digit]['Agency URL']+")",true) 
            
            embed.setTimestamp()
            embed.setFooter("Special thanks to the people helping with this project: goo.gl/prihtA")
            

            message.channel.send(embed);

            if (seiyuufiltered.length > 1)
            {
                let str = "";
                count = 1
                for (let id in seiyuufiltered)
                {
                    if (id != digit)
                    {
                       str+= `**${seiyuufiltered[id]["Seiyuu Name"]}** (${seiyuufiltered[id]["Character"]}) [${seiyuufiltered[id]["Franchise"]}] **${count}**\n`
                       count++
                    }
                    
                }

                const embed2 = new Discord.RichEmbed()

                embed2.setColor("#b5b1e1")
                embed2.setDescription("**Other seiyuu who match this query: **\n" + str)
                message.channel.send(embed2);
            }
        }
      
              if (query !== this.name && this.aliases.includes(query) == false)
              {
                const filter = m =>m.author.id === message.author.id
                let collector
                if (collector == null)
                    collector = message.channel.createMessageCollector(filter, { time: 30000 });

                collector.on('collect', m => {
                    console.log("Message: "+m)
                    if (m.content.match(/^(\d)+/) != null && (m < seiyuufiltered.length & m > 0))
                    {
                        seiyuufiltered  = helper.data.sortArray(seiyuufiltered, digit)
                        digit = m-1                      
                        let i = 0
                                               
                        sendInfo(digit)
                                                         
                        
                    }
                    else if (m.content.match(/^(\d)+/) != null && (m >= seiyuufiltered.length || m < 1)) 
                        message.reply("Please enter a valid number for this request! (1 - "+(count-1)+")")
                    else
                        collector.stop()
                })

                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} items`);
                })   
              }
        
       
    },
};