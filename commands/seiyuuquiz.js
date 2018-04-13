const helper = require('../helpers.js');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');
const currencyHelper = require('../currencyHelpers.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const BotChannels = sequelize.import("../models/BotChannels")


module.exports = {
    name: 'seiyuuquiz',
    description: 'Returns random trivia about an Idolm@ster Seiyuu!',
    usage: "<optional: franchise>",
    aliases: ['sq', 'quiz', 'vaquiz', 'cvquiz'],
    cooldown: 3,
    
    execute(message, args) {
      const fs = require('fs');
      let rawdata
      let obj
      let aliases = this.aliases
      let name = this.name
      let count = 0
      let running_quiz;


        BotChannels.find({
            where: {
                    botchannel_id: message.channel.id
            },
        }).then(botchannel => {
            running_quiz = botchannel.running_quiz

        }).then(function()
        {
        if (Date.now() > parseInt(running_quiz) + 60000 || running_quiz == null || running_quiz == "false")
        {      
            helper.data.readSpreadsheet("1mFTCIxa-FlRAWT70M7lC82bx-HRvDm_lovUJLL4FlN8", "seiyuu", "SeiyuuInfo!A:Z")
            rawdata = fs.readFileSync('./seiyuu.json');
            obj = JSON.parse(rawdata) 
          
            let arr = []
            let nickarray = []

            let franchise
            let query = message.content;
            query = query.toLowerCase()
            query = query.replace(prefix, "");
            query = query.substring(query.indexOf(" ") + 1);
            query = query.trim()


            let re = /( )?\ba(l(l)?(l)?)?( )?s(tars)?\b( )?/
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

            for (let ID in obj['objects'])
            {   
                    arr.push(obj['objects'][ID])
            }
          
            if (!arr.length)
                return console.log("Error")
          
            let arrfiltered = []

            if (franchise != null)
            {
                for (let id in arr)
                {
                    if (arr[id]['Franchise'] == franchise)
                        arrfiltered.push(arr[id])
                    if (franchise == "Million Live" && arr[id]['Franchise'] == "Allstars")
                        arrfiltered.push(arr[id])
                }
            }
            else
                arrfiltered = arr

            let seiyuudigit = helper.data.getRandomInt(0, arrfiltered.length-1)
            
            let quiztype = helper.data.getRandomInt(0, 1)

            let namesplit
            const embed = new Discord.RichEmbed()
            const embed2 = new Discord.RichEmbed()  
            const hintembed = new Discord.RichEmbed()                   

            let seiyuuimage
            if (arrfiltered[seiyuudigit]['MAL Image'] != "-")
                seiyuuimage = "https://myanimelist.cdn-dena.com/images/voiceactors/"+arrfiltered[seiyuudigit]['MAL Image']+".jpg"
            else 
                seiyuuimage = "https://abload.de/img/000000-0.0s3ssy.png"
            if (arrfiltered[seiyuudigit]['Other Image'] != "-" && arrfiltered[seiyuudigit]['Other Image'] !== "undefined")
            {
                seiyuuimage = arrfiltered[seiyuudigit]['Other Image'].split("|")[0].trim()
            }

            let characterimage
            if (arrfiltered[seiyuudigit]['Character Image'] != "-")
                characterimage = arrfiltered[seiyuudigit]['Character Image']
            else
                characterimage = "https://abload.de/img/000000-0.0s3ssy.png"

            let color = arrfiltered[seiyuudigit]['Image Color'] 
            if (color === "TBA")
                color = "#b5b1e1"

            
            if (quiztype == 0)
            {
                embed.addField(`[${arrfiltered[seiyuudigit]["Franchise"]}]`, `Who voices ${arrfiltered[seiyuudigit]["Character"]}?`)
                embed.setImage(characterimage)
                embed.setColor(color)
                embed.set
                message.channel.send(embed);
                namesplit = arrfiltered[seiyuudigit]["Seiyuu Name"].split(" ")
                if (arrfiltered[seiyuudigit]["Artist Name"] != "-")
                    namesplit.push(arrfiltered[seiyuudigit]["Artist Name"])
            }
            else if (quiztype == 1)
            {
                embed.addField(`[${arrfiltered[seiyuudigit]["Franchise"]}]`, `Which character is voiced by ${arrfiltered[seiyuudigit]["Seiyuu Name"]}?`)
                embed.setImage(seiyuuimage)
                embed.setColor(color)
                message.channel.send(embed);
                namesplit = arrfiltered[seiyuudigit]["Character"].split(" ")
            }

            

            let answered = false
            let hint 
            let hintsplit = []
            if (quiztype == 0)
            {
                hint = arrfiltered[seiyuudigit]["Seiyuu Name"]
                hintsplit = hint.split(" ");
                for (let i = 0; i <= hint.length/3; i++)
                {
                    hintsplit[0] = helper.data.replaceAt(hintsplit[0], helper.data.getRandomInt(0, hintsplit[0].length-1), "x")
                    hintsplit[1] = helper.data.replaceAt(hintsplit[1], helper.data.getRandomInt(0, hintsplit[1].length-1), "x")

                    hint = hintsplit[0]+"\t"+hintsplit[1];
                }
            }
            else if (quiztype == 1)
            {
                hint = arrfiltered[seiyuudigit]["Character"]
                hintsplit = hint.split(" ");
                for (let i = 0; i <= hint.length/3 ; i++)
                {
                    hintsplit[0] = helper.data.replaceAt(hintsplit[0], helper.data.getRandomInt(0, hintsplit[0].length-1), "x")
                    if (hintsplit.length > 1)
                    {
                        hintsplit[1] = helper.data.replaceAt(hintsplit[1], helper.data.getRandomInt(0, hintsplit[1].length-1), "x")
                        hint = hintsplit[0]+"\t"+hintsplit[1];
                    }
                    else
                        hint = hintsplit[0]
                       
                }
            }
            
            //re = /(\w)?/g
            //hint = hint.replace(" ", "\t")
            //hint = hint.replace(re, "\\_ ")
            hint = hint.replace(/(.)(?=.)/g, "$1 ");
            hint = hint.replace(/x/g, "\\_")
            hint.replace("  ", " ")
            hint = hint.trim()
          
            const filter = m => true

            let collector
            
          
            
            if (collector == null)
                collector = message.channel.createMessageCollector(filter, { time: 30000 });

            setTimeout(function(){
                if(!answered)
                {
                    hintembed.setDescription("Hint: "+hint)
                    hintembed.setColor("#b5b1e1")
                    message.channel.send(hintembed);
                }
            },15000)

            collector.on('collect', m => {
               let westernname
               let jpnname
               let artistname 
               let charactername = null;

               if (arrfiltered[seiyuudigit]["Artist Name"] != "-")
                    artistname = arrfiltered[seiyuudigit]["Artist Name"].toLowerCase()
               console.log("Message: "+m)
               if (namesplit.length > 1)
               {
                    westernname = namesplit[0].toLowerCase()+" "+namesplit[1].toLowerCase()
                    jpnname = namesplit[1].toLowerCase()+" "+namesplit[0].toLowerCase()
               }
               else
               {
                   westernname = namesplit[0]
                   jpnname = westernname
               }
               if (quiztype == 0 && (m.content.toLowerCase() == westernname || m.content.toLowerCase() == jpnname ||  m.content.toLowerCase() == artistname || m.content.toLowerCase() == arrfiltered[seiyuudigit]["Seiyuu Name"].toLowerCase()))
               {    
                    answered = true;
                    if (arrfiltered[seiyuudigit]["Artist Name"] != "-")
                        embed2.setDescription(`**${m.author.username}** answered the question correctly and won 50 credits!\n\nThe answer was ${arrfiltered[seiyuudigit]["Artist Name"]} (${arrfiltered[seiyuudigit]["Seiyuu Name"]})`)
                    else
                        embed2.setDescription(`**${m.author.username}** answered the question correctly and won 50 credits!\n\nThe answer was ${arrfiltered[seiyuudigit]["Seiyuu Name"]}`)
                    embed2.setImage(seiyuuimage)
                    embed2.setColor(color)
                    message.channel.send(embed2)
                    currencyHelper.currency.add(m.author.id, 50);
                    collector.stop();
               } 
               else if (quiztype == 1 && (m.content.toLowerCase() == westernname || m.content.toLowerCase() == jpnname || m.content.toLowerCase() == arrfiltered[seiyuudigit]["Character"].toLowerCase()))
               {
                    answered = true;
                    embed2.setDescription(`**${m.author.username}** answered the question correctly and won 50 credits!\n\nThe answer was ${arrfiltered[seiyuudigit]["Character"]}`)
                    embed2.setImage(characterimage)
                    embed2.setColor(color)
                    message.channel.send(embed2)
                    currencyHelper.currency.add(m.author.id, 50);
                    collector.stop();
               }
               else if(m.content.match(">si") != null || m.content.match(">seiyuuinfo") != null || m.content.match(">cv") != null || m.content.match(">va") != null)
               {
                    message.channel.send(m.author+" stop cheating, quiz has been stopped and 100 credits were removed from your account!")
                    currencyHelper.currency.reduce(m.author.id, 100);
                    collector.stop();
                }
              
              else if (m.content.toLowerCase() == "end" && m.author == message.author)
              {
                   collector.stop() 
                   answered = true;
              }
              
                                    
               
            })

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} items`);
                if (answered == false && quiztype == 0)
                {
                    if (arrfiltered[seiyuudigit]["Artist Name"] != "-")
                        embed2.setDescription(`No one guessed it! \n\nThe answer was ${arrfiltered[seiyuudigit]["Artist Name"]} (${arrfiltered[seiyuudigit]["Seiyuu Name"]})`)
                    else
                        embed2.setDescription(`No one guessed it! \n\nThe answer was \`${arrfiltered[seiyuudigit]["Seiyuu Name"]}\``)
                    embed2.setImage(seiyuuimage)
                    embed2.setColor(color)
                    message.channel.send(embed2)

                }
                if (answered == false && quiztype == 1)
                {
                    embed2.setDescription(`No one guessed it! \n\nThe answer was \`${arrfiltered[seiyuudigit]["Character"]}\``)
                    embed2.setImage(characterimage)
                    embed2.setColor(color)
                    message.channel.send(embed2)
                }
                
                BotChannels.update(
                    { running_quiz: "false" },
                    { where: { botchannel_id: message.channel.id } }
                  )
            }) 

            BotChannels.update(
                  { running_quiz: Date.now() },
                  { where: { botchannel_id: message.channel.id } }
                )
        }   
        else
        {
            message.reply("There already is a quiz running, please wait until it concludes and then try again!")
        }    
    });
        
       
    },
};