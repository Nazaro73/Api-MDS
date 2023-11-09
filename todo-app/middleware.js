const { Console } = require('console');
var express = require('express');
var router = express.Router();
const jwt= require('jsonwebtoken');
const mysql = require('mysql');
const pool = mysql.createPool({
    'host': '127.0.0.1',
    'user': 'root',
    'password': '',
    'database': 'tasks'
});

function sqlQuery(query, callback) {
    pool.getConnection((connError, connection) => {
        if (connError) {
            console.log(connError);
            throw new Error("Connection error " + connError);
        }
        try {
            connection.query(query, (error, result) => {
                if (error) {
                    console.log(error);
                    throw new Error("Query error " + error);
                }

                callback(result);
            });
        } catch (error) {
            throw new Error("Unexpected error occured : " + error);
        }
        connection.release();
    });
}

function testMiddleware( req, res, next){
    const bearerToken = req.get('Authorization'); // Récupérer le token de l'en-tête de la requête
    const token = bearerToken.split(" ")[1] ;
    
    if (token){
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
            if (err){
                return err;
            }else{
                sqlQuery(`SELECT * FROM users WHERE id = "${decoded.id}"`, (results) => {
                    return results[0]["id"];
                })  
            }       
              
            
      });
    }else{
        console.log("vous n'avez pas de token");
    }
}

module.exports = {
    'testMiddleware': testMiddleware,
};