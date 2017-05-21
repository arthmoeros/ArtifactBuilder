var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/src'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

//app.use(app.router);
app.use(function(request, response) {
  response.sendFile(__dirname + '/src/index.html');
});

app.listen(app.get('port'), function() {
  console.log('Artifacter is running on port', app.get('port'));
});
