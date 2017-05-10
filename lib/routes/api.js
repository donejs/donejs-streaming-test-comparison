var api = require("../api");
var through = require("through2");

module.exports = function(req, res){
	api.getItems().pipe(through.obj(function(item, enc, done){
		var data = JSON.stringify(item);
		stream.write(data + "\n");
	}))
	.on("end", function(){
		res.end();
	})
	.on("error", function(err){
		console.error("API error", err);
	});
};
