const michelin = require("./michelin.js");
const lafourchette = require("./lafourchette.js");


const pSettle = require('p-settle');
const promisify = require('pify');
const fs = promisify(require('fs'));

const express = require('express');
///////////////////////////////////////////////////////////////////EXPRESS///////////////////////////////////////////////////////////////////////////


const app = express();
const port = process.env.PORT || 5000;

//BASIC
app.get('/api/get_stored_offers', (req, res) => {
	console.log("Get stored offers basic");
	var obj = lafourchette.get_stored_offers();

	obj = orderbytitle(obj);

	res.send(obj);
});

//ORDER BY ID
app.get('/api/get_stored_offers/orderby/id', (req, res) => {
	console.log("Get stored offers order by ID");
	var obj = lafourchette.get_stored_offers();

	obj = orderbyid(obj);
	
	res.send(obj);
});

//ORDER BY TITLE
app.get('/api/get_stored_offers/orderby/title', (req, res) => {
	console.log("Get stored offers order by title");
	var obj = lafourchette.get_stored_offers();

	obj = orderbytitle(obj);
	
	res.send(obj);
});

//ORDER BY STARS ASC
app.get('/api/get_stored_offers/orderby/starsasc', (req, res) => {
	console.log("Get stored offers order by stars asc");
	var obj = lafourchette.get_stored_offers();

	obj = orderbystarsasc(obj);

	res.send(obj);
});

//ORDER BY STARS DSC
app.get('/api/get_stored_offers/orderby/starsdsc', (req, res) => {
	console.log("Get stored offers order by dsc");
	var obj = lafourchette.get_stored_offers();

	obj = orderbystarsdsc(obj);

	res.send(obj);
});

//UPDATE OFFERS
app.get('/api/update/offers', (req, res) => {
	console.log("Update offers");
	store_offers(res);
});

//UPDATE MICHELIN
app.get('/api/update/michelin', (req, res) => {
	console.log("Update michelin");
	store_michelin_restaurants(res);
});

//UPDATE RESTAURANTS IN LAFOURCHETTE
app.get('/api/update/michelin_restaurants_in_lafourchette', (req, res) => {
	console.log("Update michelin_restaurants_in_lafourchette");
	store_michelin_restaurants_available_in_lafourchette(res);
});

//UPDATE RESTAURANTS WITH OFFERS IN LAFOURCHETTE
app.get('/api/update/restaurants_with_promos', (req, res) => {
	console.log("Update restaurants_with_promos");
	store_restaurants_with_offers(res);
});

app.listen(port, () => console.log(`Listening on port ${port}`));


///////////////////////////////////////////////////////////////////TEST//////////////////////////////////////////////////////////////////////////////

//uncomment the good action
//store_michelin_restaurants();
//store_michelin_restaurants_available_in_lafourchette();
//store_restaurants_with_offers();
//store_offers();


/////////////////////////////////////////////////////////////////FUNCTIONS///////////////////////////////////////////////////////////////////////////

async function store_michelin_restaurants(res){
	const result = await michelin.scrape_michelin();
	pSettle(result).then(result => {
		console.log('ok michelin');
	})
	res.send('michelin done');
	return result;
}

async function store_michelin_restaurants_available_in_lafourchette(res){
	const restaurants_in_lafourchette = await get_michelin_restaurants_in_lafourchette();
	const result = await lafourchette.store_restaurants_on_lafourchette(restaurants_in_lafourchette);
	console.log("save done");
	pSettle(result).then(result => {
		console.log('ok store_restaurants_on_lafourchette');
	})
	res.send('store_restaurants_on_lafourchette done');
	return "restaurants_in_lafourchette";
}

async function store_restaurants_with_offers(res){
	const restaurants_with_offers = await get_restaurants_with_offers();
	const result = await lafourchette.store_restaurants_with_offers(restaurants_with_offers);
	console.log("save done");
	pSettle(result).then(result => {
		console.log('ok store_restaurants_with_offers');
	})
	res.send('store_restaurants_with_offers done');
	return "restaurants_with_offers";
}

async function store_offers(res){

	const offers = await get_offers();
	const result = await lafourchette.store_offers(offers);
	console.log("save done");
	pSettle(offers).then(result => {
		console.log('ok');
	})
	res.send(orderbytitle(offers));
	console.log('res done');
	return "result";
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
					console.log(elem);
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
/////////////////////////////////////////////////////////////////SORT FUNCTIONS////////////////////////////////////////////////////////////////////

function orderbyid(obj){
	return obj.sort(function(a, b){
		if(a.restaurant.id < b.restaurant.id) return -1;
		if(a.restaurant.id > b.restaurant.id) return 1;
		return 0;
	});
}

function orderbytitle(obj){
	return obj.sort(function(a, b){
		if(a.restaurant.title < b.restaurant.title) return -1;
		if(a.restaurant.title > b.restaurant.title) return 1;
		return 0;
	});
}

function orderbystarsasc(obj){
	return obj.sort(function(a, b){
		return a.restaurant.stars - b.restaurant.stars  ||  a.restaurant.title.localeCompare(b.restaurant.title);
	});
}

function orderbystarsdsc(obj){
	return obj.sort(function(a, b){
		return b.restaurant.stars - a.restaurant.stars  ||  a.restaurant.title.localeCompare(b.restaurant.title);
	});
}

/////////////////////////////////////////////////////////////////EXPORTS///////////////////////////////////////////////////////////////////////////

module.exports = {
	store_michelin_restaurants_available_in_lafourchette : store_michelin_restaurants_available_in_lafourchette,
	store_restaurants_with_offers : store_restaurants_with_offers,
	store_offers : store_offers,
	store_michelin_restaurants : store_michelin_restaurants,
	get_stored_offers : get_stored_offers
};