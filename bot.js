const express = require('express')
const app = express()
const http = require('http');

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Ready now!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();    

	if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.args && !args.length) {
    	return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }

	try {
		command.execute(message, args);
	}
	catch (error) {
	    console.error(error);
	    message.reply('there was an error trying to execute that command!');
	}
});

client.login(process.env.TOKEN);
