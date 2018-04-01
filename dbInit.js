const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '.data.database.sqlite',
});

const Servers = sequelize.import('models/Servers');
const BotChannels = sequelize.import('models/BotChannels');
const RenameChannels = sequelize.import('models/RenameChannels');
const Users = sequelize.import('models/Users');

Servers.hasMany(BotChannels, {foreignKey: {field: 'server_id'}, onDelete: 'cascade'});
BotChannels.belongsTo(Servers, {foreignKey: {field: 'server_id'}, onDelete: 'cascade'});
Servers.hasMany(RenameChannels, {foreignKey: {field: 'server_id'}, onDelete: 'cascade'});
RenameChannels.belongsTo(Servers, {foreignKey: {field: 'server_id'}, onDelete: 'cascade'});

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {

    console.log('Database synced');
    sequelize.close();

}).catch(console.error);