var fs = require('fs');
var express = require('express');
var app = express();
let cheerio = require('cheerio');
let request = require('request');

var url_array = [];
var new_url_array = [];
var allRestaurants = [];
var restaurants = [];
var restaurant = null;
var compteur = 0;

/*
console.time("exec");

a la fin 
console.timeEnd("exec");

*/

const pSettle = require('p-settle');
const promisify = require('pify');

async function scrape_michelin(){

	const urls = await generate_urls();
	console.log(urls);
	const restaurants = await scrape_pages(urls);
	console.log(restaurants);
	console.log("writing restaurants");
	const result = await write_restaurants(restaurants);
	console.log(result);

}

function generate_urls(){
	return new Promise((resolve,reject) => {
		var url_restaurants = [];
		var urls = [];
		for(i = 1; i <= 35; i++)
		{
			url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
			url += "/page-" + i;
			urls.push(url);
		}


		var obj = urls.map(url => scrape_url(url));

		pSettle(obj).then(result => {
			var compt = 0;
			result.forEach(function(elem){
				if(elem.isFulfilled)
				{
					//console.log(elem);
					compt++;
					url_restaurants = url_restaurants.concat(elem.value);
				}
			})
			console.log("number of pages scraped :");
			console.log(compt);
			resolve(url_restaurants);
		});
	});
}

function scrape_url(url)
{
	return new Promise((resolve, reject) => {
		var array = [];
		request(url, function(error, response, html){
			if(!error){
				var $ = cheerio.load(html);
				$('a[class=poi-card-link]').each(function (i, element) {
					array.push('https://restaurant.michelin.fr' + $(element).attr('href'));
				});
				resolve(array);
			}
			else
			{
				reject("error");
			}
		})
	});
}

function scrape_pages(urls){
	return new Promise((resolve, reject) => {
		var restaurants = [];
		var obj = urls.map(url => scrape_page(url));

		pSettle(obj).then(result => {
			var compt = 0;
			result.forEach(function(elem){
				if(elem.isFulfilled)
				{
					//console.log(elem);
					compt++;
					restaurants.push(elem.value);
				}
			})
			console.log("Number of restaurants :");
			console.log(compt);
			resolve(restaurants);
		});
	});
}

function scrape_page(url)
{
	return new Promise((resolve, reject) => {
		request(url, function(error, response, html){
			if(!error){
				var $ = cheerio.load(html);

				var title, adress, postcode, city;
				var restaurant = { title : "", address : { address_locality : "", postal_code : ""} };

				title = $('.poi_intro-display-title').first().text();
				address_locality = $('.thoroughfare').first().text();
				postcode = $('.postal-code').first().text();
				city = $('.locality').first().text();

				restaurant.title = title.substring(7,title.length -4);
				restaurant.address.address_locality = address_locality;
				restaurant.address.postal_code = postcode;

				resolve(restaurant);
			}
			else{
				reject(error);
			}
		});
	});
}

function write_restaurants(restaurants)
{
	return new Promise((resolve,reject) => {
		fs.writeFile('restaurants_michelin.json', JSON.stringify(restaurants, null, 4), function(err){
			console.log('File successfully written! - Check your project directory for the output.json file');
		})
		resolve("done");
	});

}

function get_JSON(){
	var obj = JSON.parse(fs.readFileSync('restaurants_michelin.json'));
	return obj;
}

module.exports = {
	scrape_michelin : scrape_michelin,
	get_JSON : get_JSON,
};


/*
function scrape_michelin()
{
	return new Promise((resolve, reject) => {
		for(i = 1; i <= 35; i++)
		{
			url = 'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin';
			url += "/page-" + i;
			console.log("BEGIN Get page : " + i);

			scrape_url(url,function(new_url_array)
			{
				new_url_array.forEach(function(page_url){
					restaurant = null;
					scrape_this_page(page_url,function(restaurant){
						allRestaurants.push(restaurant);
						fin();
					});
				})
			})
		}
		resolve("done");
	});
}

function scrape_url(url,callback)
{
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var new_url_array = [];
			$('a[class=poi-card-link]').each(function (i, element) {
				new_url_array.push('https://restaurant.michelin.fr' + $(element).attr('href'));

				url_array.push('https://restaurant.michelin.fr' + $(element).attr('href'));
			});
			callback(new_url_array);
		}
		

	})
	
}

function scrape_this_page(url,callback)
{
	request(url, function(error, response, html){
		if(!error){
			console.log("page : ");
			var $ = cheerio.load(html);
			console.log("===================== PAGE " + url);


			var title, adress, postcode, city;

			var restaurant = { title : "", address : { address_locality : "", postal_code : ""} };
			//var restaurant = { title : "", address : "", postcode : "", city : ""};

			title = $('.poi_intro-display-title').first().text();
			address_locality = $('.thoroughfare').first().text();
			postcode = $('.postal-code').first().text();
			city = $('.locality').first().text();

			restaurant.title = title.substring(7,title.length -4);
			restaurant.address.address_locality = address_locality;
			restaurant.address.postal_code = postcode;

			console.log(restaurant);
			callback(restaurant);

		}
		

	})
	
}
*/
