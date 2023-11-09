const {DataTypes}= require('sequelize');
const sequelize = require('./bdd/sequelize');

const Task = sequelize.define('task', {
    title:{
        type:DataTypes.TEXT,
    },
    due_date:{
        type:DataTypes.DATE,
    },
    done:{
        type:DataTypes.BOOLEAN,
        allowNull: false,
    },
    description:{
        type:DataTypes.TEXT,
    }
    
})

sequelize.sync({alter:true});

module.exports = Task;