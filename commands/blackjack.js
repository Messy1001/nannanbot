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
    name: 'blackjack',
    description: 'Ping!',
    usage: "<optional: wager>",
    execute(message, args) {
    	
    	let bet = args[0]
    	let balance = currencyHelper.currency.getBalance(message.author.id)
    	if (bet > balance)
    		return message.reply("You tried to bet " +bet+" credits but only have "+balance+"!")

    	
       let rank = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'KING', 'QUEEN', 'JOKER', 'ACE']
       let suits = [' SPADE', ' HEART ', ' DIAMOND', ' CLUB']
       let deck = []
       let hand = []
       let dealerhand = []
       let blackjack

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

       displayPlayerDraw()

       	const filter = m =>m.author.id === message.author.id
        var collector
        if (collector == null)
            collector = message.channel.createMessageCollector(filter, { time: 60000 });

        collector.on('collect', m => {
            console.log("Message: "+m)
            if (m == 1)
            {
                let new_card = deck.pop()
                message.channel.send("You draw: ["+ new_card+"]")
                hand.push(new_card)
             	displayPlayerDraw()
                
            }
            else if (m == 0) 
            {
               	let str = ''
               	str += `Dealer's hand value is **${handValue(dealerhand)[0]}** with these cards: \n`
				for (let id in dealerhand)
				{
					str += `[${dealerhand[id]}] `
				}
				message.channel.send(str)
               	displayDealerDraw() 
            }
            else if (m.content == "end")
                collector.stop()
        })

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        })   

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
			else if (rank == 'ACE')
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
				if (hand[handid][0] == 'ACE')
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

		function displayPlayerDraw() {
			let str = ''
			str += `Your current hand's value is **${handValue(hand)[0]}** with these cards: \n`
			for (let id in hand)
			{
				str += `[${hand[id]}] `
			}
			message.channel.send(str)
			if (handValue(hand)[1] < 21)
				message.channel.send("Do you want to draw another card? ( 1 = draw, 0 = stay)")
			else if (handValue(hand)[1] == 21)
			{
				message.channel.send("Blackjack! **You win!**")
				blackjack = true
				gameEnd()
				playerWins()
			}
			else
			{
				message.channel.send("Bust! **You lose!**")
				gameEnd()
				playerLoses()
			}
		}

		function displayDealerDraw() {
			let new_dealer_card
			let str = ''
			while (handValue(dealerhand)[1] < 17)
			{
				if (handValue(dealerhand)[1] > handValue(hand)[1])
					break
				new_dealer_card = deck.pop()
				message.channel.send("Dealer draws: ["+ new_dealer_card+"]")
					dealerhand.push(new_dealer_card)
			}
			str = ''
			str += `Dealer's hand value is **${handValue(dealerhand)[0]}** with these cards: \n`
			for (let id in dealerhand)
			{
				str += `[${dealerhand[id]}] `
			}

			if (new_dealer_card != null)
				message.channel.send(str)
			
			if (handValue(dealerhand)[1] == handValue(hand)[1] && handValue(dealerhand) < 21)
			{
				message.channel.send("You and the Dealer **tied!**")
				gameEnd()
				playerTies()
			}
			else if (handValue(dealerhand)[1] == 21)
			{
				message.channel.send("The dealer has a blackjack, **you lose!**")
				gameEnd()
				playerLoses()
			}
			else if (handValue(dealerhand)[1] > handValue(hand)[1] && handValue(dealerhand)[1] < 21)
			{
				message.channel.send("The dealer's hand has a higher value than yours, **you lose!**")
				gameEnd()
				playerLoses()
			}
			else if (handValue(dealerhand)[1] < handValue(hand)[1] && handValue(dealerhand)[1] < 21)
			{
				message.channel.send("Your hand has a higher value than the dealer's, **you win!**")
				gameEnd()
				playerWins()
			}
			else
			{
				message.channel.send("The dealer scored a bust, **you win!**")
				gameEnd()
				playerWins()
			}
			
		}

		function gameEnd() {
			console.log("game ends")
			collector.stop()
		}

		function playerWins() {

			if(blackjack)
				bet = bet*1.5
			message.reply(bet+" credits have been added to your account!")
			currencyHelper.currency.add(message.author.id, bet)
		}

		function playerLoses() {

			currencyHelper.currency.reduce(message.author.id, bet)
			message.reply(bet+" credits have been removed from your account!")
		}

		function playerTies() {

		}


    },

    
};