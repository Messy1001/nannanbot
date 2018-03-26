const express = require('express')
const app = express()
const http = require('http');
const dotenv = require('dotenv').config()
const fs = require('fs');
const helper = require('./helpers.js');


const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');
const cooldowns = new Discord.Collection();

const donutschannel = []
const messychannel = []
const messyserver = null
var donutsserver
var donutsbotchannel 

const month = new Array();
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

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  helper.data.readSpreadsheet("1mFTCIxa-FlRAWT70M7lC82bx-HRvDm_lovUJLL4FlN8", "icon", "ServerIcon!A:Z")
  var rawdataicon
  var objicon
  
  rawdataicon = fs.readFileSync('./icon.json');
  objicon = JSON.parse(rawdataicon) 
  console.log(objicon['objects']['Icon'])
  var event = new Date()
  event = event.toLocaleString('zh-cn', { timeZone: 'Asia/Tokyo' });
  event = event.replace(/-/g, "/", 1);
  console.log("Time: "+event);        
  event = new Date(event)
  let date = event.getDate() +" "+month[event.getMonth()]
  
  if(event.getHours() == "23" && event.getMinutes() == "59" && event.getSeconds() <= "10")
  {
    helper.data.saveImage(objicon['objects'][0]['Icon'], "icon")  
    helper.data.saveImage('https://cdn.discordapp.com/attachments/395383455019565056/396826108579807232/MachiWat.png', "machiwat")  
  }

   if (event.getHours() == "0" && event.getMinutes() == "0" && event.getSeconds() <= "10")
   {
     let rawdata = fs.readFileSync('./seiyuu.json');  
     let obj = JSON.parse(rawdata); 
     let birthdays = []
     
     
        

  for (let id in obj['objects'])
  {
      
    if (date == obj['objects'][id]['Birthday'])
        birthdays.push(obj['objects'][id])
  }

  var donutsbday = []
  for (let id in birthdays)
  {
     if (birthdays[id]['Franchise'] !== 'SideM')
      donutsbday.push(birthdays[id])

  }

  if(!donutsbday.length)
  {
   
    donutschannel[0].setName("imas_talk")
    donutschannel[1].setName("general")
    donutschannel[2].setName("event_chat")
    

    donutsserver.setIcon("./images/machiwat.png")
  }

  if(!birthdays.length)
  {
     messychannel[0].setName("birthday_log")
     messychannel[1].setName("birthdaytest2")

  }

  let str = "HBD"
  let nick =""
  
  let count = 1
  for (let id in birthdays)
  {
      var image
      
      if (birthdays[id]['MAL Image'] != "-")
          image = "https://myanimelist.cdn-dena.com/images/voiceactors/"+birthdays[id]['MAL Image']+".jpg"
        else 
          image = "https://abload.de/img/000000-0.0s3ssy.png"
        if (birthdays[id]['Other Image'] != "-")
          image = birthdays[id]['Other Image'].split('|')[0].trim() 
    if (birthdays[id]['Nickname'] != '-' && birthdays[id]['Nickname'] !== 'undefined')
    nick = birthdays[id]['Nickname'].split("/")[0]
    else
    nick =  birthdays[id]['Seiyuu Name'].split(" ")[0].trim() 
    
    if (birthdays[id]['Franchise'] != "SideM")
      donutschannel[0].sendMessage("**Today is "+birthdays[id]['Seiyuu Name']+"'s ("+birthdays[id]['Character']+") birthday\n**"+image)
      messychannel[0].sendMessage("**Today is "+birthdays[id]['Seiyuu Name']+"'s ("+birthdays[id]['Character']+") birthday\n**"+image)
    
    str += "_"+nick.trim()
    console.log(str.split("\_")[count])
    if (birthdays[id]['Franchise'] != "SideM")
      donutschannel[count-1].setName("HBD\_"+str.split("\_")[count]);
    messychannel[count-1].setName("HBD\_"+str.split("\_")[count]);
    if (birthdays[id]['Franchise'] != "SideM")
      donutsserver.setIcon("./images/icon.png")
    count++
  }
    
  }
  
  response.sendStatus(200);
  client.on
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 10000);

client.on('ready', () => {
    console.log('Ready now');
    donutsserver = client.guilds.get('394781096929132554')
    messychannel.push(client.channels.get('426547787946131478'))
    messychannel.push(client.channels.get('427137127260749825'))
    donutschannel.push(client.channels.get('398042378759307274'))
    donutschannel.push(client.channels.get('394781096929132556'))
    donutschannel.push(client.channels.get('397203874173157376'))
    donutsbotchannel = client.channels.get('397264569069862912')
  
    client.user.setPresence({ game: { name: '?help for commands', type: 0 } });
    
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  
   const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();    

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
  
  if (command.modOnly && !message.member.hasPermission(command.permissions))
  {
    return message.reply('You don\'t have the necessary permissions to use this command!');    
  }
 
  if (message.channel === donutsbotchannel || message.guild != donutsserver || command.modOnly)
  {
 

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (!timestamps.has(message.author.id)) {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }
  else {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }
    
  try {
    command.execute(message, args);
  }
  catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
  }
  }
});

client.login(process.env.TOKEN);
