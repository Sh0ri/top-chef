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

function scrape_michelin()
{
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
}
/*
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
}*/
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
function fin()
{
	fs.writeFile('output.json', JSON.stringify(allRestaurants, null, 4), function(err){
		console.log('File successfully written! - Check your project directory for the output.json file');
	})
}

function get_JSON(){
	var obj = JSON.parse(fs.readFileSync('output.json', 'utf8'));
	return obj;
	//console.log(obj);
}
//get();

module.exports = {
	scrape_michelin : scrape_michelin,
	get_JSON : get_JSON
};