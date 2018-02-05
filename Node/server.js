let http = require('http');
let fs = require('fs');

let url = require('url');

let server = http.createServer();

server.on('request',function(request,response){


	let query = url.parse(request.url, true).query


	fs.readFile('index.html', (err,data)=>{
		if(err) throw err

		response.writeHead(200,{
		'Content-type': 'text/html; charset=utf-8'
		})

		response.end(data)
	});


})

server.listen(8080)