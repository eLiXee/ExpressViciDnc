var express = require('express');
var app = express();
var port = 5000;
var queryString = require('querystring');


var dncRouter = require('./src/routes/dncRoutes');

app.get('/', function (req, res) {
    res.send('Testing')
});
app.get('/dnc', dncRouter);



app.listen(port, function (err) {
    console.log('running server on port ' + port);
})