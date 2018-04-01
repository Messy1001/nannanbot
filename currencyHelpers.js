
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Users = sequelize.import("./models/Users")

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
		
    defineGet: function defineGet(currency){
    		console.log("Defining Get currency")
    		Reflect.defineProperty(currency, 'getBalance', {
    			value: function getBalance(id) {
			        const user = currency.get(id);
			        return user ? user.balance : 0;
   				 },
			});

    }
};

exports.data = methods;

