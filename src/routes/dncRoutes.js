var express = require('express');
var dncRouter = express.Router();
var mySql = require('mysql');

var viciConnection = mySql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'asterisk',
    debug: false
    });
var apiPass = '';

dncRouter.get('/dnc', function(req,res){
    var phoneNumber = req.query.phone_number;
    var apiKey = req.query.api_key;
    if (apiKey != apiPass)
    {
        res.json({"Inserted":"false", "reason":"Invalid API Key"})
        return;
    }
    if ((phoneNumber.length > 11 || phoneNumber.length < 10))
    {
        res.json({"Inserted":"false", "reason":"Phone Number not 10 or 11 Digits"})
        return;
    }
    viciConnection.getConnection(function (err, connection) {
        if (err) {           
            res.json({ 
                "code": 100, "status": "Error connecting to database"})
                
        };
        var query = "INSERT INTO vicidial_dnc VALUES (" + phoneNumber + ')';
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

    .post('/dnc', function (req, res) {
    var phoneNumber = req.query.phone_number;
    var apiKey = req.query.api_key;
     if (apiKey != apiPass)
    {
        res.json({"Inserted":"false", "reason":"Invalid API Key"})
        return;
    }
    if ((phoneNumber.length > 11 || phoneNumber.length < 10))
    {
        res.json({"Inserted":"false", "reason":"Phone Number not 10 or 11 Digits"})
        return;
    }
    viciConnection.getConnection(function (err, connection) {
        if (err) {           
            res.json({ 
                "code": 100, "status": "Error connecting to database" 
            });
        };
        var query = "INSERT INTO vicidial_dnc VALUES (" + phoneNumber + ')';
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
    var apiKey = req.query.api_key;
     if (apiKey != apiPass)
    {
        res.json({"Inserted":"false", "reason":"Invalid API Key"})
        return;
    }
    if ((phoneNumber.length > 11 || phoneNumber.length < 10))
    {
        res.json({"Inserted":"false", "reason":"Phone Number not 10 or 11 Digits"})
        return;
    }
    viciConnection.getConnection(function (err, connection){
      if (err) {
            
            res.json({ 
                "code": 100, "status": "Error connecting to database" 
            });
        };
        var query = "DELETE FROM vicidial_dnc where phone_number = '" + phoneNumber + "'";
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
