var Readable = require("stream").Readable;

exports.getItems = function(){
	var items = this.items = [];
	for(var i = 0; i < 100; i++) {
		items.push({name: `Item ${i}`});
	}

	var cnt = 0;

	return new Readable({
		objectMode: true,
		read() {
			if(!items.length) {
				this.push(null);
			} else {
				setTimeout(function(){
					this.push(items.shift());
				}.bind(this), 10);
			}
		}
	});
};
