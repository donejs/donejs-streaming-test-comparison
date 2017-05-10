var fs = require("fs");
var path = require("path");
var spdy = require("spdy");
var os = require("os");
var instructionsRoute = require("./routes/instructions");
var spaRoute = require("./routes/spa");

function joinCerts(pth) {
	return path.join(os.homedir(), ".localhost-ssl", pth);
}

var options = {
	key: fs.readFileSync(joinCerts("private.pem")),
	cert: fs.readFileSync(joinCerts("cert.pem")),
	spdy: {
		protocols: ["h2"]
	}
};

var server = spdy.createServer(options, function(req, res){
	if(req.url === '/') {
		res.writeHead(200);
		res.end(`
			<!doctype html>

			<a href="/instructions">Instructions method</a>
			<a href="/spa">Traditional SPA</a>
		`);
		return;
	} else if(/instructions/.test(req.url)) {
		return instructionsRoute(req, res);
	} else if(/spa/.test(req.url)) {
		return spaRoute(req, res);
	}

	res.writeHead(404);
	res.end();

});
server.listen(8088);
console.log(`Now serving https://localhost:8088`);
