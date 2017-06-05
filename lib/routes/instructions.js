var api = require("../api");
var crypto = require("crypto");
var fs = require("fs");
var hbs = require("handlebars");
var pageView = hbs.compile(fs.readFileSync(__dirname + "/instructions.handlebars", "utf8"));
var through = require("through2");

module.exports = function(req, res){
	res.writeHead(200);

	var canAll = res.push("/instr.js", {
		status: 200,
		method: "GET",
		request: { accept: "*/*" },
		response: {
			"content-type": "application/javascript"
		}
	});
	fs.createReadStream(__dirname + "/../../public/instr.js").pipe(canAll);

	crypto.randomBytes(48, function(err, buffer) {
		var token = buffer.toString('hex');
		var streamurl = `/instructions/${token}`;

	  	var stream = res.push(streamurl, {
	  		status: 200,
			method: "GET",
	  		request: { accept: "*/*" },
	  		response: {
	  			"content-type": "text/plain"
	  		}
	  	});

		api.getItems().pipe(through.obj(function(item, enc, next){
			var data = JSON.stringify(item);
			stream.write(data + "\n");
			next();
		}, function(){
			stream.end();
		}))
		.on("error", function(err){
	  		console.log("Push error", err);
	  	});

		var canAll = res.push("/can.all.js", {
			status: 200,
			method: "GET",
			request: { accept: "*/*" },
			response: {
				"content-type": "application/javascript"
			}
		});
		fs.createReadStream(__dirname + "/../../public/can.all.js").pipe(canAll);

	  	res.end(pageView({streamurl}));
	});
};
