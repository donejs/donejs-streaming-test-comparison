(function(){
	console.timeStamp("load");
	var ul;
	var streamurl = document.currentScript.dataset["streamurl"];
	function render(chunk){
		var instr = JSON.parse(chunk);
		var li = document.createElement("li");
		li.textContent = instr.name;
		ul.appendChild(li);
	}

	fetch(streamurl, {
		credentials: "same-origin"
	}).then(function(response){
		var reader = response.body.getReader();
		var decoder = new TextDecoder();
		var hasRendered = false;

		function read() {
			return reader.read().then(function(result){
				var resultValue = result.value || new Uint8Array;
				var chunk = decoder.decode(resultValue);

				chunk.split("\n").forEach(function(itemStr){
					if(itemStr.length) {
						if(!hasRendered) {
							hasRendered = true;
							console.time('render');
						}

						render(itemStr);
					}
				});

				if(!result.done) {
					return read();
				}
				console.timeEnd('render');
				console.log("done");
			});
		}

		return read().catch(function(err){
			console.log("An error", err);
		})
	});

	ul = document.createElement("ul");
	document.documentElement.appendChild(ul);

})();
