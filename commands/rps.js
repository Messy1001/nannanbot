module.exports = {
    args: true,
    usage: "<option>",
    name: 'rps',
    description: 'Rock, Paper, Scissors',
    cooldown: 5,
    execute(message, args) {
       
        var items = Array("rock", "paper", "scissors");

		var item = items[Math.floor(Math.random()*items.length)];
		var emoji;
		args[0] = args[0].toLowerCase();

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

		if (args[0] != "rock" && args[0] != "paper" && args[0] != "scissors")
		{
			message.channel.send('Please pick either Rock, Paper or scissors!');
		}

		else if (args[0] === item)
		{
			message.channel.send('We both picked ' +emoji+ ' and tied!');
		}

		else if (args[0] === "rock" && item === "scissors" || args[0] === "scissors" && item === "paper" || args[0] === "paper" && item === "rock")
		{
			message.channel.send('I picked ' +emoji+ ' and lost!');
		}

		else if (args[0] === "rock" && item === "paper" || args[0] === "scissors" && item === "rock" || args[0] === "paper" && item === "scissors")
		{
			message.channel.send('I picked ' +emoji+ ' and won!');
		}


    },
};