const { Console } = require('console');
var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');

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

function generateToken(id){
    return jwt.sign({id:id}, process.env.SECRET_TOKEN , {expiresIn: '10h'});

}

router.post('/sign', (req, res) => {
    console.log(req.body.password);

    bcrypt.hash(req.body.password, 12).then(hashedPassword => {
        
        let query = `INSERT INTO users ( email, password, display_name) VALUES ( "${req.body.email}", "${hashedPassword}","${req.body.display_name}") `
        sqlQuery(query, (results) => {

        })
    });
})

router.post('/login', (req, res) => {
    sqlQuery(`SELECT * FROM users WHERE email = "${req.body.email}"`, (results) => {
    if (results.lenght===0){
        res.send("email ou mdp incorresct");

    } ;
    const user= results[0] ;
    
    bcrypt.compare(req.body.password,user.password).then( isOk => {
        if(!isOk){
            res.send("email ou mdp incorresct"); 
        }else{
            delete user.password;
            return res.json({
                'token': generateToken(user.id),
                'user': user,
            });

        }
    
    });
});  
});


router.get('/token', (req, res) => {
    const bearerToken = req.get('Authorization'); // Récupérer le token de l'en-tête de la requête
    const token = bearerToken.split(" ")[1] ;
    console.log(token);
    if (token){
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
            if (err){
                res.send(err);
            }else{
                sqlQuery(`SELECT * FROM users WHERE id = "${decoded.id}"`, (results) => {
                    res.send(results);
                })  
            }       
              
            
      });
    }else{
        res.send("vous n'avez pas de token");
    }
    
})


module.exports = router;