const express = require('express')
const app = express()
const http = require('http');
const dotenv = require('dotenv').config()
const fs = require('fs');
const helper = require('./helpers.js');
const currencyHelper = require('./currencyHelpers.js')
var dir = require('node-dir');
const Sequelize = require('sequelize');

const Discord = require('discord.js');
const { prefix, token } = require('./config.json');


const client = new Discord.Client();

client.commands = new Discord.Collection();

//const commandFiles = fs.readdirSync('./commands');
const commandFiles = dir.files("./commands", {sync:true});

const cooldowns = new Discord.Collection();

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});

const Servers = sequelize.import('./models/Servers');
const BotChannels = sequelize.import('./models/BotChannels');
const RenameChannels = sequelize.import('./models/RenameChannels');
const Users = sequelize.import("./models/Users")


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
    const command = require(`./${file}`);

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
    Servers.findAll({
    where: {default_icon: {
        [Sequelize.Op.ne]: null
        }
      }
    }).then(servers => {
        for (let serverid in servers)
        {
          helper.data.saveImage(objicon['objects'][0]['Icon'], "icon")  
          helper.data.saveImage(servers[serverid]['default_icon'], servers[serverid]['server_id'])  
        }
    })
  }

   if (event.getHours() == "00" && event.getMinutes() == "00" && event.getSeconds() <= "10")
   {
     let rawdata = fs.readFileSync('./seiyuu.json');  
     let obj = JSON.parse(rawdata); 
     let birthdays = []
     
     
        

  for (let id in obj['objects'])
  {
      
    if (date == obj['objects'][id]['Birthday'])
        birthdays.push(obj['objects'][id])
  }
  console.log("Bdays: "+birthdays)
  
 
  
    Servers.findAll({
    where: {announcement_channel: {
        [Sequelize.Op.ne]: null
        }
      }
    }).then(servers => {
        for (let serverid in servers)
        {
         console.log("Servers: "+servers[serverid]['server_id'])
        }
        let str = "HBD"
        let nick =""
      
        let count = 0
        for (let id in birthdays)
        {
            var image
            console.log("ID: "+id)
          
            if (birthdays[id]['MAL Image'] != "-")
              image = "https://myanimelist.cdn-dena.com/images/voiceactors/"+birthdays[id]['MAL Image']+".jpg"
            else 
              image = ""
            if (birthdays[id]['Other Image'] != "-")
              image = birthdays[id]['Other Image'].split('|')[0].trim() 
            if (birthdays[id]['Nickname'] != '-' && birthdays[id]['Nickname'] !== 'undefined')
              nick = birthdays[id]['Nickname'].split("/")[0]
            else
              nick =  birthdays[id]['Seiyuu Name'].split(" ")[0].trim() 
        
          for (let serverid in servers)
          {
          
            let announcementTypes = servers[serverid]['announcement_type'].split(",")
             console.log("Types: "+announcementTypes)
            let announcebirthdays = []
            for (let announcementtypeid in announcementTypes)
            {
              
              if (birthdays[id]['Franchise'] == announcementTypes[announcementtypeid])
              {
                console.log("Franchise: "+birthdays[id]['Franchise'])
                console.log("Type: "+announcementTypes[announcementtypeid])
                announcebirthdays.push(birthdays[id])
              } 
              console.log("length" +  announcebirthdays.length)
            }
              for (let announcebirthdaysid in announcebirthdays)
              {
                console.log("birthdays: "+announcebirthdays[announcebirthdaysid]['Seiyuu Name'])
                client.channels.get(servers[serverid]['announcement_channel']).send("Today is **"+announcebirthdays[announcebirthdaysid]['Seiyuu Name']+"'s** ("+birthdays[id]['Character']+") birthday\n"+image)
              }
        }
      }
    })

    Servers.findAll({
    where: {rename_channel:{
        [Sequelize.Op.ne]: 0
        }
      }
    }).then(servers => {
      for (let serverid in servers)
        {
         console.log("ServersID: "+servers[serverid]['server_id'])
         let announcementTypes = servers[serverid]['announcement_type'].split(",")
         let tempbday = birthdays
         let count = 0;
        RenameChannels.findAll({
          where: {server_id: servers[serverid]['server_id']
          }
        }).then(channels => {
          for (let channelid in channels)
          {
            for(let birthdayid in birthdays)
            {
              for (let announcementtypeid in announcementTypes)
              {
                
                if (birthdays[birthdayid]['Franchise'] == announcementTypes[announcementtypeid] && count < channels.length && count < birthdays.length)
                {
                  console.log("Name: "+birthdays[birthdayid]['Seiyuu Name'])
                  client.channels.get(channels[count]['renamechannel_id']).setName("HBD_"+birthdays[birthdayid]['Nickname'].split("/")[0])
                  count++
                } 
              }
            }  
          }
          console.log("Count: "+count)
          for (let channelid in channels)
          {
              if (channelid >= count)
              client.channels.get(channels[channelid]['renamechannel_id']).setName(channels[channelid]['default_name'])
          }
          if(count == 0 && servers[serverid]['default_icon'] != null)
            client.guilds.get(servers[serverid]['server_id']).setIcon("./images/"+servers[serverid]['server_id']+".png")
          else if(count > 0 && servers[serverid]['server_id'] == "394781096929132554")
            client.guilds.get(servers[serverid]['server_id']).setIcon("./images/Icon.png")
          
        })
      }
    })

    
    
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

    const storedBalances = Users.findAll()
    .then(users => {
      for(let id in users)
      {
        currencyHelper.currency.set(users[id]['user_id'], users[id])
      }
    })
    client.user.setPresence({ game: { name: '>help for commands', type: 0 } });
    
});

client.on('message', message => {

   currencyHelper.currency.add(message.author.id, 2);

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();  
  var botchannels = []  

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

  if ((command.modOnly || command.adminOnly) && message.member.hasPermission(command.permissions))
  try {
    command.execute(message, args);
  }
  catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
  }
  if (command.modOnly && !message.member.hasPermission(command.permissions))
     return message.reply('You don\'t have the necessary permissions to use this command!'); 
  BotChannels.findAll({
    where: {server_id: message.guild.id}
  }).then(channels => {
    console.log("yes")
    for (let id in channels)
    {
        botchannels.push(channels[id]['botchannel_id'])
    }

  if (botchannels.includes(message.channel.id))
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
    if (!command.adminOnly)
      command.execute(message, args);
  }
  catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command!');
  }
  }
 
  })
});

client.login(process.env.TOKEN);
