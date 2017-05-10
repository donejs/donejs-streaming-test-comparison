(function(){
	"use strict";
	console.time("render");

	var view = can.stache(`
		<ul>
			{{#each items}}
				<li>{{name}}</li>
			{{/each}}
		</ul>
	`);

	var Item = can.DefineList.extend({
	});

	Item.List = can.DefineList.extend({});

	var VM = can.DefineList.extend({
		items: {
			Value: Item.List
		}
	});

	var vm = new VM();

	fetch("/items", {
		credentials: "same-origin"	
	}).then(function(response){
		var reader = response.body.getReader();
		var decoder = new TextDecoder();

		function read() {
			return reader.read().then(function(result){
				var resultValue = result.value || new Uint8Array;
				var chunk = decoder.decode(resultValue);

				chunk.split("\n").forEach(function(itemStr){
					if(itemStr.length) {
						var item = JSON.parse(itemStr);
						vm.items.push(item);
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

	var frag = view(vm);
	document.querySelector("main").appendChild(frag);
})();
