const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        const { commands } = message.client;
        const data = [];
        let userstr = "\`"
        let modstr = "\`"

        if (!args.length) {
          data.push('Here\'s a list of all my commands: \n');
          data.push("**User Commands: **")
          commands.map(command =>{
              if(!command.adminOnly && !command.modOnly && command.name != "undefined")
              userstr+= command.name+", "
              userstr=userstr.replace(/( )?undefined(,)?/g,"")

          })
          userstr = userstr.substring(0, userstr.length - 2);
          userstr+="\`"
          data.push(userstr)

          data.push("\n**Mod Commands: **")
          commands.map(command =>{
              if(!command.adminOnly && command.modOnly)
              modstr+= command.name+", "

          })
          modstr = modstr.substring(0, modstr.length - 2);
          modstr+="\`"
          data.push(modstr)

          data.push(` \nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
          data.push("\n\nFor questions, bug reports, feature requests or just general feedback please feel free to contact me on Discord: <@155038103281729536>!")
          data.push("\nSpecial thanks to the people contributing to this project listed here: https://goo.gl/prihtA")
        }
        else {
          let aliascheck = false
          let command
         commands.forEach(function(id) {
               
                for (let value in id['aliases'])
                {
                  if (id['aliases'][value] == args[0])
                  {
                  aliascheck = true
                  command = id['name']
                  }
                }
          })

          if (!commands.has(args[0]) && aliascheck == false) {
          return message.reply('that\'s not a valid command!');
          }
          console.log(command)

          if(!aliascheck)
            command = commands.get(args[0]);
          else
            command = commands.get(command)

          data.push(`\n**Name:** \t\t\t\t\`${command.name}\``);

          if (command.description) data.push(`**Description:**  \t\`${command.description}\``);
          if (command.aliases) data.push(`**Aliases:**  \t\t\t\`${command.aliases.join(', ')}\``);
          if (command.usage) data.push(`**Usage:**\t\t\t\t\`${prefix}${command.name} ${command.usage}\``);

          data.push(`**Cooldown:** \t\t\`${command.cooldown || 3} second(s)\``);
        }
        message.reply(data, { split: true })
        .then(() => {
         
           
        })
        .catch(() => message.reply('it seems like I can\'t DM you!'));
    },
};