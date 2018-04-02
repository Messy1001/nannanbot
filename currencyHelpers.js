
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



var methods = {

	defineAdd: function defineAdd(currency){
		   console.log("Defining Add currency")
           Reflect.defineProperty(currency, 'add', {
	    		value: async function add(id, amount) {
		        	const user = currency.get(id);
		        	if (user) {
			            user.balance += Number(amount);
			            return user.save();
		        	}
		        	const newUser = Users.create({ user_id: id, balance: amount });
		        	currency.set(id, newUser);
		        	return newUser;
	    		},
			});
            
        },
		
	defineAdd: function defineReduce(currency){
		   console.log("Defining Add currency")
           Reflect.defineProperty(currency, 'reduce', {
	    		value: async function add(id, amount) {
		        	const user = currency.get(id);
		        	if (user) {
			            user.balance += Number(amount);
			            return user.save();
		        	}
		        	const newUser = Users.create({ user_id: id, balance: amount });
		        	currency.set(id, newUser);
		        	return newUser;
	    		},
			});
            
        },
        	
    defineGet: function defineGet(currency){
    		console.log("Defining Get currency")
    		Reflect.defineProperty(currency, 'getBalance', {
    			value: function getBalance(id) {
			        const user = currency.get(id);
			        return user ? user.balance : 0;
   				 },
			});

    },

    addBalance: function addBalance(userid, amount){
    	const user = Users.findOne({
       		where: {user_id: userid}
       				}).then(user => {
       					user.balance += Number(amount);
			            return user.save();
       				})
    },

    removeBalance: function removeBalance(userid, amount){
    	const user = Users.findOne({
       		where: {user_id: userid}
       				}).then(user => {
       					user.balance -= Number(amount);
			            return user.save();
       				})
    },

};

Reflect.defineProperty(currency, 'add', {
	    		value: async function add(id, amount) {
		        	const user = currency.get(id);
		        	if (user) {
			            user.balance += Number(amount);
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

exports.data = methods;
exports.currency = currency;

