const Discord = require('discord.js');

module.exports = {
    name: 'serverinfo',
    description: 'Serverinfo',
    guildOnly: true,
    cooldown: 15,
    execute(message, args) {
      let roles = message.guild.roles
      let string = "";
      let count = 0;
      message.guild.roles.forEach(function(element) {
      string += element.name
      count++
      if (count < message.guild.roles.size)
      {
          string += ", "
      }
});
        
  const embed = new Discord.RichEmbed()
   
  .setColor(0x00AE86)
 
  .setImage(`${message.guild.iconURL}`)
  .setThumbnail(`${message.guild.iconURL}`)
  
  .setTimestamp()
  .setURL(`${message.guild.iconURL}`)
  .addField("**Server name:**", `${message.guild.name}`, true)
  .addField("Owner:", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`, true)
  .addBlankField()
  .addField("Total members:", `${message.guild.memberCount}`, true)
  .addField("Region:", `${message.guild.region}`, true)
  .addField("Total Roles:", `${message.guild.roles.size}`, true)
  
  .addField("Roles: ", "```"+string+ "```",true)
  
  .addBlankField(true)
  .addField("Created at: ", `${message.guild.createdAt.toLocaleString()}`)

  message.channel.send({embed});
    },
};