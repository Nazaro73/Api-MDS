const {DataTypes}= require('sequelize');
const sequelize = require('./bdd/sequelize');

const User = sequelize.define('user',{
    email:{
        type:DataTypes.TEXT,
    },
    display_name:{
        type:DataTypes.TEXT,
    },
    password:{
        type:DataTypes.TEXT,
    }
})



module.exports = User;