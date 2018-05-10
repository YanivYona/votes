var vote = require('./votes');
var http = require('http');
var fs = require('fs');
var v = vote("Animals", ['fish', 'lion', 'tiger', 'dog']);
v.doVote('lion');
v.doVote('dog');
v.doVote('fish');
v.doVote('lion');
v.doVote('tiger');

http.createServer( (request, response) => {
    console.log(`A user made a request ${request.url} \n`);
    fs.readFile('message.txt', 'utf8', function(err, data) {
        if (err) throw err;
        response.writeHead(200, {'Context-Type': 'text/plain'});
        response.write(data.toString());
        response.end();
        v.deleteFile();
    });

}).listen(8080);
console.log('Server is now running...\n');
