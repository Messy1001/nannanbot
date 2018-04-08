const { prefix, token } = require('../../config.json');

const helper = require('../../helpers.js');
const currencyHelper = require('../../currencyHelpers.js');



const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Users = sequelize.import("../../models/Users")

module.exports = {
      args: true,
      name: 'transfercredits',
      description: "Transfers credits to another user.",
      usage: "<\@user>",
      execute(message, args) {

      let target = message.mentions.users.first();
      var query = message.content;

      query = query.toLowerCase()
      query = query.replace(prefix, "");
      query = query.substring(query.indexOf(" ") + 1);
      query = query.trim()

      console.log("Query after 1:"+query)

      let re = /( )?\<\@(!)?(\d)+\>( )?/
      let mention = query.match(re);
       
      query = query.replace(re, "");
      query.trim()

       console.log("Query after 2:"+query)

      re = /( )?\b(\d)+\b( )?/
      var amount = query.match(re);
      amount = parseInt(amount[0].trim())

      let balance = currencyHelper.currency.getBalance(message.author.id)

      if (balance >= amount)
      {
        currencyHelper.currency.add(target.id, amount);
        currencyHelper.currency.reduce(message.author.id, amount);
      }
      else
        return message.reply(`You tried to transfer ${amount} credits but only have ${balance}!`)



      return message.channel.send(`${message.author} transferred ${amount} credits to ${target}.`)
       
    },
};