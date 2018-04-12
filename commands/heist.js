const helper = require('../helpers.js');
const currencyHelper = require('../currencyHelpers.js');
const delay = require('delay');
const { prefix, token } = require('../config.json');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Users = sequelize.import("../models/Users")
const Heists = sequelize.import("../models/Heist")

module.exports = {
    name: 'heist',
    description: "Starts a heist on Nannan to steal some of its money or joins one that is already in progress!",
    cooldown: 10,
    execute(message, args) {

      Heists.findOrCreate({
        where: {
          id: 1
        },
        defaults: {
            heist_start: Date.now(),
            participants:  message.author.id+",",
            channels: message.channel.id+","
        }
    }).then(function(result) {
      console.log(result[0])
      let created = result[1]
      let participants = result[0].participants.split(",")
      let heistleader = message.guild.members.get(result[0].participants.split(",")[0])
      let timeleft = (Date.now() - result[0].heist_start) 
      timeleft = timeleft/1000
      timeleft = 86400 - timeleft
        if(created && participants.includes(message.author.id))
          message.reply("You have started a heist on Nannan. Preparing it will take 24 hours.")
        else if (!created && !participants.includes(message.author.id))
        {
          result[0].participants += message.author.id+","
          if (!result[0].channels.split(",").includes(message.channel.id))
            result[0].channels += message.channel.id+","
          
          message.reply(heistleader.user.username+" is already planning a heist so you joined their efforts. Time until execution: "+helper.data.secondsToString(timeleft).replace("0 days ", ""))
          Heists.update(
            { participants: result[0].participants,
              channels: result[0].channels
            },
            { where: { id: 1 } }
          )
        }
        else if (!created && participants.includes(message.author.id))
          message.reply("You are already participating in this heist. Time until execution: "+helper.data.secondsToString(timeleft).replace("0 days ", ""))
    });
    },
  };