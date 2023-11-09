const { Console } = require('console');
var express = require('express');
var router = express.Router();
const fs = require('fs');
const cheminFichier = 'task-example.json';
const mysql = require('mysql');


const pool = mysql.createPool({
    'host': '127.0.0.1',
    'user': 'root',
    'password': '',
    'database': 'tasks'
});

function sqlQuery(query, callback){
  pool.getConnection((connError, connection) => {
      if(connError){
          console.log(connError);
          throw new Error("Connection error " + connError);
      }
      try {
          connection.query(query, (error, result) => {
              if(error){
                  console.log(error);
                  throw new Error("Query error " + error);
              }
              
              callback(result);
          });
      } catch(error){
          throw new Error("Unexpected error occured : " + error);
      }
      connection.release();
  });
}

fs.readFile(cheminFichier, 'utf8', (err, data) => {

    router.get('/', function(req, res, next) {
    let counts = 0;
    let hasNext = false;
    let hasPrev = false;
    let page = parseInt(req.query.page) || 1;
     
    let offset = page * 2 - 2;
    
    let whereclauses= [];  
    

      sqlQuery("SELECT COUNT(*) FROM task ", (results) => {
         counts = results[0]["COUNT(*)"];
         
         if(counts / page >= 2 ){
        sqlQuery(`SELECT * FROM task LIMIT 2 OFFSET ${offset} `, (result) => {
            res.send(result);
          })
         }else{
          res.send(`page inexistantee ${counts}`);
          
         }
      })
    
    });
    
    router.get('/:id_task', async (req, res) => {
        const id_task = parseInt(req.params.id_task);
        
        try {
        sqlQuery(`SELECT * FROM task WHERE id = ${id_task} `, (error,results) => {
          res.send(results);
             })
        }catch(error) {
              res.status(500);
              throw new Error(error);
            }
        
      });

      router.post('/', (req, res) => {
        
        let query =`INSERT INTO task (title, creation_date, due_date, done, description, user_id) VALUES ("${req.body.title}", "${req.body.creation_date}", "${req.body.due_date}","${req.body.done}","${req.body.description}","${req.body.user}") ` 
        console.log(req.body);
        sqlQuery(query, (error,results) => {
          res.json(result);
             })
      });

      router.patch('/:id_task', async (req, res) => {

        const id_task = parseInt(req.params.id_task);
        let query = `UPDATE task SET done = "${req.body.done}" WHERE id_task = "${id_task}"`
        sqlQuery(query, (results) => {
          res.json(result);
        })
      });

      router.delete('/:id', function(req, res, next) {
        let query = `DELETE FROM tasks WHERE id = ${req.params.id}`;
        if(req.params.id !== -1) {
          try {
            sqlQuery(query, (error, result) => {
              res.json(result); 
            })
          }catch(error){
            res.status(error.status)
            throw new Error(error);
          }
        }
      });

});

module.exports = router;
