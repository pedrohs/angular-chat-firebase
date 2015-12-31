var express = require('express');
var path = require('path');

var app = express();

app.use(express.static('assets'));

app.get('/', function(req, res){
	res.sendFile('index.html', {root: path.join(__dirname)});
});

var port = Number(process.env.PORT || 3000);

app.listen(port);