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

module.exports = {
    name: 'brawl',
    description: "Starts a brawl over money or just for fun!",
    usage: "<optional: entrance fee>",
    cooldown: 25,
    execute(message, args) {

    let participants = []
    participants.push(message.author.id);
    
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

      if (bet > currencyHelper.currency.getBalance(message.author.id))
          message.reply("You don't have enough credits to start this brawl!")
      else
          message.channel.send(`${message.guild.members.get(message.author.id).nickname} has started a brawl for ${bet} credits\n\nType joinbrawl or jb to enter the brawl!`)

        const filter = m => !(participants.includes(m.author.id))
                var collector
                if (collector == null)
                    collector = message.channel.createMessageCollector(filter, { time: 25000 });

                collector.on('collect', m => {
                    console.log("Message: "+m)
                    if (m.content.toLowerCase() == "joinbrawl" || m.content.toLowerCase() == "jb" && bet < currencyHelper.currency.getBalance(m.author.id))
                    {
                      message.channel.send(`${m.author.username} has entered the brawl!`);
                      participants.push(m.author.id)
                    }
                    else if (m.content.toLowerCase() == "joinbrawl" || m.content.toLowerCase() == "jb" && bet > currencyHelper.currency.getBalance(m.author.id))
                    {
                      message.channel.send(m.author+ "You didn't have enough credits to join!");
                    }
                })

                collector.on('end', collected => {
                   if (participants.length == 1)
                     message.channel.send("No one was brave enough to enter the brawl ...\nMaybe at a later time.")
                   else
                   {
                       if (bet != null)
                       {
                         for (let participantid in participants)
                         {
                            currencyHelper.currency.reduce(participants[participantid], bet)
                         }
                         bet = bet * participants.length
                       }

                       shuffle(participants);
                       sendBattleMessage()
                  }
                   
                });   

        async function sendBattleMessage() {
                console.log("Send battle message")
                let battlemessagessolo = [" landed a fierce blow on $'s head, knocking them out for good!", " hits $ with a kick, taking them out of the battle!", " smacks $ with a backhanded strike leaving them in the dust!", " puts $ in a headlock, choking them out for the remainder of the battle!", " finds an opening in $'s defense and takes them out in a single blow!", " manages to surprise $ with a headbutt, putting them out of comission!", " sweeps $'s legs and takes them quickly out on the ground!", " finishes off $ with a feint attack!", " suprises $ with their agility and drops them with one attack!"];
                let battlemessagesduo = [" gang up on $ and take them out swiftly!", " take turns beating up $ until they are the only ones left standing!", " circle around $ until one of them spots an opening and takes them out with a powerful blow!", "ambush $ while they are looking for an opponent and take them out!", " take out their anger on $ and knock them out cold!"]
                let fighter1;
                let fighter2;
                let defeated;
                let brawlmessage;
                let loops = participants.length
                let count = 0;
                let messagetype = helper.data.getRandomInt(0, 1);

                for (let i = 0; i < loops-1; i++)
                {
                    console.log("delay ...")
                    setTimeout(sendMessage, 2000*i);
                }
                console.log(count)
                
                    async function sendMessage() {

                        
                      console.log("sending ...")
                      console.log("Length:"+participants.length)
                      defeated = message.guild.members.get(participants.pop())
                      fighter1 = message.guild.members.get(participants[helper.data.getRandomInt(0, participants.length-1)])
                      fighter2 = message.guild.members.get(participants[helper.data.getRandomInt(0, participants.length-1)])
                      if (count != loops - 2 && fighter1 != fighter2 && fighter1 != defeated && fighter2 != defeated && messagetype == 0)
                          brawlmessage = fighter1+" and "+fighter2+battlemessagesduo[helper.data.getRandomInt(0, battlemessagesduo.length-1)].replace("\$", defeated)

                      else if (count == loops - 2 || fighter1 == fighter2 || fighter1 == defeated || fighter2 == defeated || messagetype == 1)
                          brawlmessage = fighter1+battlemessagessolo[helper.data.getRandomInt(0, battlemessagessolo.length-1)].replace("\$", defeated)
                      
                      message.channel.send(brawlmessage)
                      count ++
                      if (count == loops-1)
                      {
                        if (bet != null)
                        {
                          delay(3000).then(() => {message.channel.send(`${message.guild.members.get(participants[0])} has won the brawl!\n${bet} credits have been added to your account.`)})
                          currencyHelper.currency.add(participants[0], bet)
                        }
                        else 
                           delay(3000).then(() => {message.channel.send(`${message.guild.members.get(participants[0])} has won the brawl!`)})
                      }
                    }
                }
       

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

       
    },
};