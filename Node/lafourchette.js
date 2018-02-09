var fs = require('fs');
var express = require('express');
var app = express();
let cheerio = require('cheerio');
let request = require('request');

var restaurants = [];

function get_restaurant(michelin_restaurant,callback)
{
	restaurants = [];
	var url = 'https://m.lafourchette.com/api/restaurant-prediction?name=' + michelin_restaurant.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	console.log(url);
		//var url = 'https://m.lafourchette.com/api/restaurant-prediction?name=Atmosphères';
		request({url:url,json:true}, function(error, response, html){
			if(html != null)
			{
				var new_url = url;
				restaurants = [];

				var $ = cheerio.load(html);
				var body = html;	
				if(body != null)
				{
					try{
						
						html.forEach(function(element){
							var restaurant = {id:"", title : "", address : { address_locality : "", postal_code : ""} };

							restaurant.id = element.id;
							restaurant.title = element.name;
							restaurant.address.address_locality = element.address.address_locality;
							restaurant.address.postal_code = element.address.postal_code;

						//console.log(restaurant);
						restaurants.push(restaurant);

					})

						callback(restaurants);
					}
					catch (e){
						//console.log("cannot do foreach");
						try{
							
							
							var restaurant = {id:"", title : "", address : { address_locality : "", postal_code : ""} };

							restaurant.id = html[0].id;
							restaurant.title = html[0].name;
							restaurant.address.address_locality = html[0].address.address_locality;
							restaurant.address.postal_code = html[0].address.postal_code;

							restaurants.push(restaurant);

							callback(restaurant);
						}
						catch(e){
							callback(null);
						}

					}

				}
			}
		})
	}
	function get_offers(restaurant,callback)
	{
		var url = 'https://m.lafourchette.com/api/restaurant/' + restaurant.id + '/sale-type';
		console.log(url);

		request({url:url,json:true}, function(error, response, html)
		{
			var is_offer = html[0].is_special_offer;
			callback(is_offer);
		})
	}
	function return_offers(restaurant,callback)
	{

	}
	module.exports = {
		get_restaurant : get_restaurant,
		get_offers : get_offers
	};
