var express = require('express');
var dncRouter = express.Router();
var mySql = require('mysql');

dncRouter.get('/dnc', function (req, res) {
    var phoneNumber = req.query.phoneNumber;
    var viciConnection = mySql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'asterisk',
    debug: false
    });

    viciConnection.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({ 
                "code": 100, "status": "Error connecting to database" 
            });
        };
        var query = "insert into dnc_list VALUES (" + phoneNumber + ')';
        connection.query(query, function (err, rows) {
            connection.release();
            if (!err) {
                res.json({ 
                    "Inserted": "true", "phoneNumber": phoneNumber 
                });
            };
        });
        connection.on('error', function (err) {
            connection.release();
            res.json({ 
                "code": 100, "status": "Error Connecting to database" 
            });
        });
    });
});

module.exports = dncRouter;     
