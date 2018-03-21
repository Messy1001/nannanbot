const helper = require('../helpers.js');
const Discord = require('discord.js');

module.exports = {
    args: true,
    name: 'tdcard',
    description: 'Returns a Theater Days card.',
    usage: '<options>',
    execute(message, args) {


       helper.data.readSpreadsheet("146vKsT5WoNeE4fO68kGNpng1KnqnBYjENe_rZpHSVvc", "cards", "CardList!A:Z");

       var re = /lim(ited)?/; 
       var str = 'limitedited and rare';
       var newstr = str.replace(re, 'aaaa');
       const fs = require('fs');
       
       let rawdata = fs.readFileSync('./cards.json');  
           let obj = JSON.parse(rawdata);  
       
       var query = args[0]+ " "+args[1]
       
       var cards = []
      
      for (var ID in obj['objects'])
      {
        if (obj['objects'][ID]['Name']== query)
        {
            cards.push(obj['objects'][ID]);
        }
        
      }
      
  const embed = new Discord.RichEmbed()
   
  .setColor("#b5b1e1")
 
  .setImage("http://imas.gamedbs.jp/mlth/image/card/icon/" + cards[args[2]]['Icon Filename'] + ".png")
  
  .setTimestamp()
  .setURL(`${message.guild.iconURL}`)
  .addField("**Rarity: **", cards[args[2]]['Rarity'], true)
  .addField("**Name: **", cards[args[2]]['Name'], true)
  .addField("**Title: **", cards[args[2]]['Title'], true)
  
  .addBlankField()
  .addField("Max Stats: ", "**Li/Da/Vo/Vi (Total)**\n" + `${cards[args[2]]['Life']} / ${cards[args[2]]['Max Dance']} / ${cards[args[2]]['Max Vocal']} / ${cards[args[2]]['Max Visual']} **(${cards[args[2]]['Total']})**`)
  .addField("Master Stats: ", "**Li/Da/Vo/Vi (Total)**\n" + `${cards[args[2]]['Life']} / ${cards[args[2]]['Master Dance']} / ${cards[args[2]]['Master Vocal']} / ${cards[args[2]]['Master Visual']} **(${cards[args[2]]['Master Total']})**`)
  
  .addBlankField()
  .addField("Skill: " + cards[args[2]]['Skill Type'], cards[args[2]]['Skill'], false)
  .addField("Leader Skill: ", cards[args[2]]['Center Skill'], true)
  
    .addBlankField()


  message.channel.send({embed});
         
  

      
    },
};