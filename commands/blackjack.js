const { prefix, token } = require('../config.json');
const currencyHelper = require('../currencyHelpers.js');
const mergeImg = require('merge-img');
var Jimp = require("jimp");

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Users = sequelize.import("../models/Users")

module.exports = {
    name: 'blackjack',
    description: 'Ping!',
    usage: "<optional: wager(number, half or all)>",
    execute(message, args) {

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
    	
    	let balance = currencyHelper.currency.getBalance(message.author.id)
      
      if (bet > balance)
    		return message.reply("You tried to bet " +bet+" credits but only have "+balance+"!")

    	
       let rank = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'king', 'queen', 'jack', 'ace']
       let suits = [' SPADES', ' HEARTS ', ' DIAMONDS', ' CLUBS']
       let deck = []
       let hand = []
       let handimg = []
       let dealerhand = []
       let blackjack
       let doubledown = false
       let firstpass = true
       let end = false
       let date
       
       if (query.match("all") != null)
      {
    		bet = balance;
        firstpass = false;
      }
      
      if (query.match("half") != null)
      {
        bet = balance/2
        firstpass = true;
      }
       	const filter = m =>m.author.id === message.author.id && m.createdAt > date
        var collector

       for (let rankid in rank)
       {
       		for (let suitsid in suits)
       		{
       			deck.push([rank[rankid], suits[suitsid]])
       		}
       }
       shuffle(deck)
       console.log("Deck length: "+deck.length)

       hand = [deck.pop(), deck.pop()]
       dealerhand = [deck.pop(), deck.pop()]

       console.log(hand)
       console.log("Deck length after draw:"+deck.length)

       console.log("Value of hand: "+handValue(hand))
       

       displayPlayerDraw(console.log("first player draw"))
    

       
       
          

    	function shuffle(array) {
	    	var m = array.length, t, i;

			// While there remain elements to shuffle…
			while (m) {

				// Pick a remaining element…
				i = Math.floor(Math.random() * m--);

				// And swap it with the current element.
				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}

			return array;
		}

		function cardValue(card) {
			let rank = card[0]
			let value
			if (rank <= 10)
				value = rank
			else if (rank == 'ace')
				value = 11
			else
				value = 10
			return value
		}

		function handValue(hand) {
			let temp_value = 0
			let aces_count = 0
			for (let handid in hand)
			{
				temp_value += cardValue(hand[handid])
				if (hand[handid][0] == 'ace')
					aces_count++
			}

		    while (aces_count > 0)
		    {
		    	if (temp_value > 21 && aces_count > 0)
		    	{
		    		temp_value -= 10
		    		aces_count--
		    	}
		    	else
		    		break
		    }
		    
		    if (temp_value < 21)
		        return [temp_value.toString(), temp_value]
		    else if(temp_value == 21)
		        return ['Blackjack!', 21]
		    else
		        return ['Bust!', 100]

		}

		async function displayPlayerDraw(callback) {
			console.log(doubledown)
			let str = ''
			str += `Your current hand's value is **${handValue(hand)[0]}** with these cards: \n`
			
			if(!end && !firstpass && !doubledown)
			  str += "\n\nDo you want to draw another card? (0 = stay, 1 = draw)\n"
      else if (!end && firstpass)
      {
        str += "\n\nDo you want to draw another card? (0 = stay, 1 = draw, 2 = double down)\n"
        firstpass = false
      }
			displayHand(hand, str, function() {
				if (handValue(hand)[1] == 21)
				{
					message.reply("Blackjack! **You win!**")
          end = true
					blackjack = true
					gameEnd()
					playerWins()
				}
				else if(handValue(hand)[1] > 21)
				{
					message.reply("Bust! **You lose!**")
          end = true;
					gameEnd()
					playerLoses()
				}

				if (doubledown == true && end == false)
				{
					collector.stop()
          displayDealerDraw()
				}
			})
			
		}

		async function displayDealerDraw() {
			let dealerdraws = []
			let new_dealer_card
			let str = ''
			str += `The Dealer's current hand value is **${handValue(dealerhand)[0]}** with these cards: \n`
			
			displayHand(dealerhand, str, function(){
      console.log("yes, callback now ")
			while (handValue(dealerhand)[1] < 17)
			{
				if (handValue(dealerhand)[1] > handValue(hand)[1])
					break
				new_dealer_card = deck.pop()
				
                	dealerhand.push(new_dealer_card)
                	dealerdraws.push(new_dealer_card)
                	
			}
      console.log("Dealer draws"+dealerdraws)
			for (let id in dealerdraws)
			{
      console.log("loop "+ id)
			message.reply("Dealer draws: ",{
					  	files: [{
					    attachment: "./images/cards/"+dealerdraws[id][0]+"_of_"+dealerdraws[id][1].toLowerCase().trim()+".jpg",
					    name: 'hand.jpg'
					  	}]
					}).then(function(){
						if (id == dealerdraws.length-1)
						{
							evaluateWinner()
						}
						})
			}
      
			if (!dealerdraws.length)
				evaluateWinner()
			})

			function evaluateWinner() {
        console.log("evaluate winner")
        if (dealerhand.length > 2)
        {
				str = ''
				str += `Dealer's hand value is **${handValue(dealerhand)[0]}** with these cards: \n`
				displayHand(dealerhand, str, function(){
            evaluate()
        })
        }
        else
          evaluate()
				
        function evaluate() {
				
				
				

				if (handValue(dealerhand)[1] == handValue(hand)[1] && handValue(dealerhand)[1] < 21)
				{
					message.reply("You and the Dealer **tied!**")
					gameEnd()
					playerTies()
				}
				else if (handValue(dealerhand)[1] == 21)
				{
					message.reply("The dealer has a blackjack, **you lose!**")
					gameEnd()
					playerLoses()
				}
				else if (handValue(dealerhand)[1] > handValue(hand)[1] && handValue(dealerhand)[1] < 21)
				{
					message.reply("The dealer's hand has a higher value than yours, **you lose!**")
					gameEnd()
					playerLoses()
				}
				else if (handValue(dealerhand)[1] < handValue(hand)[1] && handValue(dealerhand)[1] < 21)
				{
					message.reply("Your hand has a higher value than the dealer's, **you win!**")
					gameEnd()
					playerWins()
				}
				else
				{
					message.reply("The dealer scored a bust, **you win!**")
					gameEnd()
					playerWins()
				}
				}
				
			}
			
		}

		function gameEnd() {
			console.log("game ends")
			end = true
			if(!end)
				collector.stop()
			
		}

		function playerWins() {
			if (bet !== null && bet > 0)
			{
				if(blackjack)
				{
					bet = bet*1.5
					
				}
        bet = Math.ceil(bet)
				message.reply(bet+" credits have been added to your account!")
				currencyHelper.currency.add(message.author.id, bet)
			}
			collector.stop()
		}

		function playerLoses() {

			if (bet !== null && bet > 0)
			{
				currencyHelper.currency.reduce(message.author.id, bet)
				message.reply(bet+" credits have been removed from your account!")
			}
			collector.stop()
		}

		function playerTies() {
			collector.stop()
		}

		async function displayHand(hand, text, callback) {
      console.log("display hand sart")
			handimg = []
			for (let id in hand)
			{
				handimg.push("./images/cards/"+hand[id][0]+"_of_"+hand[id][1].toLowerCase().trim()+".jpg")
			}

			mergeImg(handimg)
		    .then((img) => {
		      // Save image as file          
			    //img.write('./images/cards/hand.png', function(){
          img.getBuffer(Jimp.AUTO, (err, buffer) => {
			
					message.reply(text, {
					  	files: [{
					    //attachment: "./images/cards/hand.png",
               attachment: buffer,
					    name: 'hand.jpg'
					  	}]

					}).then(console.log("display hand stop")).then(setupCollector()).then(console.log("callback")).then(callback)
				})
			})
		}
    
    async function setupCollector() {
      console.log("collector setup")
      let busy = false
        if (collector != null)
            collector.stop()
        if (end != true)
        {
            date =  Date.now()
            collector = message.channel.createMessageCollector(filter, { time: 60000 });
        }
        collector.on('collect', m => {          
            console.log("Date:"+date)
            console.log("created at:"+m.createdTimestamp)
            console.log(m.createdTimestamp > date+1000)
            console.log("Message: "+m)
            if (m == 1 && !busy && m.createdTimestamp > date+1000)
	            {
	                busy = true
	                let new_card = deck.pop()
	                //message.channel.send("You draw: ["+ new_card+"]")
	                message.channel.send("You draw: ",{
						  	files: [{
						    attachment: "./images/cards/"+new_card[0]+"_of_"+new_card[1].toLowerCase().trim()+".jpg",
						    name: 'hand.jpg'
						  	}]
						}).then(function(){
			                hand.push(new_card)
			             	displayPlayerDraw(console.log("player draw")).then(function(){
			             		if (handValue(hand)[1] < 21)
			             		busy = false
			             	})
			             })
	                
	            }
            else if (m == 0 && m.createdTimestamp > date+1000) 
            {
               	end = true
                displayDealerDraw() 
            }
            else if (m == 2 && m.createdTimestamp > date+1000 && bet < balance-2)
            {
            	 if (bet*2 > balance)
            	 	message.reply("Not enough credits!")
            	 else
            	 {
            	 	bet = bet*2
            	 	doubledown = true
            	 let new_card = deck.pop()
	                //message.channel.send("You draw: ["+ new_card+"]")
	                message.channel.send("You draw: ",{
						  	files: [{
						    attachment: "./images/cards/"+new_card[0]+"_of_"+new_card[1].toLowerCase().trim()+".jpg",
						    name: 'hand.jpg'
						  	}]
						}).then(function(){
			                hand.push(new_card)
			             	displayPlayerDraw(console.log("player draw")).then(function(){
                    })
			             })
					}
            }
            else if (m.content == "end")
            {
            	message.reply("You gave up so the game has ended with your loss.")
            	playerLoses()
            }
            
        })

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
            console.log("End?"+end)
                       
            	
        }) 
    }

    },

    
};