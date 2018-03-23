const Discord = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Userinfo',
    guildOnly: true,
    cooldown: 15,
    execute(message, args) {
      
  let user;
  if (!message.mentions.users.size)
  {
    user = message.author;
  }
  else 
  {
    user = message.mentions.users.first();
  }
  let test;
  test = message.guild.members.get(user.id);
  console.log(test);
  const embed = new Discord.RichEmbed()
   
  .setColor(message.guild.members.get(user.id).displayColor)
 
  .setThumbnail(`${user.displayAvatarURL}`)
  
  .setTimestamp()
  .setURL(`${user.displayAvatarURL}`)
  .addField("Username", `${user.username}#${user.discriminator}`, true)
  .addField("User ID", `${user.id}`, true)
  .addBlankField()
  
  .addField("User created at: ", `${user.createdAt.toLocaleString()}`, true)
  .addField("Joined Server: ", `${message.guild.members.get(user.id).joinedAt.toLocaleString()}`, true)
  .addBlankField()
  message.channel.send({embed});
    },
};