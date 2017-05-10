var api = require("../api");
var crypto = require("crypto");
var fs = require("fs");
var hbs = require("handlebars");
var pageView = hbs.compile(fs.readFileSync(__dirname + "/instructions.handlebars", "utf8"));
var through = require("through2");

module.exports = function(req, res){
	crypto.randomBytes(48, function(err, buffer) {
		var token = buffer.toString('hex');
		var streamurl = `/instructions/${token}`;

		res.writeHead(200);

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

	  	res.end(pageView({streamurl}));
	});
};
