var express = require('express');
var dncRouter = express.Router();
var mySql = require('mysql');

var viciConnection = mySql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'cron',
    password: '',
    database: 'asterisk',
    debug: false
    });

dncRouter.get('/', function(req,res){
    res.send("Nothing Here");
})
dncRouter.post('/dnc', function (req, res) {
    var phoneNumber = req.query.phone_number;
    viciConnection.getConnection(function (err, connection) {
        if (err) {           
            res.json({ 
                "code": 100, "status": "Error connecting to database" 
            });
        };
        var query = "insert into vicidial_dnc VALUES (" + phoneNumber + ')';
        connection.query(query, function (err, rows,fields) {
             if (!err) {
                res.json({ 
                    "Inserted": "true", "phoneNumber": phoneNumber
                });
            }
            else{
                res.json({"Inserted":"false", "phoneNumber":phoneNumber,"reason":err});
            }
        });
        connection.on('error', function (err) {
           
            res.json({ 
                "code": 100, "status": "Error Connecting to database" 
            });
           
        });
        connection.release();
    }); 
})

    .delete('/dnc', function(req,res){
    var phoneNumber = req.query.phone_number;
    viciConnection.getConnection(function (err, connection){
      if (err) {
            
            res.json({ 
                "code": 100, "status": "Error connecting to database" 
            });
        };
        var query = "DELETE from vicidial_dnc where phone_number = '" + phoneNumber + "'";
        connection.query(query, function (err, rows) {
           
             if(rows.affectedRows == 0)
            {
                res.send(phoneNumber + " is not currently in the DNC")
                return;
            }
            if (!err) {
                res.json({ 
                    "Deleted": "true", "phoneNumber": phoneNumber 
                });
                return;
            }           
            else{
                res.send(err);
            }
        });
        connection.on('error', function (err) {
            
            res.json({ 
                "code": 100, "status": "Error Connecting to database" 
            });

        });
        connection.release();
    });        
});


module.exports = dncRouter;     
