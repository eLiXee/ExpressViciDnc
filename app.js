var express = require('express');
var app = express();
var port = 5000;

var dncRouter = require('./src/routes/dncRoutes');
app.get('/', function (req, res) {
    res.send('Nothing here')
});

app.get('/dnc', dncRouter);

app.listen(port, function (err) {
    console.log('Vici Api running on port ' + port);
})