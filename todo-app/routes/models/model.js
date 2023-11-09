const sequelize = require('./bdd/sequelize');
const Task = require ('./Task');
const User = require ('./user');


User.hasMany(Task);
Task.belongsTo(User);



module.exports = {
    User,
    Task
}