const helper = require('../../helpers.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.deployeddatabase.sqlite',
});
const Users = sequelize.import("../../models/Users")

module.exports = {
    name: 'getbalance',
    description: "Returns a user's balance!",
    execute(message, args) {
       console.log("hallo")

       let target = message.mentions.users.first() || message.author;
       const storedBalances = Users.find({
       		where: {user_id: target.id}
       })
       .then( user => {

      		return message.reply(`${target.tag} has ${user['balance']} credits.`)
    })
       
    },
};