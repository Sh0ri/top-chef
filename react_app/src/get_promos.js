const michelin = require("./michelin.js");
const lafourchette = require("./lafourchette.js");


const pSettle = require('p-settle');
const promisify = require('pify');
const fs = promisify(require('fs'));





restaurants = michelin.get_JSON().map(restaurant => lafourchette.get_restaurant(restaurant));

pSettle(restaurants).then(result => {
	var compt = 0;
	//console.log(result);
	result.forEach(function(elem){
		if(elem.isRejected)
		{
			console.log(elem);
			compt++;
		}
	})
console.log(compt);
})





/*

var restaurants_with_promos = [];
var restaurants_on_lafourchette = [];


restaurants.forEach(function(restaurant){
	lafourchette.get_restaurant(restaurant,function(maybe_restaurants){
		maybe_restaurants.forEach(function(resto){
			console.log(resto);
		})
	});
})


async function do(restaurants){
	await restaurants.forEach()
}

promise all map
p-map
p

*/