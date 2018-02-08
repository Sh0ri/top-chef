var fs = require('fs');
var express = require('express');
var app = express();
let cheerio = require('cheerio');
let request = require('request');

var restaurants = [];

function get_restaurant(michelin_restaurant)
{
	//var url = 'https://m.lafourchette.com/api/restaurant-prediction?name=' + restaurant.title;
	var url = 'https://m.lafourchette.com/api/restaurant-prediction?name=Auberge_du_Cheval';
	request(url, function(error, response, html){
		if(!error)
		{
			var $ = cheerio.load(html);
			var body = $('body').text();

			var obj = JSON.parse(body);
			obj.forEach(function(element) {
				var restaurant = { title : "", address : { address_locality : "", postal_code : ""} };

				restaurant.title = element.name;
				restaurant.address.address_locality = element.address.address_locality;
				restaurant.address.postal_code = element.address.postal_code;

			//console.log(restaurant);
			restaurants.push(restaurant);
		});

			console.log(restaurants);

			restaurants.forEach(function(element){
				if(element.title == michelin_restaurant.title && element.address.address_locality == michelin_restaurant.address.address_locality && element.address.postal_code == michelin_restaurant.address.postal_code)
					console.log("TRUE");
				else
					console.log("FALSE");
			})
		}
		

	})
}
module.exports = {
	get_restaurant : get_restaurant
};
