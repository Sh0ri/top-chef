const michelin = require("./michelin.js");
const lafourchette = require("./lafourchette.js");


const pSettle = require('p-settle');
const promisify = require('pify');
const fs = promisify(require('fs'));


//const express = require('express');
///////////////////////////////////////////////////////////////////EXPRESS///////////////////////////////////////////////////////////////////////////

/*
const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
  console.log("API CALLED");
  //store_offers();
});

app.get('/api/store_offers', (req, res) => {
  res.send(store_michelin_restaurants());
  console.log("STORE MICHELIN RESTO");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
*/

///////////////////////////////////////////////////////////////////TEST//////////////////////////////////////////////////////////////////////////////

//uncomment the good action
//store_michelin_restaurants();
//store_michelin_restaurants_available_in_lafourchette();
//store_restaurants_with_offers();
//store_offers();
test();


/////////////////////////////////////////////////////////////////FUNCTIONS///////////////////////////////////////////////////////////////////////////

async function test(){
	const testo = await store_offers();
	console.log("THIS IS THE RESULT");
	console.log(testo);
}

async function store_michelin_restaurants(){
	const result = await michelin.scrape_michelin();
	console.log("save done");
	return { express: 'Hello From Express' };
}

async function store_michelin_restaurants_available_in_lafourchette(){
	const restaurants_in_lafourchette = await get_michelin_restaurants_in_lafourchette();
	const result = await lafourchette.store_restaurants_on_lafourchette(restaurants_in_lafourchette);
	console.log("save done");
}

async function store_restaurants_with_offers(){
	const restaurants_with_offers = await get_restaurants_with_offers();
	const result = await lafourchette.store_restaurants_with_offers(restaurants_with_offers);
	console.log("save done");
}

async function store_offers(){
	const offers = await get_offers();
	const result = await lafourchette.store_offers(offers);
	console.log("save done");
	return new Promise((resolve, reject) => {
		pSettle(offers).then(result => {
			console.log('ok');
		});
		resolve(offers);
	});

}

async function get_stored_offers(){
	var obj = JSON.parse(fs.readFileSync('offers.json'));
	return obj;
}

function get_michelin_restaurants_in_lafourchette(){
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
					michelin_restaurants_in_lafourchette.push(elem.value);
				}
			})
			console.log("number of michelin restaurants available in lafourchette : ");
			console.log(compt);
			resolve(michelin_restaurants_in_lafourchette);
		})
	});
} 

function get_restaurants_with_offers(){
	return new Promise((resolve, reject) => {
		var restaurants_with_offers = [];

		var restaurants_in_lafourchette = lafourchette.get_stored_restaurants_on_lafourchette().map(restaurant => lafourchette.check_if_offers(restaurant));

		pSettle(restaurants_in_lafourchette).then(result => {
			var compteur = 0;
			result.forEach(function(elem){
				if(elem.isFulfilled)
				{
					console.log(elem);
					compteur++;
					restaurants_with_offers.push(elem.value);
				}
			})
			console.log("number of restaurants with offers : ");
			console.log(compteur);
			resolve(restaurants_with_offers);
		})
	});
}

function get_offers(){
	return new Promise((resolve, reject) => {
		var offers = [];

		var restaurants_with_offers = lafourchette.get_stored_restaurants_with_offers().map(restaurant => lafourchette.get_offers(restaurant));

		pSettle(restaurants_with_offers).then(result => {
			var compteur = 0;
			result.forEach(function(elem){
				if(elem.isFulfilled)
				{
					//console.log(elem);
					compteur++;
					offers.push(elem.value);
				}
			})
			console.log("number offers : ");
			console.log(compteur);
			resolve(offers);
		})
	});
}

module.exports = {
	store_michelin_restaurants_available_in_lafourchette : store_michelin_restaurants_available_in_lafourchette,
	store_restaurants_with_offers : store_restaurants_with_offers,
	store_offers : store_offers,
	store_michelin_restaurants : store_michelin_restaurants,
	get_stored_offers : get_stored_offers
};