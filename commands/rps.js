module.exports = {
    args: true,
    name: 'rps',
    description: 'Rock, Paper, Scissors',
    execute(message, args) {
       
        var items = Array("rock", "paper", "scissors");

		var item = items[Math.floor(Math.random()*items.length)];

		console.log("Yes");
		console.log("Item: " + item);

		if (args[0] != "rock" && args[0] != "paper" && args[0] != "scissors")
		{
			message.channel.send('Please pick either Rock, Paper or scissors!');
		}

		else if (args[0] === item)
		{
			message.channel.send('We both picked ' +item+ ' and tied!');
		}

		else if (args[0] === "rock" && item === "scissors" || args[0] === "scissors" && item === "paper" || args[0] === "paper" && item === "rock")
		{
			message.channel.send('I picked ' +item+ ' and lost!');
		}

		else if (args[0] === "rock" && item === "paper" || args[0] === "scissors" && item === "rock" || args[0] === "paper" && item === "scissors")
		{
			message.channel.send('I picked ' +item+ ' and won!');
		}


    },
};