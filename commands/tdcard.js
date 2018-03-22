const helper = require('../helpers.js');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

module.exports = {
    args: true,
    name: 'tdcard',
    description: 'Returns a Theater Days card.',
    usage: '<name><optional: id, rarity, type>',
    execute(message, args) {


        helper.data.readSpreadsheet("146vKsT5WoNeE4fO68kGNpng1KnqnBYjENe_rZpHSVvc", "cards", "CardList!A:Z");

        var cards = []

        const fs = require('fs');

        let rawdata = fs.readFileSync('./cards.json');  
        let obj = JSON.parse(rawdata);  

        var query = message.content;
        query = query.toLowerCase()
        query = query.replace(prefix+this.name+" ", "");

        var availability;
        var rarity;
        var digit = 1;
        var name;

        */ THIS IS FOR THE BANNER FUNCTION!!!
        var arr = []
        
        for (id in obj['objects'])
        {
            if (obj['objects'][id]['Start Date'] != 'undefined')
                arr.push(obj['objects'][id])
        }
        console.log(arr.length)


        arr.sort(function(a, b) {
        var dateA = new Date(a['Release Date']), dateB = new Date(b['Release Date']);
        return dateA - dateB;
        });

        for (let i=0;i<arr.length;i++)
        {
            console.log(arr[i]['Start Date'])
        }
       */
       
        var re = /( )?lim(ited)?( )?/
        var limited = query.search(re);
        if (limited != -1)
        {
            availability = "Limited"
            query = query.replace(re, "");
        }

        re = /( )?perm(a(nent)?)?( )?/
        var perm = query.search(re);
        if ( perm != -1)
        {
            availability = "Permanent"
            query = query.replace(re, "");
        }

        re = /( )?(mil(l)?i)?fes(t)?( )?/
        var fes = query.search(re)
        if (fes != -1)
        {
            availability = "Millifes"
            query = query.replace(re, "");
        }

        re = /()?event()?/
        var event = query.search(re)
         if (event != -1)
        {
            availability = "Event"
            query = query.replace(re, "");
        }

        re = /( )?(ps)?tour( )?/
        var tour = query.search(re)
        if (tour != -1)
        {
            availability = "Event (PS Tour)"
            query = query.replace(re, "");
        }

        re = /( )?(ps)?theater( )?/
        var theater = query.search(re)
        if (theater != -1)
        {
            availability = "Event (PST)"
            query = query.replace(re, "");
        }

        re = /( )?pst( )?/
        var pst = query.search(re)
        if (pst != -1)
        {
            availability = "PST"
            query = query.replace(re, "");
        }

        re = /( )?(mil(l)?i)?colle( )?/
        var colle = query.search(re)
        if ( colle != -1)
        {
            availability = "Event (MilliColle)"
            query = query.replace(re, "");
        }

        re = /( )?\br\b( )?/
        var rare = query.search(re)
        if (rare != -1)
        {
           rarity = "R"
            query = query.replace(re, "");
        }

        re = /()?sr()?/
        var sr = query.search(re)
        if (sr != -1)
        {
           rarity = "SR"
            query = query.replace(re, "");
        }

        re = /( )?\bssr\b( )?/
        var ssr = query.search(re)
        if (ssr != -1)
        {
           rarity = "SSR"
           query = query.replace(re, "");
        }

        re = /\d/
        digit = parseInt(query.match(re));
        console.log("Digit: "+digit)
        if (digit == null || isNaN(digit))
        {
            digit = 0;
        }
        else
        {
            query = query.replace(re, "");
        }

        var splitQuery = []
       

        

        for (var ID in obj['objects'])
        {
            splitQuery = obj['objects'][ID]['Name'].split(" ");
            
            if (splitQuery[1] == undefined || splitQuery[1] == null)
                splitQuery[1] = splitQuery[0];
            
            if (query.split(" ").length == 1)
            {
                if (query.includes(splitQuery[0].toLowerCase()) || query.includes(splitQuery[1].toLowerCase())) 
                {
                    cards.push(obj['objects'][ID]);
                }
            }
            else 
            {
                if (query.includes(splitQuery[0].toLowerCase()) && query.includes(splitQuery[1].toLowerCase())) 
                {
                    cards.push(obj['objects'][ID]);
                }
            }

           
        }
        
        var temp = []
        if (rarity != undefined)
        {
            for (let row in cards)
            {
                if (cards[row]["Rarity"] == rarity)
                temp.push(cards[row])
            }
            cards = temp;
            temp = [];
        }
        temp = []
        if (availability != undefined)
        {
            for (let row in cards)
            {
                if (cards[row]["Availability"] == availability)
                temp.push(cards[row])
            

                if (availability == "Event")
                {
                    if (cards[row]["Availability"].includes(availability))
                    {
                       temp.push(cards[row])
                    }
                }

                if (availability == "PST")
                {
                    if (cards[row]["Availability"] == "Event (PST)" || cards[row]["Availability"] == "Event (PS Tour)")
                    {    
                        temp.push(cards[row])
                    }
                }
            }
            cards = temp;
            temp = [];
        }

        if (Object.keys(cards).length == 0)
        {
            message.reply("No data found matching your query!");
            return;
        }
          
        const embed1 = new Discord.RichEmbed()

        .setColor("#b5b1e1")

        .setImage("http://imas.gamedbs.jp/mlth/image/card/icon/" + cards[digit]['Icon Filename'] + ".png")

        .setTimestamp()
        .setTitle(`[${cards[digit]["Rarity"]}] "${cards[digit]["Title"]}" ${cards[digit]["Name"]}`)
        .addField("Max Stats: ", "**Li/Da/Vo/Vi (Total)**\n" + `${cards[digit]['Life']} / ${cards[digit]['Max Dance']} / ${cards[digit]['Max Vocal']} / ${cards[digit]['Max Visual']} **(${cards[digit]['Total']})**`, true)
        .addField("Master Stats: ", "**Li/Da/Vo/Vi (Total)**\n" + `${cards[digit]['Life']} / ${cards[digit]['Master Dance']} / ${cards[digit]['Master Vocal']} / ${cards[digit]['Master Visual']} **(${cards[digit]['Master Total']})**`, true)
        
        .addField("Skill: " + cards[digit]['Skill Type'], cards[digit]['Skill'], false)
        .addField("Leader Skill: ", cards[digit]['Center Skill'], true)
        .addBlankField()
        message.channel.send(embed1);
        
        if (Object.keys(cards).length > 1)
        {
            var str = "";
            var count = 0;
            for (let card in cards)
            {
                if (card != digit)
                {
                   str+= `[${cards[card]["Rarity"]}] ${cards[card]["Title"]} **${count}**\n`
                }
                count++
            }
                        
            const embed2 = new Discord.RichEmbed()

            .setColor("#b5b1e1")
            .addField("Other cards which match this query: ", str)
            message.channel.send(embed2);

        }
  

      
    },
};