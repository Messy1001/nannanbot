module.exports = {
    usage: "<@user>",
    name: 'avatar',
    description: 'Shows the link to a user\'s avatar.',
    cooldown: 15,
    aliases: ['icon', 'pfp', 'av'],
    execute(message, args) {
        if (!message.mentions.users.size) {
        return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
    }
    else if (message.mentions.users.size) {
      const taggedUser = message.mentions.users.first();
      message.channel.send(`${taggedUser.username}'s avatar: ${taggedUser.displayAvatarURL}`);
    }

    },
};