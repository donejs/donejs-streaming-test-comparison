var api = require("../api");
var fs = require("fs");
var hbs = require("handlebars");
var spaView = hbs.compile(fs.readFileSync(__dirname + "/spa.handlebars", "utf8"));
var through = require("through2");

module.exports = function(req, res){
	res.writeHead(200);

	var canAll = res.push("/can.all.js", {
		status: 200,
		method: "GET",
		request: { accept: "*/*" },
		response: {
			"content-type": "application/javascript"
		}
	});
	fs.createReadStream(__dirname + "/../../public/can.all.js").pipe(canAll);

	var appStream = res.push("/app.js", {
		status: 200,
		method: "GET",
		request: { accept: "*/*" },
		response: {
			"content-type": "application/javascript"
		}
	});
	fs.createReadStream(__dirname + "/../../public/app.js").pipe(appStream);

	var apiStream = res.push("/items", {
		status: 200,
		method: "GET",
		request: { accept: "*/*" },
		response: {
			"content-type": "application/javascript"
		}
	});

	api.getItems().pipe(through.obj(function(item, enc, next){
		var data = JSON.stringify(item);
		apiStream.write(data + "\n");
		next();
	}, function(){
		apiStream.end();
	}))
	.on("error", function(err){
		console.log("Push error", err);
	});

	res.write(spaView({}));
	res.end();
};
