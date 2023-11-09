const dotenv = require('dotenv');
const { Console } = require('console');
var express = require('express');
var router = express.Router();

const Task = require('./models/Task');




    router.get('/', function(req, res, next) {
     
        Task.findAll().then(task => {
            res.json(task);
        });

        

    });
    
    router.get('/tasks/:taskId', async (req, res) => {
        try {
          const taskId = req.params.taskId;
      
          // Recherchez la tâche par ID dans la base de données
          const task = await Task.findByPk(taskId);
      
          if (!task) {
            res.status(404).json({ error: 'Tâche non trouvée' });
            return;
          }
      
          // Réponse avec la tâche trouvée
          res.status(200).json(task);
        } catch (error) {
          console.error('Erreur lors de la récupération de la tâche par ID :', error);
          res.status(500).json({ error: 'Erreur lors de la récupération de la tâche' });
        }
    });

    router.post('/post', async (req, res) => {
        
            try {
              const { title, email, due_date, done, description} = req.body;
          
              // Créez une nouvelle tâche dans la base de données
              const task = await Task.create({
                title,
                email,
                due_date,
                done,
                description,
              });

              
          
              // Réponse avec la tâche créée
              res.status(201).json(task);
            } catch (error) {
              console.error('Erreur lors de la création de la tâche :', error);
              res.status(500).json({ error: 'Erreur lors de la création de la tâche' });
            }
    });
        
      
    router.patch('/tasks/:taskId',async function(req, res) {
            try {
                const task = await Task.findByPk(req.params.taskId);
                if (!task) {
                    res.status(404).json({ error: 'Tâche non trouvée' });
                    return;
                  }
                await task.update(req.body);
                res.json({message: 'Task updated'});
            } catch (exception) {
                console.error(exception);
            }
    });
      
      
    router.delete('/tasks/:taskId', async function(req, res) {
        try {
          const taskId = req.params.taskId;
          const task = await Task.findByPk(taskId);
      
          if (!task) {
            res.status(404).json({ error: 'Tâche non trouvée' });
            return;
          }
      
          await task.destroy();
          res.json({ message: 'Task deleted' });
        } catch (exception) {
          console.error(exception);
          res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
        }
    });



module.exports = router;
