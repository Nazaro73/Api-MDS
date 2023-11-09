const { Console } = require('console');
var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/user');



function generateToken(id) {
    return jwt.sign({ id: id }, process.env.SECRET_TOKEN, { expiresIn: '10h' });

}

router.post('/sign', async (req, res) => {
    
   

    bcrypt.hash(req.body.password, 12).then(hashedPassword => {

        try {
            const { email,  display_name} = req.body;
            
             // Créez une nouvelle tâche dans la base de données
            const user = User.create({              
            email,
            display_name,
            hashedPassword,
            });
            
        
            // Réponse avec la tâche créée
            res.status(201).json(user);
          } catch (error) {
            console.error('Erreur lors du sign :', error);
            res.status(500).json({ error: 'Erreur lors de la création du compte' });
          }
    });
})



router.post('/login', async (req, res) => {

    const user = await User.findAll({
        where: {
            email : req.body.email 
        }
    });

    console.log(user);


    
        if (user.lenght === 0) {
            res.send("email ou mdp incorresct");

        };
        const users = user[0];

        bcrypt.compare(req.body.password, user.password).then(isOk => {
            if (!isOk) {
                res.send("email ou mdp incorresct");
            } else {
                delete users.password;
                return res.json({
                    'token': generateToken(users.id),
                    'user': users,
                });

            }

        });
    });



router.get('/token', (req, res) => {
    const bearerToken = req.get('Authorization'); // Récupérer le token de l'en-tête de la requête
    const token = bearerToken.split(" ")[1];
    console.log(token);
    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
            if (err) {
                res.send(err);
            } else {
                sqlQuery(`SELECT * FROM users WHERE id = "${decoded.id}"`, (results) => {
                    res.send(results);
                })
            }


        });
    } else {
        res.send("vous n'avez pas de token");
    }

})


module.exports = router;