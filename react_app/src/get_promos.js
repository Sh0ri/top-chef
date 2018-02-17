const michelin = require("./michelin.js");
const lafourchette = require("./lafourchette.js");


const pSettle = require('p-settle');
const promisify = require('pify');
const fs = promisify(require('fs'));

do_get();

async function do_get(){
	console.log("begin de do");
	const restaurants_in_lafourchette = await get_michelin_restaurants_in_lafourchette();
	console.log("restaurants done");
	const result = await lafourchette.store_restaurants_on_lafourchette(restaurants_in_lafourchette);
	console.log("save done");
}





function get_michelin_restaurants_in_lafourchette()
{
	return new Promise((resolve, reject) => {
		var michelin_restaurants_in_lafourchette = [];

		restaurants = michelin.get_JSON().map(restaurant => lafourchette.get_restaurant(restaurant));

		pSettle(restaurants).then(result => {
			var compt = 0;
			result.forEach(function(elem){
				if(elem.isFulfilled)
				{
					console.log(elem);
					compt++;
					michelin_restaurants_in_lafourchette.push(elem);
				}
			})
			console.log("number of michelin restaurants available in lafourchette : ");
			console.log(compt);
			resolve(michelin_restaurants_in_lafourchette);
		})
	});
} 

/*
restaurants = michelin.get_JSON().map(restaurant => lafourchette.get_restaurant(restaurant));

pSettle(restaurants).then(result => {
	var compt = 0;
	//console.log(result);
	result.forEach(function(elem){
		if(elem.isFulfilled)
		{
			console.log(elem);
			compt++;
		}
	})
	console.log("")
	console.log(compt);
})

*/



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