const helper = require('../../helpers.js');
const bot = require('../../bot.js');
const Discord = require('discord.js');



const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Users = sequelize.import("../../models/Users")

module.exports = {
    name: 'leaderboard',
    description: "Returns the people with the most credits!",
    execute(message, args) {
       console.log("hallo")

       let target = message.mentions.users.first() || message.author;
       let userstr = "";
       let creditstr = "";
       let rankstr = "";
       let client = bot.client
       let rank = 1;
       Users.findAll({ limit: 15, order: [['balance', 'DESC']]})
       .then( user => {
          for(let id in user)
          {
            let userid = user[id]["user_id"]
            let balance = user[id]["balance"]
            if (client.users.get(userid) != undefined && !client.users.get(userid).bot && rank <= 10)
            {  
              let username = client.users.get(userid).username
              let spaces = ""
              rankstr += rank+".\n"
              userstr += username.substring(0, 17)+"\n"
              creditstr += balance+"\n"
              rank++;
            }
          }
          
          const embed = new Discord.RichEmbed()

          embed.setColor("#b5b1e1")
          embed.addField("Rank:", rankstr, true)
          embed.addField("Users:", userstr, true)
          embed.addField("Balance:", creditstr, true)
          return message.channel.send(embed)
        })
     
       
    },
};