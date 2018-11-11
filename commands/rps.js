const { prefix, token } = require('../config.json');
const currencyHelper = require('../currencyHelpers.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Users = sequelize.import("../models/Users")
module.exports = {
    args: true,
    usage: "<pick> <optional: wager>",
    name: 'rps',
    description: 'Rock, Paper, Scissors',
    cooldown: 5,
    execute(message, args) {
       
        var items = Array("rock", "paper", "scissors");

		var item = items[Math.floor(Math.random()*items.length)];
		var emoji;
		let str = ""
		var query = message.content;
      
        query = query.toLowerCase()
        query = query.replace(prefix, "");
        query = query.substring(query.indexOf(" ") + 1);
        query = query.trim()

        console.log("Query after 1:"+query)

		    var re = /( )?\b(\d)+\b( )?/
        var bet = query.match(re);
       
        if (bet != null)
        {
            bet = parseInt(bet[0].trim())
            query = query.replace(re, "");
            query.trim()
        }
      
       
        let balance
		
		Users.findOne({
       		where: {user_id: message.author.id}
       	})
        .then( user => {
      		balance = user['balance']
      		if (bet > balance)
	      		return message.reply("You tried to bet " +bet+" credits but only have "+balance+"!")
   		 
        
    console.log("User's balance: "+balance)
      
     if (query.match("all") != null)
        {
          bet = balance;  
          query = query.replace("all", "");
          query = query.trim()
        }

        let pick = ""

        if (query == "rock")
        	pick = "rock"
        if (query == "scissors")
        	pick = "scissors"
        if (query == "paper")
        	pick = "paper"

        console.log("bet: "+bet)
        console.log("ID: "+message.author.id)
     

		if (item === "rock")
		{
			emoji = ":fist:";
		}
		else if (item === "paper")
		{
			emoji = ":hand_splayed:"
		}
		else if (item === "scissors")
		{
			emoji = ":scissors:"
		}

		if (pick != "rock" && pick != "paper" && pick != "scissors")
		{
			message.reply('Please pick either Rock, Paper or scissors!');
		}

		else if (pick === item)
		{
			str = ""
			str+= '\nWe both picked ' +emoji+ ' and tied!';
			if(bet != null)
				str+='\nYour bet has been returned!';
			message.reply(str)

		}

		else if (pick === "rock" && item === "scissors" || pick === "scissors" && item === "paper" || pick === "paper" && item === "rock")
		{
			str = ""
			str+= '\nI picked ' +emoji+ ' and lost!';
			if(bet != null)
			{
				currencyHelper.currency.add(message.author.id, bet)
				str+="\n"+bet+" credits have been added to your account!"
			}
			message.reply(str)

		}

		else if (pick === "rock" && item === "paper" || pick === "scissors" && item === "rock" || pick === "paper" && item === "scissors")
		{
			str = ""
			str+='\nI picked ' +emoji+ ' and won!';
			if(bet != null)
			{
				currencyHelper.currency.reduce(message.author.id, bet)
				str+="\n"+bet+" credits have been removed from your account!"
			}
			message.reply(str)
		}
		})

    },
};