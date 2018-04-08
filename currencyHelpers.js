
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Discord = require('discord.js');
const Users = sequelize.import("./models/Users")

const currency = new Discord.Collection();

Reflect.defineProperty(currency, 'add', {
	    		value: async function add(id, amount) {
		        	const user = currency.get(id);
		        	if (user) {
		        		if (user.balance < 0)
		        			user.balance = 0
			            user.balance += Number(amount);
                  		user.balance = Math.ceil(user.balance)
			            return user.save();
		        	}
		        	const newUser = Users.create({ user_id: id, balance: amount });
		        	currency.set(id, newUser);
		        	return newUser;
	    		},
			});

Reflect.defineProperty(currency, 'reduce', {
	    		value: async function add(id, amount) {
		        	const user = currency.get(id);
		        	if (user) {
			            user.balance -= Number(amount);
			            return user.save();
		        	}
		        	const newUser = Users.create({ user_id: id, balance: amount });
		        	currency.set(id, newUser);
		        	return newUser;
	    		},
			});

Reflect.defineProperty(currency, 'getBalance', {
    			value: function getBalance(id) {
			        const user = currency.get(id);
			        return user ? user.balance : 0;
   				 },
			});

exports.currency = currency;

