const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Discord = require('discord.js');
const Users = sequelize.import("./models/Users")
const Heists = sequelize.import("./models/Heist")

const bot = require('./bot.js');

const currencyHelper = require('./currencyHelpers.js');
const Helper = require('./helpers.js');

var methods = {

  resolveHeist: function resolveHeist(){
    
    let participants
    let channels
    let starttime
    let client = bot.client
    let cash
    
    Users.find({
      where: {user_id: "425271727484829696"}
    })
    .then( user => {

      cash = user['balance']
      cash = Math.ceil(Helper.data.getRandomInt(0, 8)/10 * cash);
    }).then(() => {

    Heists.find({
      where: { id: 1}
    }).then((result) =>{
      if (result != null)
      {
          participants = result.participants.split(",");
          channels = result.channels.split(",");
          starttime = parseInt(result.heist_start)
        
          console.log(Date.now())
          console.log(starttime+10000)
          if (Date.now() > starttime + 86400000)
          {
            let loot = Math.ceil(cash);
            cash = Math.ceil(cash/participants.length-1)
            console.log("cahs"+cash)
            for (let i = 0; i < participants.length-1; i++)
            {
              console.log(participants[0])
              currencyHelper.currency.add(participants[0], cash);
              currencyHelper.currency.reduce("425271727484829696", cash);
            }
            for (let i = 0; i < channels.length-1; i++)
            {
              client.channels.get(channels[i]).send("The heist started by"+client.users.get(participants[0].trim()).username +" was successful! "+"The loot was "+loot+" credits\nEvery participant gets paid their share of "+cash+" credits.");
            }
            Heists.destroy({
              where: {id: 1}
            })
          }
          else
          {
            return;
          }
      }
    })
  })
  }

}

exports.data = methods;

